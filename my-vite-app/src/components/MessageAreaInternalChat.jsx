
import './MessageAreaInternalChat.css'
import MessageComponentSiteInternalChat from './MessageComponentSiteInternalChat'
import MessageResponseArea from './MessageResponseArea'
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import IconButton from './IconButton';
import { AppContext } from '../contexts/userData';
import { ApiBack } from '../service/axios';
import { AuthUser } from '../contexts/authentication';
import InputText from './InputText';
import ButtonModel from './ButtonModel';
import BubblesContainer from './BubblesContainer';
import FullArea from './FullArea'
import FilesPreview from './FilesPreview'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputTextAreaDInamicWidth from './InputTextAreaDInamicWidth'
import EmojiComponent from './EmojiComponent'
import { debounce } from '@mui/material'
import AudioRecorder from './AudioRecorder'
import Timer from './Timer'
import FormatMessageInternalChat from '../service/formatMessageInternalChat'
import notification from '../service/notificationsBack'
import playAudio from '../service/playAudio'


export default function MessageAreaInternalChat({ roomData, readAllMessages, onMessagesUnread }) {
    const { user, client, chatDataBase, setChatDatabase, socket, internalChatRooms, companyData } = useContext(AppContext)
    const { userData, logout } = useContext(AuthUser)
    const [quantityMessages, setQuantityMessages] = useState(1);
    const [messagesToShow, setMessagesToShow] = useState([]);
    const [textMessage, setTextMessage] = useState(null)
    const [stateFilesPreview, setStateFilesPreview] = useState(false)
    const [stateFilesObject, setStateFilesObject] = useState({ file: null, type: null })
    const [messageResponse, setMessageResponse] = useState(null)
    const messageEndRef = useRef(null)
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const [audioRecord, setAudioRecord] = useState(false);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    const dataBubles = [
        {
            icon: <i className='bx bx-image' ></i>,
            name: 'Imagem',
            action: () => { click('Internal-chat-file-image') },
            color: '#F55064'
        },
        {
            icon: <i className='bx bx-video' ></i>,
            name: 'Video',
            action: () => { click('Internal-chat-file-video') },
            color: '#ff9800'
        },
        {
            icon: <i className='bx bx-music' ></i>,
            name: 'Audio',
            action: () => { click('Internal-chat-file-audio') },
            color: '#d22929'
        },
        {
            icon: <i className='bx bx-file'></i>,
            name: 'Documento',
            action: () => { click('Internal-chat-file-document') },
            color: '#4caf50'
        },
        {
            icon: <i className='bx bx-sticker' ></i>,
            name: 'Sticker',
            action: () => { click('Internal-chat-file-sticker') },
            color: '#9c27b0'
        }
    ]

    useEffect(() => {
        if (roomData) socket?.emit('getMessagesInternalChat', roomData?._id, userData?.token, (response) => {

            setMessagesToShow(response)
        })
    }, [internalChatRooms])
    useEffect(() => {
        // console.log(readAllMessages);
        if (readAllMessages === true) {
            socket?.emit('readMessages', userData?.token)
        }
    }, [readAllMessages])
    useEffect(() => {
        var filter = messagesToShow.filter((message) => !message?.read.includes(user._id))
        // console.log(filter.length);
        onMessagesUnread(filter.length)
    }, [messagesToShow])

    const scrollToRef = useCallback((ref) => {
        setTimeout(() => {
            ref.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: 'smooth' })
        }, 2);
    }, []);
    const scrollToEnd = useCallback(() => { //rola a div de mensagens para baixo toda vez que uma mensagem é renderizada na tela;
        setTimeout(() => {
            scrollToRef(messageEndRef)
        }, 300);
    }, [scrollToRef])

    const compareArrays = useCallback((arr1, arr2) => {
        // verifica se os arrays têm o mesmo comprimento
        if (arr1?.length !== arr2?.length) {
            return false;
        }

        // percorre cada item dos arrays
        for (let i = 0; i < arr1?.length; i++) {
            const item1 = arr1[i];
            const item2 = arr2[i];

            // se os itens forem objetos ou arrays, compara recursivamente
            if (typeof item1 === 'object' && typeof item2 === 'object') {
                const areEqual = compareArrays(item1, item2);
                if (!areEqual) {
                    return false;
                }
            } else {
                // se os itens não forem objetos ou arrays, compara diretamente
                if (item1 !== item2) {
                    return false;
                }
            }
        }

        // se os arrays forem iguais, retorna true
        return true;
    }, [])





    const handleTextChange = debounce((textValue) => {
        setTextMessage(textValue);
    }, 300);
    function readMessages() {
        var chatCopy = JSON.parse(JSON.stringify(chatDataBase))
        var indexClient = chatCopy.findIndex(chat => chat.chatId === client?.client.chatId && chat.connectionId === client?.client.connectionId)
        chatCopy[indexClient].messages = chatCopy[indexClient].messages.map(message => {
            message.read = true
            return message
        })
        ApiBack.put('connection/readMessages', { connectionId: client?.client.connectionId, id: client?.client.chatId })
        setChatDatabase(chatCopy)
    }

    async function sendMessage(messageResponse, messageText, messageFile, messageType) {
        // console.log(companyData);
        var message = {
            roomId: roomData?._id,
            response: messageResponse,
            typeMessage: messageType,
            userId: user?._id,
            nameUser: user?.name,
            to: roomData?._id,
            file: messageFile,
            text: messageText,
            companyId: companyData?._id || companyData?.id || null
        }
        // console.log(FormatMessageInternalChat(message));
        // console.log(socket);
        socket?.emit('sendMessageInternalChat', FormatMessageInternalChat(message), userData?.token)
    }


    const verifyNumber = (value) => {
        var string = value.toString()
        var point = string.indexOf('.')
        if (point >= 0) {
            var valuePositon = parseInt(string[point + 1])
            if (valuePositon >= 5) {
                return false
            } else {
                return true
            }
        } else {
            return false
        }
    }

    const verifyDifferenceBetweenArrays = useCallback((largeArray, array2) => {
        var difference = []
        largeArray.forEach((elementLargeArray) => {
            var index = array2.findIndex(e => JSON.stringify(e) === JSON.stringify(elementLargeArray))
            if (index === -1) {
                difference.push(elementLargeArray)
            }
        })
        return difference.length > 0 ? difference : null
    }, [])

    const getMoreMessages = (messagesToShow) => {
        // var index = chatDataBase.findIndex(chat => chat.chatId === client?.client.data.id && chat.connectionId === client?.client.data.connection.id)
        var math = messagesToShow.length / 30
        socket?.emit('getMoreMessagesInternalChat', roomData?._id, quantityMessages, userData?.token, (responseMessage) => {
            setMessagesToShow(JSON.parse(JSON.stringify(responseMessage)))
            setQuantityMessages(quantityMessages => quantityMessages + 1)
        })
        // if (index >= 0) {

        // var difference = verifyDifferenceBetweenArrays(responseMessage.data, messagesToShowData)
        // if (difference.length > 0) {
        //     messagesToShowData.push(...difference)
        //     chatDataBase[index].message = messagesToShowData
        //     setMessagesToShow(oldMessages => [...oldMessages, ...difference])
        // }
        // }
    }


    const click = useCallback((id) => {
        document.getElementById(id).click();
    }, [])

    const showFileToUpload = useCallback((e, type) => {
        setStateFilesObject({ type: type, file: e })
        setStateFilesPreview(true)
    }, [setStateFilesObject, setStateFilesPreview])

    const convertToWebp = useCallback(async (file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const blob = await new Promise((resolve) =>
            canvas.toBlob((blob) => resolve(blob), 'image/webp')
        );
        return new File([blob], file.name.substring(0, file.name.indexOf('.')) + '.webp', { type: 'image/webp' });
    }, [])

    const uploadFile = useCallback(async (element) => {
        var type = element?.type
        var file = type === 'sticker' ? await convertToWebp(element?.file?.target?.files[0]) : element?.file?.target?.files[0]
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file?.name || 'file');
        formData.append('typeUpload', type);
        var index = file?.type?.indexOf('/')
        var responseData
        await ApiBack.post('connection/uploadFile', formData)
            .then((response) => {
                responseData = response.data
                console.log(response.data, 'resposta');
            }).catch((err) => {
                responseData = err.response.data
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
        responseData.name = file?.name || 'file'
        responseData.extension = file.type.substring(index + 1, file.type.length)
        return responseData
    }, [convertToWebp])
    async function uploadBuffer(buffer, name, typeUpload, mimeType) {
        try {
            const blob = new Blob([buffer], { type: mimeType });
            const formData = new FormData();
            formData.append('file', blob, name || 'file');
            formData.append('typeUpload', typeUpload);

            const response = await ApiBack.post('connection/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            var file = response.data;
            file['name'] = name;
            return file;
        } catch (error) {
            console.error('Erro ao fazer upload do buffer:', error);
            throw error;
        }
    }
    socket.off('responseMessageInternalChat').on("responseMessageInternalChat", async (messages) => {
        // console.log(messages);
        var messagesToShowCopy = JSON.parse(JSON.stringify(messagesToShow))
        messagesToShowCopy.unshift(messages)
        setMessagesToShow(messagesToShowCopy)
        if (messages.from.id !== user._id) {
            notification(`Mensagem de ${messages.from.name}`)
            playAudio('./audio/messageInternalChat.mp3')
        }
        if (readAllMessages === true) {
            socket?.emit('readMessages', userData?.token)
        }
        scrollToEnd(messageEndRef)
    })
    socket.off('readMessagesResponse').on("readMessagesResponse", async (messages) => {
        var messagesToShowCopy = JSON.parse(JSON.stringify(messagesToShow))
        for (let index = 0; index < messages.length; index++) {
            var index2 = messagesToShowCopy.findIndex(message => message._id === messages[index]._id)
            messagesToShowCopy[index2] = messages[index]
        }
        setMessagesToShow(messagesToShowCopy)
    })
    return (
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <div className="message-area-internalchat-container">

                <div className="message-area-internalchat-header">
                    <div className='contact-name-number-profilepic'>
                        <div className='contact-name-number-profilepic-content'>
                            <img className='profilepic' src='/img/group-avatar.svg' alt='profilePic' />
                            <div className="name-number">
                                <span className='name'>{roomData?.name}</span>
                                <span className='number'>{`${roomData?.participants?.length} participantes`}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="message-area-internalchat-middle" id="message-area-internalchat-middle">
                    <div className="more-messages">
                        <IconButton onClick={() => { getMoreMessages(messagesToShow) }}><i className='bx bx-rotate-left'>
                        </i></IconButton>
                    </div>

                    {
                        messagesToShow?.slice(0).reverse().map((m) => {
                            return <MessageComponentSiteInternalChat key={m._id} message={m} onChange={async (data) => {


                            }} />
                        })
                    }
                    <div className="end-message" ref={messageEndRef}>ㅤ</div>
                </div>
                <FullArea open={stateFilesPreview} onClose={() => {
                    document.getElementById(stateFilesObject.file.target.id).value = ''
                    setStateFilesObject({ file: null, type: null })
                    setStateFilesPreview(false)
                }}>
                    <div className="preview-file-upload">
                        <FilesPreview file={stateFilesObject} onClose={() => {
                            setStateFilesObject({ file: null, type: null });
                            setStateFilesPreview(false);
                        }} />
                        {
                            stateFilesObject?.file ?
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <div className="input">
                                        <InputText
                                            disabled={['sticker', 'audio'].includes(stateFilesObject.type) ? true : false}
                                            onChange={(textValue) => { handleTextChange(textValue) }}
                                            size='large'
                                            emoji={true}
                                            onFocus={true}
                                            onEnter={(messageText) => {
                                                setStateFilesObject({ file: null, type: null });
                                                uploadFile(stateFilesObject).then(data => {
                                                    sendMessage(messageResponse, messageText, data, data.type).then(() => {
                                                        scrollToEnd(messageEndRef)
                                                        setStateFilesPreview(false)
                                                        setStateFilesObject({ file: null, type: null })
                                                    })
                                                }).catch(() => {
                                                    setStateFilesPreview(false)
                                                    setStateFilesObject({ file: null, type: null })
                                                })

                                            }}
                                            id='messageTextInputInternalChat2'
                                            placeholder='Digite sua Mensagem'
                                            clear={true} />
                                        <ButtonModel
                                            onClick={() => {
                                                var message = document.getElementById('messageTextInputInternalChat2')
                                                uploadFile(stateFilesObject).then(data => {
                                                    console.log(data.url);
                                                    sendMessage(messageResponse, message.value, data, data.type)
                                                        .then(() => {
                                                            scrollToEnd(messageEndRef)
                                                            message.value = ""
                                                            setStateFilesPreview(false)
                                                            setStateFilesObject({ file: null, type: null })
                                                        })
                                                    //limpa o input de mensagem

                                                }).catch(() => {
                                                    setStateFilesPreview(false)
                                                    setStateFilesObject({ file: null, type: null })
                                                })
                                            }}
                                            type='circle-primary'
                                        > <i className='bx bx-send'></i>
                                        </ButtonModel>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </FullArea>
                <div className="message-area-internalchat-footer">
                    {messageResponse ? <MessageResponseArea message={messageResponse} onClose={() => { setMessageResponse(null) }} /> : null}
                    <div className="message-area-internalchat-footer-switch">


                    </div>
                    <div className="message-area-internalchat-footer-content">
                        {
                            !audioRecord ?
                                <InputTextAreaDInamicWidth
                                    width={80}
                                    color={'var(--color-one)'}
                                    onFocus
                                    id='messageTextInputInternalChat'
                                    placeholder='Digite aqui sua mensagem...'
                                    onChange={(textValue) => { handleTextChange(textValue) }}
                                    onEnter={async (text) => {
                                        await sendMessage(messageResponse, text, null, 'text')
                                            .then(() => {
                                                scrollToEnd(messageEndRef)
                                                setTextMessage(null)
                                            })
                                    }}
                                /> : null
                        }
                        <div className="buttons">
                            <div className="left">
                                <BubblesContainer
                                    data={dataBubles}
                                    icon={{ icon: <i className='bx bx-paperclip bx-rotate-90' ></i> }} />

                                <input accept="image/*" className='file-hide' type="file" id="Internal-chat-file-image" onChange={(event) => { showFileToUpload(event, 'image') }} />
                                <input accept="video/*" className='file-hide' type="file" id="Internal-chat-file-video" onChange={(event) => { showFileToUpload(event, 'video') }} />
                                <input accept="application/*" className='file-hide' type="file" id="Internal-chat-file-document" onChange={(event) => { showFileToUpload(event, 'document') }} />
                                <input accept="image/*" className='file-hide' type="file" id="Internal-chat-file-sticker" onChange={(event) => { showFileToUpload(event, 'sticker') }} />
                                <input accept="audio/*, audio/ogg" className='file-hide' type="file" id="Internal-chat-file-audio" onChange={(event) => { showFileToUpload(event, 'audio') }} />
                                <EmojiComponent target={anchorEmoji} onClick={async () => { await targetEmoji(document.getElementById('messageTextInputInternalChat')) }} />
                            </div>
                            {audioRecord ? <Timer /> : null}
                            {
                                textMessage ?
                                    <ButtonModel
                                        onClick={async () => {
                                            var message = document.getElementById('messageTextInputInternalChat')
                                            sendMessage(messageResponse, textMessage, null, 'text')
                                                .then(() => {
                                                    scrollToEnd(messageEndRef)
                                                })
                                            message.value = ""//limpa o input de mensagem
                                            setTextMessage(null)
                                        }}
                                        type='circle-primary'
                                    > <i className='bx bx-send'></i>
                                    </ButtonModel>
                                    :
                                    <ButtonModel
                                        id={'button-microphone'}
                                        type='circle-primary'
                                        onClick={async () => {
                                            setAudioRecord(audioRecord => !audioRecord)
                                            // alert('Em breve!')
                                        }}
                                    > {!audioRecord ? <i className='bx bxs-microphone' ></i> : <i className='bx bxs-square-rounded' ></i>}
                                    </ButtonModel>
                            }
                            <AudioRecorder
                                record={audioRecord}
                                onChangeBuffer={(buffer) => {
                                    uploadBuffer(buffer, 'audio.wav', 'audio', 'audio/mp3').then((response) => {
                                        sendMessage(messageResponse, null, response, 'audio')
                                    })
                                }}
                            />
                        </div>
                    </div>



                </div>
            </div >
        </div>
    )
}
