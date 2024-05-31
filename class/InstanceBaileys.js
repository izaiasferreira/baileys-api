require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const makeWASocket = require('@whiskeysockets/baileys').default
const axios = require('axios')
const NodeCache = require("node-cache");
const {
    DisconnectReason,
    fetchLatestBaileysVersion,
    downloadContentFromMessage,
    isJidBroadcast,
    isJidGroup,
    makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys')

const P = require('pino')
const db = require('../database/functions')
const globalVars = require('../globalVars')

const useMongoAuthState = require('../database/useMongoAuthState.js')

const msgCache = new NodeCache({ stdTTL: 60, checkperiod: 30, useClones: false });

function msg() {
    return {
        get: (key) => {
            const { id } = key;
            if (!id) return;
            let data = msgCache.get(id);
            if (data) {
                try {
                    let msg = JSON.parse(data);
                    return msg ? msg.message : undefined;
                } catch (err) {
                    console.log(err);
                }
            }
        },
        save: (msg) => {
            let id = msg.key.id;
            let msgtxt = JSON.stringify(msg);

            try {
                msgCache.set(id, msgtxt);
            } catch (error) {
                console.log(error);
            }
        }
    };
}
const msgDB = msg()

class Baileys {
    constructor({ id, infos }) {
        this.state = infos || {
            id: id || uuidv4(),
            statusConnection: 'disconnected',
            qrcode: null,
            webhook: {
                state: false,
                url: null,
                events: {
                    messageUpsert: true,
                    updateConnectionStatus: true,
                    groupMessageUpsert: false,
                }
            }
        }
        this.sock = null
        this.countQRCode = 0
        this.countReconnect = 0
        this.authState = {}
        this.userDevicesCache = new NodeCache();
        this.msgRetryCounterCache = new NodeCache()
    }

    get sock() {
        if (this.sock) return this.sock
    }

    set sock(value) {
        this._sock = value;
    }


    get dataSession() {
        return this.state
    }

    async connectOnWhatsapp() {
        const { version } = await fetchLatestBaileysVersion()

        this.authState = await useMongoAuthState(this.state.id, false)

        this.sock = makeWASocket({
            browser: ['CatTalk 😺', this._name, 'Chrome'],
            printQRInTerminal: false,
            connectTimeoutMs: 60_000,
            auth: {
                creds: this.authState.state.creds,
                keys: makeCacheableSignalKeyStore(
                    this.authState.state.keys,
                    P({ level: 'error' }),
                ),
            },
            logger: P({ level: 'error' }),
            version,
            retryRequestDelayMs: 10,
            connectTimeoutMs: 60_000,
            qrTimeout: 40_000,
            // shouldIgnoreJid: (jid) => isJidGroup(jid) || isJidBroadcast(jid),
            getMessage: msgDB.get,
            emitOwnEvents: false,
            msgRetryCounterCache: this.msgRetryCounterCache,
            userDevicesCache: this.userDevicesCache,
            generateHighQualityLinkPreview: true,
            syncFullHistory: true,
            transactionOpts: { maxCommitRetries: 5, delayBetweenTriesMs: 50 }
        })
        this.sock.ev.on('creds.update', this.authState.saveCreds)
        this.sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                if (this.countQRCode === 5) {
                    this.countQRCode = 0
                    this.state.statusConnection = 'timeout'
                    this.state.qrcode = null
                    await this.sendEventForWebhook({
                        event: 'qrcode.update',
                        data: this.state
                    })

                    this.state.statusConnection = 'disconnected'
                    await this.sendEventForWebhook({
                        event: 'connection.update',
                        data: this.state
                    })

                    this.sock.ev.removeAllListeners()
                    this.end(true)

                } else {
                    this.countQRCode++
                    this.state.statusConnection = 'qrcode'
                    this.state.qrcode = qr

                    await this.sendEventForWebhook({
                        event: 'qrcode.update',
                        data: this.state
                    })
                }
            }

            if (connection === 'close') {
                const shouldRecnnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
                if (shouldRecnnect) {
                    if (lastDisconnect.error?.output?.statusCode === 401 && this.countReconnect > 3) {
                        this.end()
                        this.connectOnWhatsapp()
                    } else if ((lastDisconnect.error?.output?.statusCode === 410 ||
                        lastDisconnect.error?.output?.statusCode === 408) &&
                        this.countReconnect > 3
                    ) {
                        this.connectOnWhatsapp()
                    } else {
                        this.connectOnWhatsapp()
                        this.countReconnect++
                    }
                }

                if (shouldRecnnect === false) {
                    if (this._countReconnect > 3) {

                        this.state.statusConnection = 'disconnected'

                        await this.sendEventForWebhook({
                            event: 'connection.update',
                            data: this.state
                        })

                        this.end()
                    } else {
                        this.connectOnWhatsapp()
                        this.countReconnect++
                    }

                }
            }

            if (connection === 'open') {
                this.state.jid = this.sock.user.id
                this.state.phoneNumber = this.state.jid.substring(0, 12)
                this.state.phoneNumberFormated = formatIdToPhoneNumber(this.state.jid)
                this.state.profilePic = this.getProfilePic(this.state.jid)
                this.countQRCode = 0
                this.state.qrcode = null
                this.state.statusConnection = 'connected'
                this.state
                await db.updateSession({ id: this.state.id }, this.state)

                await this.sendEventForWebhook({
                    event: 'connection.update',
                    data: this.state
                })

                this.initSockEvents()



            }
        })
    }

    async initSockEvents() {
        this.sock.ev.on('contacts.upsert', async (contacts) => {
            var contactsForSync = []
            for (const contact of contacts) {
                contactsForSync.push({
                    id: contact.id,
                    userName: contact.name || formatIdToPhoneNumber(contact.id),
                    fromApp: 'whatsapp',
                    connection: { id: this.state.id, name: this._name, phoneNumber: this._phoneNumber },
                    profilePictureUrl: (await this.getProfilePic(contact.id))
                })
            }
            await db.updateSession({ id: this.state.id }, { contacts: contactsForSync })

            await this.sendEventForWebhook({
                event: 'contacts.upsert',
                data: contactsForSync
            })
        })
        this.sock.ev.on('messages.upsert', async ({ messages }) => {
            for (const msg of messages) {
                if (msg?.message) {
                    const jid = msg.key.remoteJid
                    await this.sendEventForWebhook({
                        event: 'message.upsert',
                        data: msg,
                        more: {
                            fromMe: msg.key.fromMe,
                            isGroup: isJidGroup(jid),
                            isBroadcast: isJidBroadcast(jid),
                        }
                    })

                    msgDB.save(msg)
                }
            }

        })
    }

    async end(logout) {
        if (this.sock) {
            this.countQRCode = 0
            this.state.statusConnection = 'disconnected'

            this.sock.ev.removeAllListeners('connection.update')
            if (logout) { this.sock.logout() }
            this.sock.end()
            this.sock.ev.removeAllListeners('connection.update')
            await db.deleteSession(this.state.id)
            await db.deleteAuthSession(this.state.id)

            await this.sendEventForWebhook({
                event: 'connection.update',
                data: this.state
            })

            var instances = globalVars.instances.filter(instance => instance.state.id !== this.state.id)
            globalVars.instances = instances

        }
    }

    async sendEventForWebhook({ event, data, more }) {
        if (!event || !data) {
            console.log("Event and data are required");
            return;
        }

        const body = {
            event: event,
            data: data
        };

        if (more) {
            body.info = more;
        }

        if (this.state.webhook.state) {
            try {
                globalVars.io.emit('events', body)
                const response = await axios.post(this.state.webhook.url, body);
                console.log("Webhook response:", response.data);
            } catch (error) {
                console.log("Error sending webhook:", error.message);
            }
        }
    }


    async getProfilePic(jid) {
        return await this.sock.profilePictureUrl(jid, 'image')
    }

    //--------------------------------------------------------

    async executeSendMessage(arrayParams) {
        try {
            var response = await this.sock.sendMessage(...arrayParams);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
    async sendMessageText({ id, text, quoted }) {
        const messageArray = [`${id.replace(/[\s-()]/g, '')}@s.whatsapp.net`, { text: text }];

        if (quoted) {
            messageArray.push({ quoted: quoted });
        }

        if (this.sock) {
            return await this.executeSendMessage(messageArray)
        }
    }

    async sendMessageMedia({ id, type, text, url, fileName, mimeType, quoted, newAudio }) {
        var messageArray = [
            `${id.replace(/[\s-()]/g, '')}@s.whatsapp.net`,
            {
                caption: text || null,
                fileName: fileName,
                mimetype: mimeType,
                ptt: newAudio || false,
                [type]: {
                    url: url,
                }
            }
        ];
        if (quoted) {
            messageArray.push({ quoted: quoted });
        }
        if (this.sock) {
            return await this.executeSendMessage(messageArray)
        }
    }

    async deleteMessage(jid, msg, type) {
        const { key, fromMe, messageTimestamp } = msg
        if (this.sock) {
            var response = null
            if (type) {
                response = await this.sock.sendMessage(jid, { delete: key })
            }
            if (!type) {
                response = await this.sock.chatModify({ clear: { messages: [{ id: key.id, fromMe: fromMe, timestamp: messageTimestamp }] } }, jid, [])

            }
            return response
        }
    }

    async downloadMedia(msg) {
        const typeMessage = Object.keys(msg.message)[0]
        if (typeMessage === 'stickerMessage') {
            msg.message.stickerMessage.url = 'https://mmg.whatsapp.net' + msg.message.stickerMessage.directPath + "&mms3=true"
        }
        const fileTypes = [
            { messageType: 'stickerMessage', type: "sticker", extension: 'webp', downloadContent: msg?.message.stickerMessage },
            { messageType: 'imageMessage', type: 'image', extension: 'jpeg', downloadContent: msg?.message.imageMessage },
            { messageType: 'videoMessage', type: 'video', extension: 'mp4', downloadContent: msg?.message.videoMessage },
            { messageType: 'audioMessage', type: 'audio', extension: 'mp3', downloadContent: msg?.message.audioMessage },
            { messageType: 'documentMessage', type: 'document', extension: null, downloadContent: msg?.message.documentMessage },
            { messageType: 'messageContextInfo', type: 'document', extension: null, downloadContent: msg?.message.documentMessage }
        ]
        var fileType = fileTypes[fileTypes.findIndex(index => { return index.messageType === typeMessage })]
        // download stream
        if (fileType) {
            const stream = await downloadContentFromMessage(fileType?.downloadContent, fileType?.type)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            return buffer
        }

        return null
    }

    async veriyExistsNumber(jid) {
        if (jid && this.sock) {
            const value = await this.sock.onWhatsApp(jid);
            return value[0]
        }
    }
}

module.exports = Baileys;


const formatIdToPhoneNumber = (idClient) => {
    var number = `${idClient.replace('@s.whatsapp.net', '')}`
    var country = number.slice(0, 2);
    var ddd = number.slice(2, 4)
    var numberPartOne = number.slice(4, 8)
    var numberPartTwo = number.slice(8, 12)
    return `+${country} (${ddd}) ${numberPartOne}-${numberPartTwo}`
}




function getTextMessage(msg) {
    if (!msg) return null
    var test = Object.keys(msg.message)
    if (test.findIndex(obj => obj === "extendedTextMessage") !== -1) {
        return msg.message.extendedTextMessage.text
    }
    if (test.findIndex(obj => obj === "conversation") !== -1) {
        return msg.message.conversation
    }
}
const getFileTypeFromBuffer = async (myBuffer) => {
    try {
        const { fileTypeFromBuffer } = await import('file-type');
        const type = await fileTypeFromBuffer(myBuffer);
        return type;
    } catch (error) {
        console.error('Erro ao obter o tipo do arquivo:', error);
        return null;
    }
};

