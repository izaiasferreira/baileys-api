require('dotenv').config();
const globalVars = require('./globalVars');

var express = require('express');
var app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});
globalVars.io = io

const connectDatabase = require('./database/connection');
const db = require('./database/functions');

var logger = require('morgan');
var cors = require('cors');
const path = require('path');


const Baileys = require('./class/InstanceBaileys');
const { verifyJWT } = require('./config/auth');

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'front/dist')));


// Servir arquivos estáticos da pasta "public"
app.use(express.static('public'));



globalVars.io.on("connection", (socket) => {
    socket.on('connectInstance', async (id) => {
        var instance = await findInstance(id)

        if (instance) {
            delete instance.contacts
            var a = new Baileys({ infos: instance })
            globalVars.instances[a.state.id] = a
            await globalVars.instances[a.state.id].connectOnWhatsapp()

        }
    });
    socket.on('disconnectInstance', async (id, callback) => {
        var instances = await findInstance(id)
        if (instances) {
            await globalVars?.instances[id]?.endSession()
            callback(await db.getSessions())
            console.log('desconnectado')
        }
    });

    socket.on('getInstances', async (callback) => {
        if (callback) callback(await db.getSessions())
    });

    socket.on('createInstance', async (id, callback) => {
        var instance = await findInstance(id)
        if (!instance) {
            await db.createSession(new Baileys({ id: id }).state)
            callback(await db.getSessions())
            console.log('Instância criada')
        }
    });

    socket.on('updateInstance', async (data, callback) => {
        var instance = await findInstance(data.id)
        if (instance) {
            await db.updateSession({ id: data.id }, data)
            console.log(data);
            if (globalVars.instances[data.id]) globalVars.instances[data.id].state = data
            callback(await db.getSessions())
            console.log('Instância criada')
        }
    });

    socket.on('deleteInstance', async (id, callback) => {
        var instance = await findInstance(id)
        if (instance) {
            await globalVars?.instances[instance.id]?.endSession(true)
            await db.deleteSession(instance.id)
            await db.deleteAuthSession(instance.id)
            callback(await db.getSessions())
            console.log('desconnectado e deletado')
        }
    });


})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-vite-app/dist', 'index.html'));
});

app.get('/instances', (req, res) => {
    db.getSessions().then((result) => {
        const map = result?.map(i => {
            delete i.contacts
            return i
        })
        return res.status(200).json(map)
    })
});

app.get('/instance', verifyJWT, async (req, res) => {
    try {
        var instance = await findInstance(req.instance)
        delete instance._id
        return res.status(200).json(instance).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.post('/instance', async (req, res) => {
    try {
        const { id, name } = req.body
        var instance = await findInstance(id)
        if (!instance) {
            const result = await db.createSession(new Baileys({ id: id, name: name || null }).state)
            delete result._id
            globalVars.io.emit('updateInstances', await db.getSessions())
            console.log('Instância criada')
            return res.status(200).json(result).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.put('/instance', verifyJWT, async (req, res) => {
    try {
        const { name } = req.body
        const result = await db.updateSession({ id: req.instance }, { name: name })
        delete result._id
        globalVars.io.emit('updateInstances', await db.getSessions())
        console.log('Instância atualizada')
        return res.status(200).json(result).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.delete('/instance', verifyJWT, async (req, res) => {
    try {
        await db.deleteSession(req.instance)
        globalVars.io.emit('updateInstances', await db.getSessions())
        if (globalVars.instances[req.instance]) globalVars.instances[req.instance].endSession(true)
        console.log('Instância deletada')
        return res.status(200).json({ id: req.instance, status: 'deleted' }).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});


app.put('/webhook', verifyJWT, async (req, res) => {
    try {
        const { state, events, url } = req.body
        var instance = await findInstance(req.instance)
        const data = {
            url: url || instance.webhook.url,
            events: { ...instance.webhook.events, ...events },
            state: state || false
        }
        const result = await db.updateSession({ id: req.instance }, { webhook: data })
        delete result._id
        delete result.contacts

        if (globalVars.instances[req.instance]) globalVars.instances[req.instance].state.webhook = data

        globalVars.io.emit('updateInstances', await db.getSessions())
        console.log('Webhook de instância atualizado')
        return res.status(200).json(result).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});


app.get('/connect', verifyJWT, async (req, res) => {
    try {
        var instance = await findInstance(req.instance)
        delete instance.contacts
        var a = new Baileys({ infos: instance })
        globalVars.instances[a.state.id] = a
        await globalVars.instances[a.state.id].connectOnWhatsapp()
        return res.status(200).json(await db.getSession({ id: req.instance })).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.delete('/disconnect', verifyJWT, async (req, res) => {
    try {
        await globalVars?.instances[req.instance]?.endSession()
        globalVars.io.emit('updateInstances', await db.getSessions())
        return res.status(200).json(await db.getSession({ id: req.instance })).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.get('/contacts', verifyJWT, async (req, res) => {
    try {
        var session = await db.getSession({ id: req.instance })
        return res.status(200).json(session?.contacts || []).end()
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }

});

app.post('/sendMessageText', verifyJWT, async (req, res) => {
    try {
        const instance = await findInstance(req.instance)
        if (instance && instance.statusConnection === 'connected' && globalVars.instances[req.instance]) {
            var response = await globalVars.instances[req.instance].sendMessageText(req.body)
            res.status(200).json(response)
        } else {
            return res.status(400).json({ message: 'Conexão desconectada' }).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.post('/sendMessageMedia', verifyJWT, async (req, res) => {
    try {
        const instance = await findInstance(req.instance)
        if (instance && instance.statusConnection === 'connected' && globalVars.instances[req.instance]) {
            var response = await globalVars.instances[req.instance].sendMessageMedia(req.body)
            res.status(200).json(response)
        } else {
            return res.status(400).json({ message: 'Conexão desconectada' }).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.put('/editMessage', verifyJWT, async (req, res) => {
    try {
        const instance = await findInstance(req.instance)
        if (instance && instance.statusConnection === 'connected' && globalVars.instances[req.instance]) {
            var response = await globalVars.instances[req.instance].updateMessage(req.body)
            res.status(200).json(response)
        } else {
            return res.status(400).json({ message: 'Conexão desconectada' }).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});


app.delete('/deleteMessage', verifyJWT, async (req, res) => {
    try {
        const instance = await findInstance(req.instance)
        if (instance && instance.statusConnection === 'connected' && globalVars.instances[req.instance]) {
            var response = await globalVars.instances[req.instance].deleteMessage(req.body)
            res.status(200).json(response)
        } else {
            return res.status(400).json({ message: 'Conexão desconectada' }).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json(error).end()
    }
});

app.post('/verifyExistsNumber', async (req, res) => {
    const { id: sessionId } = req.query
    const { id } = req.body
    console.log(id);
    var index = findInstance(sessionId)
    if (!index) {
        var status = await globalVars.instances[index].veriyExistsNumber(id)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});

app.post('/getProfilePic', async (req, res) => {
    const { id: sessionId } = req.query
    const { id } = req.body
    var index = findInstance(sessionId)
    if (index >= 0 && index !== null && id) {
        var status = await globalVars?.instances[index]?.getProfilePic(id).catch(err => console.log('erro getProfilePic'))
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});


connectDatabase(process.env.DATABASE_URL, () => {
    db.getSessions().then(async (result) => {
        if (result) {
            result?.forEach(async instance => {
                if (instance.statusConnection !== 'connected') {
                    await db.updateSession({ id: instance.id }, { statusConnection: 'disconnected', qrcode: null })
                    return
                }
                delete instance.contacts
                var a = new Baileys({ infos: instance })
                globalVars.instances[a.state.id] = a
                await globalVars.instances[a.state.id].connectOnWhatsapp()
            });
        }
    })
})



httpServer.listen(process.env.PORT || 3000, () => {
    console.log("\x1b[33m%s\x1b[0m", "SERVIDOR RODANDO NA PORTA", process.env.PORT || 3000);
});

async function findInstance(instanceId) {
    return await db.getSession({ id: instanceId })
}
