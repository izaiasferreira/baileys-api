
import './MessageArea.css'
import MessageComponent from './MessageComponent'
import MessageResponseArea from './MessageResponseArea'
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { Ring } from '@uiball/loaders'
import IconButton from './IconButton';
import { AppContext } from '../contexts/userData';
import { ApiBack } from '../service/axios';
import SectorsForTransfer from './SectorsForTransfer';
import DialogBox from './DialogBox';
import { AuthUser } from '../contexts/authentication';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import InputText from './InputText';
import ButtonModel from './ButtonModel';
import Bar from './Bar';
import Button from './Button';
import BubblesContainer from './BubblesContainer';
import FullArea from './FullArea'
import FilesPreview from './FilesPreview'
import FormatMessage from '../service/formatMessage'
import configureLastMessage from '../service/configureLastMessage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LateralBar from './LateralBar'
import Space from './Space'
import InputTextArea from './InputTextArea'
import InputTextAreaDInamicWidth from './InputTextAreaDInamicWidth'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import responseSocketRequest from '../service/responseSocketRequest'
import BookmarkForListMessageArea from './BookmarkForListMessageArea'
import EmojiComponent from './EmojiComponent'
import { debounce } from '@mui/material'
import Switch from './Switch'
import Timer from './Timer'
import DisplayInfoMessageArea from './DisplayInfoMessageArea'
import DisplayInfoIdContent from './DisplayInfoIdContent'
import DialogBoxChildren from './DialogBoxChildren'
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { GoogleGenerativeAI } from "@google/generative-ai"
import SendPreset from './SendPreset.jsx'
import deleteParam from '../service/deleteParamUrl.jsx'
// Access your API key as an environment variable (see "Set up your API key" above)


export default function MessageArea() {
    const { user, client, setUser, setClient, bookmarks, chatDataBase, setChatDatabase, socket, quickMessages, usersList, setUsersList } = useContext(AppContext)
    const { logout } = useContext(AuthUser)
    const [messagesToShow, setMessagesToShow] = useState(null);
    const [textMessage, setTextMessage] = useState(null)
    const [anotationsMessageState, setAnotationsMessageState] = useState(false)
    const [stateFilesPreview, setStateFilesPreview] = useState(false)
    const [stateFilesObject, setStateFilesObject] = useState({ file: null, blob: null, type: null })
    const [messageResponse, setMessageResponse] = useState(null)
    const messageEndRef = useRef(null)
    const [userInAttendance, setUserInAttendance] = useState(null)
    const [stateDialogEndChat, setStateDialogEndChat] = useState(false)
    const [stateSignature, setStateSignature] = useState(user?.signature)
    const [sideBarState, setSideBarState] = useState(false);
    const [anotationsState, setAnotationsState] = useState(false);
    const [anotations, setAnotations] = useState(null);
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const [emojiState, setEmojiState] = useState(false);
    const [quickMessagesState, setQuickMessagesState] = useState(false);
    const [quickMessagesToShow, setQuickMessagesToShow] = useState([]);
    const [quickMessagesWordFind, setQuickMessagesWordFind] = useState(null);
    const [buttonEditName, setButtonEditName] = useState(false);
    const [scrollState, setScrollState] = useState(true);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    const {
        startRecording,
        stopRecording,
        recordingBlob,
        isRecording
    } = useAudioRecorder();



    const click = useCallback((id) => {
        document.getElementById(id).click();
    }, [])
    const dataBubles = ['whatsapp', 'whatsapp_business_account'].includes(client?.client?.data?.appFrom) ?
        [
            {
                icon: <i className='bx bx-image' ></i>,
                name: 'Imagem',
                action: () => { click('file-image'); },
                color: '#F55064'
            },
            {
                icon: <i className='bx bx-video' ></i>,
                name: 'Video',
                action: () => { click('file-video'); },
                color: '#ff9800'
            },
            {
                icon: <i className='bx bx-music' ></i>,
                name: 'Audio',
                action: () => { click('file-audio') },
                color: '#d22929'
            },
            {
                icon: <i className='bx bx-file'></i>,
                name: 'Documento',
                action: () => { click('file-document') },
                color: '#4caf50'
            }/* ,
            {
                icon: <i className='bx bx-sticker' ></i>,
                name: 'Sticker',
                action: () => { click('file-sticker') },
                color: '#9c27b0'
            } */
        ] :
        [
            {
                icon: <i className='bx bx-image' ></i>,
                name: 'Imagem',
                action: () => { click('file-image') },
                color: '#F55064'
            },
            {
                icon: <i className='bx bx-video' ></i>,
                name: 'Video',
                action: () => { click('file-video') },
                color: '#ff9800'
            },
            {
                icon: <i className='bx bx-music' ></i>,
                name: 'Audio',
                action: () => { click('file-audio') },
                color: '#d22929'
            }
        ]
    const [sectorsState, setSectorsState] = useState(false);
    const [presetsState, setPresetsState] = useState(false);

    const [bookmarksState, setBookmarksState] = useState(false);

    const [editContact, setEditContact] = useState(false);



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

    const getNameFromUser = useCallback((userId, users) => {
        if (users && userId) {
            var index = users.findIndex(user => user.id === userId)
            if (index >= 0) return users[index].name + " " + users[index].lastName
            else return null
        }
    }, [])

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

    useEffect(() => {
        if (!recordingBlob) return;
        setStateFilesObject({ type: 'audio', blob: recordingBlob })
        setStateFilesPreview(true)
    }, [recordingBlob])

    useEffect(() => {
        if (isRecording) {
            updatePresence('recording')
            return
        }
        updatePresence('paused')
        return
    }, [isRecording])

    useEffect(() => {
        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        var indexClient = chatDataBaseCopy.findIndex(chat => chat.chatId === client?.client?.chatId && chat.connectionId === client?.client?.connectionId)
        if (!chatDataBaseCopy[indexClient]) setClient({ state: false, client: null })
        var messagesToShowCopy = chatDataBaseCopy[indexClient]?.messages

        if (messagesToShowCopy) setMessagesToShow(JSON.parse(JSON.stringify(messagesToShowCopy)))
        if (!compareArrays(messagesToShow, chatDataBaseCopy[indexClient]?.messages)) {
            scrollToEnd()
            setClient({ state: true, client: chatDataBaseCopy[indexClient] })
        }
    }, [chatDataBase, scrollToEnd, client]);

    useEffect(() => {
        var filter = quickMessages?.filter(quickMessage => quickMessage?.name?.toLowerCase()?.includes(quickMessagesWordFind?.toLowerCase()))
        if (filter?.length > 0) {
            setQuickMessagesToShow(filter)
        } else {
            if (quickMessagesWordFind === ' ') setQuickMessagesToShow(quickMessages)
            else setQuickMessagesToShow([])
        }
    }, [quickMessagesWordFind]);

    useEffect(() => {
        setUsersList(JSON.parse(JSON.stringify(usersList)))
        setMessagesToShow(JSON.parse(JSON.stringify(client?.client?.messages)))
        scrollToRef(messageEndRef)
        setAnotations(client?.client?.data?.data?.annotations || null)
        if (client?.client?.data?.userInAttendance && client?.client?.data?.userInAttendance === user._id) { readMessages() }
    }, [client, usersList, scrollToRef])

    useEffect(() => {
        setUsersList(usersList)
    }, [usersList]);

    useEffect(() => {
        if (messageResponse) {
            var inputText = document.getElementById('messageTextInput')
            inputText?.focus()
        }
    }, [messageResponse]);

    useEffect(() => {
        if (client?.client?.data?.userInAttendance && client?.client?.data?.statusAttendance) {
            setUserInAttendance(getNameFromUser(client?.client?.data?.userInAttendance, usersList))
        }
    }, [usersList, client, getNameFromUser])



    const handleTextChange = debounce((textValue) => {
        setTextMessage(textValue);
    }, 300);

    const quickMessagesVerification = (textValue) => {
        const regex = /\/\w+/g;
        const regexTwo = /\/(?!\S)/g;
        const matchedStrings = textValue.match(regex);
        const matchedStringsTwo = textValue.match(regexTwo);

        let stringsAposBarra = [];

        if (matchedStrings) {
            let index = 0;
            while (index < matchedStrings?.length) {
                const str = matchedStrings[index].substring(1);
                const nextCharIndex = textValue.indexOf(matchedStrings[index]) + matchedStrings[index]?.length;

                if (nextCharIndex >= textValue?.length || textValue.charAt(nextCharIndex) !== ' ') {
                    stringsAposBarra.push(str);
                }
                index++;
            }
            if (stringsAposBarra?.length > 0) {
                if (!quickMessagesState) {
                    setQuickMessagesState(true);
                }
                (
                    debounce(() => {
                        setQuickMessagesWordFind(stringsAposBarra[0])
                    }, 100)
                )()
            } else {
                if (quickMessagesState) {
                    setQuickMessagesState(false);
                    (
                        debounce(() => {
                            setQuickMessagesWordFind(null)
                        }, 100)
                    )()
                }
            }
        } else if (matchedStringsTwo) {
            if (!quickMessagesState) {
                setQuickMessagesState(true);
            }
            (
                debounce(() => {
                    setQuickMessagesWordFind(' ')
                }, 100)
            )()
        } else {
            if (quickMessagesState) {
                setQuickMessagesState(false);
                (
                    debounce(() => {
                        setQuickMessagesWordFind(null)
                    }, 100)
                )()
            }
        }
    }

    function readMessages() {
        var chatCopy = JSON.parse(JSON.stringify(chatDataBase))
        var indexClient = chatCopy.findIndex(chat => chat.chatId === client?.client.chatId && chat.connectionId === client?.client.connectionId)
        chatCopy[indexClient].messages = chatCopy[indexClient]?.messages?.map(message => {
            message.read = true
            return message
        })
        ApiBack.put('connection/readMessages', { connectionId: client?.client.connectionId, id: client?.client.chatId })
        setChatDatabase(chatCopy)
    }

    function updatePresence(presence) {
        ApiBack.put('connection/updatePresence', { connectionId: client?.client.connectionId, id: client?.client.chatId, presence: presence || 'composing' })
    }
    const setSignature = useCallback((state, messageText, anotationsMessageState) => {
        if ([true, 'true'].includes(state) && messageText && !anotationsMessageState) {
            return `*${user.name} ${user.lastName}:*\n${messageText}`
        } else {
            return messageText || null
        }
    }, [user]);

    async function sendMessage(messageResponse, messageText, messageFile, messageType) {
        messageText = replaceVariables(messageText, client?.client?.data)
        if (client.client?.data?.userInAttendance === user._id) {
            var messageObj
            var messagesToShowCopy = JSON.parse(JSON.stringify(messagesToShow))
            var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
            if (anotationsMessageState) { messageType = 'anotation' }
            if (messageResponse) {
                messageObj = FormatMessage(client?.client?.data?.id, client?.client?.data?.appFrom, null, "response/" + messageType, messageResponse, false, user._id, user.name, messageFile, setSignature(stateSignature && !anotationsMessageState ? stateSignature : false, messageText), client?.client?.data?.connection)
            }
            if (!messageResponse) {
                messageObj = FormatMessage(client?.client?.data?.id, client?.client?.data?.appFrom, null, messageType, messageResponse, false, user._id, user.name, messageFile,
                    setSignature(stateSignature && !anotationsMessageState ? stateSignature : false, messageText), client?.client?.data?.connection)
            }
            messagesToShowCopy.unshift(messageObj)
            setMessagesToShow(messagesToShowCopy)
            var indexChat = chatDataBaseCopy.findIndex(chat => chat.chatId === messageObj.idConversation && chat.connectionId === client?.client?.data?.connection.id)
            var dataMessages = JSON.parse(JSON.stringify(chatDataBaseCopy[indexChat].messages))
            ApiBack.post(messageResponse ? 'connection/sendMessageResponse' : 'connection/sendMessage', messageObj).then(async (response) => {
                dataMessages.unshift(response.data)
                chatDataBaseCopy[indexChat].messages = dataMessages
                setChatDatabase(chatDataBaseCopy)
                configureLastMessage(document.getElementById(`lastMessage${messageObj.idConversation}`), messageObj)
                setMessageResponse(null)
            }).catch(async (err) => {
                messageObj.type.typeMessage = 'error'
                dataMessages.unshift(messageObj)
                chatDataBaseCopy[indexChat].messages = dataMessages
                setChatDatabase(chatDataBaseCopy)
                setMessageResponse(null)
                toast.error(err?.response?.data?.message || "Erro ao enviar a mensagem", {
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

        } else {
            toast.error("Um outro usuário já está atendendo a conversa. Para enviar mensagens assuma a conversa  primeiro.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }
    }

    const verifyNumber = useCallback((value) => {
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
    }, []);

    const verifyDifferenceBetweenArrays = useCallback((largeArray, array2) => {
        var difference = []
        largeArray.forEach((elementLargeArray) => {
            var index = array2.findIndex(e => JSON.stringify(e) === JSON.stringify(elementLargeArray))
            if (index === -1) {
                difference.push(elementLargeArray)
            }
        })
        return difference?.length > 0 ? difference : null
    }, [])

    const getMoreMessages = useCallback(async (messagesToShow) => {
        setScrollState(false)
        var messagesToShowData = messagesToShow
        var math = messagesToShow?.length / 30
        var quantity = verifyNumber(math) ? Math.round(math) + 1 : Math.round(math)
        var responseMessage = await ApiBack.get(`clients/getMessages?id=${client?.client?.data?.id}&connectionId=${client?.client?.data?.connection.id}&quantity=${quantity + 1}`).catch(() => { logout() })
        if (responseMessage?.data.length > 0) {

            var mapMessages = messagesToShowData?.map((message) => {
                return message.controlId
            })
            var filter = responseMessage?.data?.filter((message) => {
                return !mapMessages?.includes(message.controlId)
            })
            var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
            var index = chatDataBaseCopy.findIndex(chat => chat.chatId === client?.client?.data?.id && chat.connectionId === client?.client?.data?.connection?.id)
            chatDataBaseCopy[index].messages = [...messagesToShowData, ...filter]
            setChatDatabase(chatDataBaseCopy)
        }
        setTimeout(() => {
            setScrollState(true)
        }, 1000);

    }, [chatDataBase, client?.client?.data?.id, verifyDifferenceBetweenArrays, verifyNumber])

    const delClient = () => {
        const chatId = client?.client.chatId
        const connectionId = client?.client?.connectionId
        var chatDataBaseCopy = [...chatDataBase]
        const index = chatDataBaseCopy.findIndex(chat => chat.chatId === chatId && chat.connectionId === connectionId)
        const filterChatDataBase = chatDataBaseCopy.filter((chat, idx) => idx !== index)
        ApiBack.delete(`clients?id=${chatId}&connectionId=${connectionId}`)
            // .then(() => { setChatDatabase(filterChatDataBase) })
            .catch(() => { logout() })
        setChatDatabase(filterChatDataBase)
        deleteParam('chatId')
        deleteParam('connectionId')
    }


    const resetClient = useCallback(() => {
        var clientData = client?.client?.data
        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        var index = chatDataBaseCopy.findIndex(chat => chat.chatId === clientData.id && chat.connectionId === clientData.connection.id)
        clientData.status = true
        clientData.statusAttendance = false
        clientData.userInAttendance = null
        clientData.inLine = true
        clientData.botResponsible = null
        clientData.botstatus = false
        chatDataBaseCopy[index].data = clientData
        setChatDatabase(chatDataBaseCopy)
        ApiBack.put(`clients/reset?id=${client?.client?.data?.id}&connectionId=${client?.client?.data?.connection.id}`, clientData).catch(() => { logout() })
        setClient({ state: false, client: null })
    }, [chatDataBase, client, setChatDatabase, setClient, logout])

    const formatNumberFromClientId = useCallback((clientData) => {
        if (clientData?.appFrom === 'whatsapp' || clientData?.appFrom === 'whatsapp_business_account') {
            var number = `${clientData.id.replace('@s.whatsapp.net', '')}`
            var country = number.slice(0, 2);
            var ddd = number.slice(2, 4)
            var numberPartOne = number.slice(4, 8)
            var numberPartTwo = number.slice(8, 12)
            return `+${country} (${ddd}) 9${numberPartOne}-${numberPartTwo}`
        }
        if (clientData?.appFrom === 'instagram') {
            let splitted = clientData?.userName?.split('@');
            if (splitted?.length >= 2) {
                // O que vem depois do '@' está no segundo elemento do array
                let afterAt = '@' + splitted[1].trim();
                return afterAt
            }
        }
    }, [])

    const formatNameFromClient = useCallback((clientData) => {

        if (clientData?.appFrom === 'instagram') {
            let splitted = clientData?.userName?.split('|');
            if (splitted?.length >= 2) {
                // O que vem depois do '@' está no segundo elemento do array
                let afterAt = splitted[0]?.trim();
                return afterAt
            }
        } else {
            return clientData?.userName
        }
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

    const uploadFile = useCallback(async ({ file, type }) => {
        if (type === 'sticker') file = await convertToWebp(file)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('originalname', file?.name || 'file');
        formData.append('typeUpload', type);
        if (client?.client?.data?.appFrom === 'whatsapp_business_account') formData.append('format', 'mpeg');
        var index = file?.type?.indexOf('/')
        var responseData
        await ApiBack.post('connection/uploadFile', formData)
            .then((response) => {
                responseData = response.data
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
        responseData.extension = file.type.substring(index + 1, file.type?.length)
        return responseData
    }, [convertToWebp])

    const updateAttendanceClientStatus = useCallback(() => {
        var clientData = JSON.parse(JSON.stringify(client))
        clientData.client.data.statusAttendance = true
        clientData.client.data.userInAttendance = user._id
        let chatDatabaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        let index = chatDatabaseCopy.findIndex(chat => chat.chatId === clientData.client.chatId && chat.connectionId === clientData.client?.data?.connection.id)
        if (index >= 0) {
            chatDatabaseCopy[index].data = clientData.client?.data
            setChatDatabase(chatDatabaseCopy)
            setClient({ state: true, client: chatDatabaseCopy[index] })
        }
        ApiBack.put(`clients/updateStatusAttendance?id=${client?.client?.data?.id}&connectionId=${client?.client?.data?.connection.id}`, clientData.client?.data).catch(() => { logout() })
    }, [chatDataBase, client, user, logout, setChatDatabase, setClient])

    function editClientInfos(oldClientInfos, newClientInfos) {
        var clientData = newClientInfos
        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        var index = chatDataBaseCopy.findIndex(chat => chat.chatId === oldClientInfos.id && chat.connectionId === oldClientInfos.connection.id)
        chatDataBaseCopy[index].data = newClientInfos
        setChatDatabase(chatDataBaseCopy)
        setClient({ state: true, client: chatDataBaseCopy[index] })
        ApiBack.put(`clients?id=${client?.client?.data?.id}&connectionId=${client?.client?.data?.connection.id}`, clientData).catch(() => { logout() })
    }

    async function formatText(text) {
        const genAI = new GoogleGenerativeAI('AIzaSyD561YW4rc6MC0klycyDDKcCUD7cvtW6Ck');
        // ...

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = 'Corrija a gramática e as pontuações do texto a seguir, por favor, me retorne apenas o texto sem aspas: ' + text

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text()
    }

    function messageFooterStatus(client, user) {
        if (!client?.client) return null;
        var clientDataCopy = JSON.parse(JSON.stringify(client?.client?.data))
        var userDataCopy = JSON.parse(JSON.stringify(user))
        if (clientDataCopy?.statusAttendance && clientDataCopy?.userInAttendance === userDataCopy._id && clientDataCopy?.inLine) {
            return (
                <div className="message-area-footer" style={{ backgroundColor: "var(--background-message-area)", color: 'var(--warn-color-text)', animation: 'showIn .5s' }}>
                    {quickMessagesToShow?.length > 0 ? <DisplayInfoMessageArea onClose={() => { setQuickMessagesToShow(false) }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {quickMessagesToShow?.map((message) => {
                                return <DisplayInfoIdContent key={message._id} id={`/${message.name}`} content={message.message} onClick={() => {
                                    var input = document.getElementById('messageTextInput')
                                    let cursorPositionStart = input.selectionStart
                                    let cursorPositionEnd = input.selectionEnd
                                    if (quickMessagesWordFind?.length !== ' ' && input?.value?.length !== 0) {
                                        // console.log(quickMessagesWordFind);
                                        var initial
                                        if (quickMessagesWordFind) {
                                            initial = input.value.substring(0, cursorPositionStart - (quickMessagesWordFind?.length + 1) || 1)
                                        }
                                        else {
                                            initial = input.value.substring(0, cursorPositionStart)
                                        }


                                        var final = input.value.substring(cursorPositionEnd, input?.value?.length)
                                        var finalFinal = initial + message.message + final
                                        setTextMessage(finalFinal)
                                        input.value = finalFinal + ' '
                                        input.focus()
                                        setTextMessage(finalFinal)

                                    }
                                    else if (input?.value?.length === 0) {
                                        input.value = message.message
                                    }
                                    setQuickMessagesWordFind(null)
                                    setQuickMessagesState(false)
                                    setQuickMessagesToShow([])
                                }} />
                            })}
                        </div>
                    </DisplayInfoMessageArea> : null}

                    {messageResponse ? <MessageResponseArea message={messageResponse} onClose={() => { setMessageResponse(null) }} /> : null}

                    <div className="message-area-footer-content">
                        <div className="message-area-footer-switch">
                            {!isRecording ? <Switch
                                status={!anotationsMessageState}
                                onChange={async () => {
                                    setAnotationsMessageState(anotationValue => !anotationValue)
                                }}
                                textOne={<i className='bx bx-message-square-detail'></i>}
                                textTwo={<i className='bx bx-message-square-edit' ></i>}
                            /> : null}

                        </div>
                        {
                            !isRecording ?
                                <InputTextAreaDInamicWidth
                                    onIsTyping={() => {
                                        updatePresence()
                                    }}
                                    finishTyping={() => {
                                        updatePresence('paused')
                                    }}
                                    value={textMessage}
                                    width={80}
                                    color={'var(--color-one)'}
                                    onFocus
                                    id='messageTextInput'
                                    placeholder='Digite aqui sua mensagem...'
                                    onChange={(textValue) => { handleTextChange(textValue); quickMessagesVerification(textValue) }}
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

                                {
                                    !anotationsMessageState ?
                                        <BubblesContainer
                                            data={dataBubles}
                                            icon={{ icon: <i className='bx bx-paperclip bx-rotate-90' ></i> }} />
                                        :
                                        null
                                }
                                <input accept="image/*" className='file-hide' type="file" id="file-image" onChange={(event) => { showFileToUpload(event, 'image'); console.log('file'); }} />
                                <input accept="video/*" className='file-hide' type="file" id="file-video" onChange={(event) => { showFileToUpload(event, 'video') }} />
                                <input accept="application/*" className='file-hide' type="file" id="file-document" onChange={(event) => { showFileToUpload(event, 'document') }} />
                                <input accept="image/*" className='file-hide' type="file" id="file-sticker" onChange={(event) => { showFileToUpload(event, 'sticker') }} />
                                <input accept="audio/*" className='file-hide' type="file" id="file-audio" onChange={(event) => { showFileToUpload(event, 'audio') }} />
                                <IconButton onClick={() => { setQuickMessagesToShow(quickMessages) }}><i className='bx bxs-bolt' ></i></IconButton>
                                <IconButton onClick={async () => {
                                    var inputText = document.getElementById('messageTextInput')
                                    var textFormated = await formatText(inputText.value)
                                    inputText.value = textFormated + ' '
                                    inputText.focus()
                                    setTextMessage(textFormated)

                                }}><span style={{
                                    fontSize: '20px',
                                    color: 'var(--text-color-one)',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>Aa</span></IconButton>
                                <EmojiComponent onChange={(value) => { setTextMessage(value) }} targetId={'messageTextInput'} />

                                <Button //marca assinatura
                                    emphasis
                                    status={[true, 'true'].includes(stateSignature) ? true : false}
                                    placeholder={<i className='bx bx-pencil'></i>}
                                    onChange={async (value) => {
                                        await setUser({ ...user, signature: value })
                                        await ApiBack.put(`users/signature?id=${user._id}&signature=${value}`).then(() => { setStateSignature(value) })
                                    }} />

                            </div>
                            {isRecording ? <Timer style={{ color: 'var(--text-color-one)', backgroundColor: 'var(--color-tree)' }} /> : null}
                            {
                                textMessage ?
                                    <ButtonModel
                                        onClick={async () => {
                                            var message = document.getElementById('messageTextInput')
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
                                    !anotationsMessageState ? <ButtonModel
                                        id={'button-microphone'}
                                        type='circle-primary'
                                        onClick={async () => {
                                            if (!isRecording) startRecording()
                                            else stopRecording()

                                        }}
                                    > {!isRecording ? <i className='bx bxs-microphone' ></i> : <i className='bx bxs-square-rounded' ></i>}
                                    </ButtonModel> : <ButtonModel
                                        onClick={async () => {

                                            await sendMessage(messageResponse, textMessage, null, 'text')
                                                .then(() => {
                                                    scrollToEnd(messageEndRef)
                                                })

                                        }}
                                        type='circle-primary'
                                    > <i className='bx bx-send'></i>
                                    </ButtonModel>
                            }
                        </div>
                    </div>



                </div>
            )
        }
        if (clientDataCopy?.statusAttendance && client?.client?.data?.userInAttendance !== user._id) {
            return (
                <div className="message-area-footer-noMessages" style={{ backgroundColor: "var(--warn-color)", color: 'var(--warn-color-text)', animation: 'showIn .3s' }}>
                    <span style={{ fontWeight: '600', marginLeft: '1rem' }}><b>{userInAttendance}</b> já está atendendo a esta conversa. Gostaria de assumi-la?</span>
                    <ButtonModel onClick={() => {
                        updateAttendanceClientStatus()
                    }}>Assumir</ButtonModel>
                </div>
            )
        }
        if (clientDataCopy?.statusAttendance === false) {
            return (
                <div className="message-area-footer-noMessages" style={{ backgroundColor: "var(--aditional-color-1)", color: 'var(--aditional-color-1-text)', animation: 'showIn .3s' }}>
                    <span style={{ fontWeight: '600', marginLeft: '1rem' }}>Você deseja assumir esta conversa?</span>
                    <ButtonModel onClick={() => {
                        updateAttendanceClientStatus()
                    }}>Assumir</ButtonModel>
                </div>
            )
        }
    }

    socket?.off("updateStatusAttendance").on("updateStatusAttendance", async (clientData, socketMessageId) => {
        if (clientData.id === client.client.chatId && clientData.connectionId === client.client?.data?.connection.id) {
            var clientCopy = JSON.parse(JSON.stringify(client))
            clientCopy.client.data = clientData
            await setClient(JSON.parse(JSON.stringify({ state: true, client: clientCopy.client })))
        }
        responseSocketRequest(socket, socketMessageId)
    })

    function getClientData(client) {
        const data = client?.data?.info || false;
        if (data) {
            const output = {};
            data.forEach(({ name, value }) => {
                output[name] = value;
            });
            output['phoneNumber'] = `${client?.id?.replace('@s.whatsapp.net', '')}`;
            output['phoneNumberFormated'] = formatNumberFromClientId(client);
            output['userName'] = client?.userName;
            output['protocol'] = client?.protocol;
            output['date'] = new Date().toLocaleDateString('pt-BR');
            output['dateExtended'] = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
            output['weekday'] = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
            // console.log(output);
            return output;
        } else {
            return false;
        }
    }

    function getValueFromPath(obj, path) {
        const pathKeys = path.split('.');
        const formattedKeys = pathKeys.map(key => {
            const regex = /^(\w+)((?:\[\d+\])+)$/;
            if (regex.test(key)) {
                const matches = key.match(regex);
                const arr = [matches[1]];
                const indices = matches[2].match(/\d+/g);
                for (let i = 0; i < indices?.length; i++) {
                    arr.push(parseInt(indices[i]));
                }
                return arr;
            } else {
                return key;
            }
        });
        let value = obj;
        return traversePath(formattedKeys, value);
    }

    function traversePath(pathKeys, value) {
        for (let key of pathKeys) {
            if (Array.isArray(key)) {
                if (key?.length === 0) {
                    return undefined;
                }
                let currentArray = value[key[0]];
                for (let i = 1; i < key?.length; i++) {
                    const index = key[i];
                    if (Array.isArray(currentArray) && index >= 0 && index < currentArray?.length) {
                        currentArray = currentArray[index];
                    } else {
                        return undefined;
                    }
                }
                value = currentArray;
            } else {
                value = value ? value[key] : undefined;
            }
        }
        return value;
    }

    function replaceVariables(str, clientData) {
        const dataClient = getClientData(clientData);
        const matches = [...str?.matchAll(/#{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g)];

        matches?.forEach(match => {
            const path = match[1];
            const val = getValueFromPath(dataClient, path);
            str = str?.replace(match[0], val !== undefined ? val : ' ');
        });
        return str;
    }

    if (client?.client?.data) {
        return (
            <div style={{ display: "flex", height: "100%", width: "100%" }}>
                <div className="message-area-container">
                    <ToastContainer />
                    <div className="message-area-header">
                        <div className='contact-name-number-profilepic'>
                            <div className="back-button">
                                <IconButton onClick={() => {
                                    setClient({ state: false, client: null })
                                    deleteParam('chatId')
                                    deleteParam('connectionId')
                                }}>
                                    <i className='bx bx-left-arrow-alt'></i>
                                </IconButton>
                            </div>
                            <div className='contact-name-number-profilepic-content'>
                                <img onClick={() => { setSideBarState(!sideBarState) }} className='profilepic' src={client?.client?.data?.profilePic} alt='profilePic' onError={(event) => { event.target.src = '/img/avatar.svg' }} />
                                <div className="name-number">
                                    <span className='name' onClick={() => { setSideBarState(!sideBarState) }}>{formatNameFromClient(client?.client?.data)?.length > 50 ? formatNameFromClient(client?.client?.data).substring(0, 50) + '...' : formatNameFromClient(client?.client?.data)}</span>
                                </div>
                            </div>
                            <div className='icon-options-client' >
                                <div className="part-one">
                                    {client?.client?.data.appFrom === 'whatsapp_business_account' && <IconButton onClick={() => { setPresetsState(old => !old) }}><i className='bx bx-message-alt-edit icon' ></i></IconButton>}

                                    <LateralBar
                                        title={`Enviar Modelo de Mensagem`}
                                        open={presetsState}
                                        noOverlap
                                        onClose={() => {
                                            setPresetsState(false)
                                        }}>
                                        {presetsState && <SendPreset clientsIds={[client?.client?.data.id]} connectionId={client?.client?.data.connection.id} onClose={() => {
                                            setPresetsState(false)
                                            getMoreMessages(messagesToShow)
                                        }} />}
                                    </LateralBar>
                                    {/* Icone de Editar Contato */}

                                    <IconButton onClick={() => { setEditContact(true) }} ><i className='bx bx-pencil'></i></IconButton>

                                    <DialogBoxChildren open={editContact && !window.matchMedia('(max-width: 1300px)').matches ? true : false} onClose={() => { setEditContact(false) }}>

                                        <div style={{ maxHeight: '80vh', minWidth: '20rem' }}>
                                            <div>
                                                <div className="new-client-txt-title">Edite o nome do cliente</div>
                                                <InputText
                                                    style='clean'
                                                    onChange={() => { setButtonEditName(true) }}
                                                    id='editNameClient' value={client?.client?.data?.userName}
                                                />
                                                <Space /><Space />
                                                {buttonEditName ?
                                                    <ButtonModel onClick={() => {
                                                        var name = document.getElementById('editNameClient').value
                                                        var copyClient = JSON.parse(JSON.stringify(client.client?.data))
                                                        copyClient.userName = name
                                                        editClientInfos(client?.client?.data, copyClient)
                                                        setButtonEditName(false)
                                                    }}>Salvar</ButtonModel>
                                                    : null}
                                            </div>

                                        </div>

                                    </DialogBoxChildren>


                                    {/* Icone de Bookmarks */}
                                    {client?.client?.data?.bookmarks?.length > 0 ?
                                        <IconButton onClick={() => { setBookmarksState(true) }}><i className='bx bxs-tag' ></i></IconButton>
                                        :
                                        <IconButton onClick={() => { setBookmarksState(true) }}><i className='bx bx-tag'></i></IconButton>
                                    }

                                    <LateralBar
                                        title={`Lista de Marcadores`}
                                        open={bookmarksState}
                                        noOverlap
                                        onClose={() => {
                                            setBookmarksState(null)
                                        }}>
                                        {bookmarks?.map((bookmark) => {
                                            return (
                                                <BookmarkForListMessageArea
                                                    active={client?.client?.data?.bookmarks.includes(bookmark._id)}
                                                    key={bookmark._id + 'lateralList'}
                                                    bookmark={bookmark}
                                                    onChange={(data) => {
                                                        const { action, id } = data
                                                        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
                                                        var clientData = client?.client?.data
                                                        var indexClient = chatDataBaseCopy?.findIndex(chat => chat?.chatId === clientData?.id && chat?.connectionId === clientData?.connection?.id)
                                                        var indexBookmark = clientData.bookmarks.findIndex(bookmarkId => bookmarkId === id)
                                                        if (action && indexBookmark === -1) {
                                                            chatDataBaseCopy[indexClient].data.bookmarks.push(id)
                                                        }

                                                        if (!action && indexBookmark !== -1) {
                                                            chatDataBaseCopy[indexClient].data.bookmarks = clientData?.bookmarks?.filter(bookmark => bookmark !== id)
                                                        }
                                                        setClient({ state: true, client: chatDataBaseCopy[indexClient] })
                                                        setChatDatabase(chatDataBaseCopy)
                                                        ApiBack.put(`clients/updateBookmarks?id=${clientData.id}`, chatDataBaseCopy[indexClient]?.data)
                                                    }
                                                    } />
                                            )
                                        })}
                                    </LateralBar>


                                    {/* Icone de Setores */}
                                    <IconButton onClick={() => { setSectorsState(true) }}><i className='bx bx-transfer-alt icon' ></i></IconButton>

                                    <LateralBar
                                        title={`Transferencia de Setores`}
                                        open={sectorsState}
                                        noOverlap
                                        onClose={() => {
                                            setSectorsState(false)
                                        }}>
                                        <SectorsForTransfer />
                                    </LateralBar>
                                    {/* Icone de Reset Client */}
                                    <IconButton onClick={() => { resetClient() }}> <i className='bx bx-reset'></i> </IconButton>

                                    {/* Icone de Informações do Client */}
                                    <IconButton onClick={() => { setSideBarState(!sideBarState) }}><i className='bx bx-info-circle' ></i></IconButton>
                                </div>
                                <div className="part-two">
                                    <PrimaryButtonGenerics onClick={() => { setStateDialogEndChat(true) }}> Encerrar Chat <i className='bx bx-check-circle'></i></PrimaryButtonGenerics>
                                    <DialogBox
                                        open={stateDialogEndChat}
                                        text='Deseja finalizar o atendimento para este cliente?'
                                        buttonOneText='Finalizar'
                                        onButtonOne={() => {
                                            setClient({ state: false, client: null }) //esconde as mensagens e mostra a tela de mensagens padrão
                                            delClient();
                                        }}
                                        buttonTwoText='Cancelar'
                                        onButtonTwo={() => { setStateDialogEndChat(false) }}
                                        onClose={() => { setStateDialogEndChat(false) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Bar size={'fullW'} />
                    <div className="message-area-middle" id="message-area-middle">

                        {
                            messagesToShow?.length >= 10 ?
                                <div className="more-messages">
                                    <IconButton onClick={() => { getMoreMessages(messagesToShow) }}><i className='bx bx-rotate-left'>
                                    </i></IconButton></div> :
                                null
                        }

                        {
                            messagesToShow ?
                                messagesToShow?.slice(0).reverse().map((m) => {
                                    // if (m.controlId === null) console.log(m);
                                    return <MessageComponent key={m.controlId} message={m} onChange={async (data) => {
                                        const { action, data: dataMessage } = data
                                        if (action === 'response') {
                                            setMessageResponse(dataMessage)
                                            document.getElementById("messageTextInput").focus()
                                        }
                                        if (action === 'delete') {
                                            var filter = messagesToShow.filter(message => message._id !== dataMessage._id)
                                            var index = chatDataBase.findIndex(chat => chat.chatId === dataMessage.idConversation && chat.connectionId === dataMessage.from.connection.id)
                                            chatDataBase[index].messages = filter
                                            setMessagesToShow(filter)
                                            configureLastMessage(document.getElementById(`lastMessage${dataMessage.idConversation}`), chatDataBase[index].messages[0])
                                        }

                                    }}></MessageComponent>
                                }) : <div className='noMessages'>
                                    <Ring
                                        size={60}
                                        lineWeight={5}
                                        speed={2}
                                        color="white"
                                    /></div>
                        }
                        <div className="end-message" ref={messageEndRef}>ㅤ</div>
                    </div>
                    {stateFilesPreview ?
                        <FullArea open={stateFilesPreview} onClose={() => {
                            // console.log('teste', stateFilesObject.file)
                            if (stateFilesObject?.file) {
                                document.getElementById(stateFilesObject?.file?.target?.id).value = ''
                                stateFilesObject.file.target.value = null
                            }

                            setStateFilesObject({ file: null, blob: null, type: null })
                            setStateFilesPreview(false)
                        }}>
                            <div className="preview-file-upload">
                                <FilesPreview file={stateFilesObject} onClose={() => {
                                    stateFilesObject.file.target.value = null
                                    setStateFilesObject({ file: null, blob: null, type: null });
                                    setStateFilesPreview(false);
                                }} />
                                {
                                    stateFilesObject?.file || stateFilesObject?.blob ?
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <div className="input">
                                                <InputText
                                                    disabled={['sticker', 'audio'].includes(stateFilesObject.type) || client?.client?.data?.appFrom !== 'whatsapp' ? true : false}
                                                    onChange={(textValue) => { handleTextChange(textValue); }}
                                                    size='large'
                                                    emoji={true}
                                                    onFocus={true}
                                                    onEnter={(messageText) => {
                                                        var copyStateFilesObject = { ...stateFilesObject }
                                                        if (copyStateFilesObject?.blob) {

                                                            const fileInput = document.createElement('input');
                                                            fileInput.type = 'file'
                                                            var nameFile
                                                            if (copyStateFilesObject?.type === 'audio') {
                                                                nameFile = `audio-${new Date().getTime()}.webm`
                                                            }
                                                            const file = new File([copyStateFilesObject?.blob], nameFile, { type: copyStateFilesObject?.blob.type });
                                                            copyStateFilesObject = { ...copyStateFilesObject, file: file }

                                                        } else {
                                                            copyStateFilesObject = { ...copyStateFilesObject, file: copyStateFilesObject?.file?.target?.files[0] }
                                                        }

                                                        uploadFile({ file: copyStateFilesObject.file, type: copyStateFilesObject?.type }).then(data => {
                                                            sendMessage(messageResponse, messageText, data, data.type)
                                                            // console.log(data);

                                                        })
                                                        scrollToEnd(messageEndRef)
                                                        setStateFilesPreview(false)
                                                        stateFilesObject.file.target.value = null
                                                        setStateFilesObject({ file: null, blob: null, type: null })
                                                        stateFilesObject.file.target.value = null

                                                    }}
                                                    id='messageTextInput2'
                                                    placeholder='Digite sua Mensagem'
                                                    clear={true} />
                                                <ButtonModel
                                                    onClick={async () => {
                                                        var message = document.getElementById('messageTextInput2')
                                                        var copyStateFilesObject = { ...stateFilesObject }
                                                        if (copyStateFilesObject?.blob) {

                                                            const fileInput = document.createElement('input');
                                                            fileInput.type = 'file'
                                                            var nameFile
                                                            if (copyStateFilesObject?.type === 'audio') {
                                                                nameFile = `audio-${new Date().getTime()}.webm`
                                                            }
                                                            const file = new File([copyStateFilesObject?.blob], nameFile, { type: copyStateFilesObject?.blob.type });
                                                            copyStateFilesObject = { ...copyStateFilesObject, file: file }
                                                            // console.log(copyStateFilesObject?.file);

                                                        } else {
                                                            copyStateFilesObject = { ...copyStateFilesObject, file: copyStateFilesObject?.file?.target?.files[0] }
                                                        }

                                                        uploadFile({ file: copyStateFilesObject.file, type: copyStateFilesObject?.type }).then(data => {
                                                            // console.log(data);
                                                            sendMessage(messageResponse, message.value, data, data.type)

                                                        })
                                                        scrollToEnd(messageEndRef)
                                                        message.value = ""
                                                        setStateFilesPreview(false)
                                                        if (stateFilesObject?.file) stateFilesObject.file.target.value = null
                                                        setStateFilesObject({ file: null, blob: null, type: null })
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
                        </FullArea> : null}
                    {client && user ? messageFooterStatus(client, user) : null}
                </div >
                <LateralBar title={`Informações de atendimento`} open={sideBarState} noOverlap onClose={() => {
                    setSideBarState(false)
                }}>
                    <div style={{ padding: '1rem' }} >
                        <div className="profile-client" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--two-color)',
                            borderRadius: '1rem',
                            padding: '1rem',
                        }}>
                            <img style={{
                                width: '15rem',
                                height: '15rem',
                                borderRadius: '50%'
                            }} src={client?.client?.data?.profilePic} alt='Profile' />
                            <div className="infos" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="name" style={{ fontSize: '14pt', fontWeight: '900' }}>{formatNameFromClient(client?.client?.data)}</div>
                                <div className="phone" style={{ fontSize: '9pt', fontWeight: '500' }}>{formatNumberFromClientId(client?.client?.data)}</div>
                                <div className="conexion" style={{ fontSize: '9pt' }}>{client?.client?.data?.connection.name}</div>

                            </div>
                        </div>
                        <div className="date" style={{ fontSize: '8pt', margin: '1rem', marginLeft: 0, fontStyle: 'italic', opacity: '.5', maxWidth: '18rem' }}>Aqui você encontra informações importantes sobre o cliente fornecidas por ele mesmo ou anotações feitas por atendentes.</div>
                        {client?.client?.data?.data?.info ? client?.client?.data?.data?.info?.map((data, index) => {
                            if (typeof data.value === 'object') {
                                return (
                                    <div key={client?.client?.data?.id + '-info-' + index}>
                                        <div style={{ fontSize: '13pt', fontWeight: '600' }} className="name-atribute">{data.name}</div>
                                        <div style={{ fontSize: '10pt', fontWeight: '400', maxWidth: '18rem', }} className="value-atribute">{JSON.stringify(data.value)}</div>
                                        <br />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={client?.client?.data?.id + '-info-' + index}>
                                        <div style={{ fontSize: '13pt', fontWeight: '600' }} className="name-atribute">{data.name}</div>
                                        <div style={{ fontSize: '10pt', fontWeight: '400', maxWidth: '18rem' }} className="value-atribute">{data.value}</div>
                                        <br />
                                    </div>
                                )
                            }


                        }) : null}
                        {client?.client?.data?.protocol ? <div key='protocol-info'>
                            <div style={{ fontSize: '13pt', fontWeight: '600' }} className="name-atribute">Procotolo do atendimento</div>
                            <div style={{ fontSize: '10pt', fontWeight: '400', maxWidth: '18rem' }} className="value-atribute">{client?.client?.data?.protocol}</div>
                            <br />
                        </div> : null}
                    </div>
                    <Space />
                    <Space />
                    <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <h3>Anotações</h3>
                            <IconButton size={'small'} onClick={() => { setAnotationsState(true) }}><i className='bx bxs-edit'></i></IconButton></div>
                        {!anotationsState ? <div className="anotations" style={{ maxWidth: '18rem', fontSize: '10pt', fontWeight: '400' }}>
                            {anotations || 'Ainda não há anotações'}
                        </div> : <div style={{ padding: '.5rem', maxWidth: '17.5rem' }}>
                            <InputTextArea
                                color={'var(--one-color)'}
                                onChange={(e) => {
                                    setAnotations(e)
                                }}
                                placeholder={'Escreva uma anotação'}
                                columns={30}
                                id='clientAnotations'
                                value={anotations || ''}
                            />
                            <div className="buttons" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <SecoundaryButton onChange={() => {
                                    setAnotationsState(false)
                                }}>Cancelar</SecoundaryButton>

                                <PrimaryButton onChange={() => {
                                    var clientDataCopy = JSON.parse(JSON.stringify(client))
                                    let chatDatabaseCopy = JSON.parse(JSON.stringify(chatDataBase))
                                    let index = chatDatabaseCopy.findIndex(chat => chat.chatId === clientDataCopy.client.chatId && chat.connectionId === clientDataCopy.client?.data?.connection.id)
                                    if (index >= 0) {
                                        clientDataCopy.client.data.data['annotations'] = anotations
                                        chatDatabaseCopy[index].data = clientDataCopy.client?.data
                                        setChatDatabase(chatDatabaseCopy)
                                        setClient(clientDataCopy)
                                        setAnotationsState(false)
                                        ApiBack.put(`clients?id=${clientDataCopy?.client?.data?.id}&connectionId=${clientDataCopy?.client?.data?.connection.id}`, clientDataCopy.client?.data).catch(() => { logout() })
                                    }
                                }}>Salvar</PrimaryButton>
                            </div>
                        </div>}
                        <Space />
                        <Space />
                    </div>
                </LateralBar>
            </div>
        )
    }
    return null
}
