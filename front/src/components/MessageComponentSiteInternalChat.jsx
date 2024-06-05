import React, { useContext, useEffect, useState } from 'react'
import parse from 'html-react-parser';
import './MessageComponentSiteInternalChat.css'
import FilesForMessages from './FilesForMessages'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { AppContext } from '../contexts/userData';
import { ApiBack } from '../service/axios';
import DialogBox from './DialogBox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configureLastMessage from '../service/configureLastMessage';
import MessageComponentToResponseMessage from './MessageComponentToResponseMessage';
export default function MessageComponentSiteInternalChat({ message, onChange }) {
    const { chatDataBase, user } = useContext(AppContext)
    const [msg, setMsg] = useState(null);
    const [statusSend, setStatusSend] = useState(null);
    const [arroWShow, setArrowShow] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [stateDialogDeleteForAll, setStateDialogDeleteForAll] = useState(false)
    const [stateDialogDelete, setStateDialogDelete] = useState(false)
    const open = Boolean(anchorEl);

    useEffect(() => {
        setMsg(message)
    }, [message]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function deleteMessage() {
        ApiBack.delete(`connection/deleteMessage?id=${msg?._id}`)
            .then(() => { onChange({ action: 'delete', data: msg }) })
            .catch((err) => {
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })
        setStateDialogDelete(false)
    }
    function deleteMessageForAll() {
        ApiBack.post(`connection/deleteMessageForAll?id=${msg?._id}`, msg)
            .then(() => {
                var data = msg
                data.type.typeMessage = 'deleteForAll'
                data.file = null
                data.text = null
                data.msg = null
                data.response = null
                var index = chatDataBase.findIndex(chat => chat.chatId === data.idConversation && chat.connectionId === data.from.connection.id)
                chatDataBase[index].messages[chatDataBase[index].messages.findIndex(message => message._id === data._id)] = data
                setMsg(data)
                configureLastMessage(document.getElementById(`lastMessage${data.idConversation}`), chatDataBase[index].messages[0])
                setStateDialogDeleteForAll(false)
            })
            .catch(() => {
                toast.error('Não foi possível excluir a mensagem para todos. É possivel que o tempo de exclusão tenha acabado.', {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
                setStateDialogDeleteForAll(false)
            })
    }

    function formatText(text) {
        var string = text
        string = string.replace(/\_(.*?)\_/g, '<i>$1</i>');
        string = string.replace(/\*(.*?)\*/g, '<b>$1</b>');
        string = string.replace(/\-(.*?)\-/g, '<u>$1</u>');
        string = string.replace(/\~(.*?)\~/g, '<s>$1</s>');
        return parse(string)
    }
    if (msg?.type === 'deleteForAll') {
        return (
            <div className={msg.from.id === user?._id ? " message message-container-all" : "message message-container-user"}>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={msg.type === 'text' ? "message-middle-text" : "message-middle"}>
                    <span className='delete-for-all-message'><i className='bx bx-block'></i> Mensagem apagada</span>
                </div>
            </div>
        )
    }
    else if (['image', 'video', 'audio'].includes(msg?.type)) {

        return (
            <div className={
                msg.from.id !== user?._id ?
                    " message message-container-all" :
                    "message message-container-user"
            }
                onMouseEnter={() => { setArrowShow(true) }}
                onMouseLeave={() => { setArrowShow(false) }}
            >
                <div className="author">{msg?.from?.name}</div>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>

                <div className={arroWShow ? 'arrow-options' : 'disable'} onClick={handleClick}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </div>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        onChange({ action: 'response', data: msg })
                        handleClose()
                    }}>Responder</MenuItem>
                </Menu>
                <div className="message-middle">
                    <div className="message-middle-content">
                        <div className='content'>
                            {msg?.file ? <FilesForMessages m={msg} /> : null}
                            {msg?.text ? <div className="text-and-hour">
                                {msg?.type !== 'audio' ? <span className='text-message'>{formatText(msg?.text)}</span> : null}
                                <span className={msg?.type?.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>}
                                </span>
                            </div> :
                                <span className={msg.from.id === user?._id ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type?.includes('response')) {
        return (
            <div className={
                msg.from.id !== user?._id ?
                    " message message-container-all" :
                    "message message-container-user"
            }
                onMouseEnter={() => { setArrowShow(true) }}
                onMouseLeave={() => { setArrowShow(false) }}
            >
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={arroWShow ? 'arrow-options' : 'disable'} onClick={handleClick}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </div>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        onChange({ action: 'response', data: msg })
                        handleClose()
                    }}>Responder</MenuItem>
                </Menu>
                <div className={msg.type === 'text' ? "message-middle-text" : "message-middle"}>
                    <div className="message-middle-content">
                        <div className='content'>
                            <MessageComponentToResponseMessage typeMessage={msg?.response?.type?.typeMessage} text={msg?.response?.text} file={msg?.response?.file} />
                            {msg?.file ? <FilesForMessages m={msg} /> : null}
                            {msg?.text ? <div className="text-and-hour">
                                <span className='text-message'>{formatText(msg?.text)}</span>
                                <span className={msg.from.id === user?._id ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            </div> :
                                <span className={msg.from.id === user?._id ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type === 'text') {
        return (
            <div className=
                {msg.from.id !== user?._id ?
                    " message message-container-all" :
                    "message message-container-user"
                }
                onMouseEnter={() => { setArrowShow(true) }}
                onMouseLeave={() => { setArrowShow(false) }}
            >
                <div className="author">{msg?.from?.name}</div>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={arroWShow ? 'arrow-options' : 'disable'} onClick={handleClick}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </div>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        onChange({ action: 'response', data: msg })
                        handleClose()
                    }}>Responder</MenuItem>
                </Menu>
                <div className="message-middle-text">
                    <div className="message-middle-content">
                        <div className='content'>
                            <div className="text-and-hour">
                                <span className='text-message'>{formatText(msg?.text)}</span>
                                <span className={msg.from.id === user?._id ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type === 'sticker') {
        return (
            <div className=
                {
                    msg.from.id !== user?._id ?
                        " message message-container-all" :
                        "message message-container-user"
                }
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                }}
                onMouseEnter={() => { setArrowShow(true) }}
                onMouseLeave={() => { setArrowShow(false) }}
            >
                <div className="message-header">
                    <span className='arrow' style={{
                        opacity: '0',
                    }}></span>
                </div>
                <div className={arroWShow ? 'arrow-options' : 'disable'} onClick={handleClick}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </div>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        onChange({ action: 'response', data: msg })
                        handleClose()
                    }}>Responder</MenuItem>

                </Menu>

                <div className="message-middle-text">
                    <div className="message-middle-content">
                        <div className='content'>
                            <div className="text-and-hour" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <img src={msg?.file?.url} alt="sticker" style={{ width: '10rem', height: '10rem' }} />
                                <span className={msg.from.id === user?._id ? 'footer-hour' : 'footer-hour-attendance'} style={{ color: 'var(--text-color-one)' }}>
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type === 'error') {
        return (
            <div className={
                msg.from.id !== user?._id ?
                    " message message-container-all" :
                    "message message-container-user"
            }>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={msg.type === 'text' ? "message-middle-text" : "message-middle"}>
                    <div className="message-middle-content">
                        <span className='error-message' onClick={() => {
                            toast.error('Houve um erro no envio da mensagem. Verifique sua conexão, e tente novamente.', {
                                position: "top-right",
                                autoClose: 6000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            })
                        }}>
                            <i className='bx bxs-error-circle' ></i> Erro
                        </span>
                    </div>
                </div>
            </div>)
    }
    else if (msg?.type?.includes('document')) {
        return (
            <div className=
                {
                    msg.from.id !== user?._id ?
                        " message message-container-all" :
                        "message message-container-user"
                }
                onMouseEnter={() => { setArrowShow(true) }}
                onMouseLeave={() => { setArrowShow(false) }}
            >
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={arroWShow ? 'arrow-options' : 'disable'} onClick={handleClick}>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="delete">
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    </Stack>
                </div>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => {
                        onChange({ action: 'response', data: msg })
                        handleClose()
                    }}>Responder
                    </MenuItem>

                </Menu>
                <div className="message-middle">
                    <div className="message-middle-content">
                        <div className='content'>
                            <FilesForMessages m={msg} />
                            {msg?.text ? <div className="text-and-hour"><div className='text-message'> {formatText(msg?.text)}</div>
                                <span className={msg?.type.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {msg?.hour}
                                    <StatusSendOrView msg={msg}/>
                                </span>
                            </div> :
                                <span className={msg.from.id === user?._id ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    <StatusSendOrView msg={msg} />
                                </span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return null
    }
}

function StatusSendOrView({msg, rommData}) {
    return (
        <div>
            {
                msg.from ?
                    <i className='bx bx-check'></i> :
                    <i className='bx bx-time-five' ></i>
            }
        </div>

    )
}