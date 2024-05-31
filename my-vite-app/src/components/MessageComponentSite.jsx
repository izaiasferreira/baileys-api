import React, { useContext, useEffect, useState } from 'react'
import parse from 'html-react-parser';
import './MessageComponent.css'
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
import { /*ToastContainer,*/ toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configureLastMessage from '../service/configureLastMessage';
import MessageComponentToResponseMessage from './MessageComponentToResponseMessage';
export default function MessageComponent({ message, onChange, exampleMode }) {
    const { chatDataBase } = useContext(AppContext)
    const [msg, setMsg] = useState(null);
    const [statusSend, setStatusSend] = useState(null);
    const [dateStatus, setDateStatus] = useState(null);
    const [hourStatus, setHourStatus] = useState(null);
    const [stateExampleMode] = useState(exampleMode);
    const [arroWShow, setArrowShow] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [stateDialogDeleteForAll, setStateDialogDeleteForAll] = useState(false)
    const [stateDialogDelete, setStateDialogDelete] = useState(false)
    const open = Boolean(anchorEl);
    const months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez'
    ];
    useEffect(() => {
        if (exampleMode) {
            // var dateMessage = new Date();
            // setHourStatus(`${dateMessage.getHours() > 9 ? dateMessage.getHours() : "0" + dateMessage.getHours()}:${dateMessage.getMinutes() > 9 ? dateMessage.getMinutes() : "0" + dateMessage.getMinutes()}`)
            // setDateStatus(`${dateMessage.getDate()}/${dateMessage.getMonth() + 1 > 9 ? dateMessage.getDate() : "0" + dateMessage.getDate()}/${dateMessage.getMonth() + 1}/${dateMessage.getFullYear()}`)
            setMsg(message)
            if (message?.msg) {
                setStatusSend(true)
            }
        } else {
            // var localDateOffset = new Date().getTimezoneOffset();
            // var dateMessage = new Date(message.createdAt);
            // dateMessage.setUTCHours(dateMessage.getHours() + localDateOffset / 60)
            // setHourStatus(`${dateMessage.getHours() > 9 ? dateMessage.getHours() : "0" + dateMessage.getHours()}:${dateMessage.getMinutes() > 9 ? dateMessage.getMinutes() : "0" + dateMessage.getMinutes()}`)
            // setDateStatus(`${dateMessage.getDate()} de ${months[dateMessage.getMonth()]}`)
            setMsg(message)
            if (message.msg) {
                setStatusSend(true)
            }
        }
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
        string =  string.replace(/\_(.*?)\_/g, '<i>$1</i>');
        string = string.replace(/\*(.*?)\*/g, '<b>$1</b>');
        string = string.replace(/\-(.*?)\-/g, '<u>$1</u>');
        string = string.replace(/\~(.*?)\~/g, '<s>$1</s>');
        return parse(string)
    }
    if (msg?.type.typeMessage === 'deleteForAll') {
        return (
            <div className={!msg.type.toShow ? " message message-container-client" : "message message-container-attendance"}>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={msg.type.typeMessage === 'text' ? "message-middle-text" : "message-middle"}>
                    <span className='delete-for-all-message'><i className='bx bx-block'></i> Mensagem apagada</span>
                </div>
            </div>
        )
    }
    else if (['image', 'video', 'audio'].includes(msg?.type.typeMessage)) {
        return (
            <div className=
                {!msg.type.toShow ?
                    " message message-container-client" :
                    "message message-container-attendance"
                }
                onMouseEnter={() => { if (!stateExampleMode) setArrowShow(true) }}
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
                    {!message.type.toShow ? <MenuItem onClick={() => {
                        setStateDialogDeleteForAll(true)
                        handleClose()
                    }}>Deletar para todos</MenuItem> : null}
                    <MenuItem onClick={() => {
                        setStateDialogDelete(true)
                        handleClose()
                    }}>Deletar</MenuItem>
                </Menu>
                <DialogBox
                    open={stateDialogDeleteForAll}
                    onClose={() => { setStateDialogDeleteForAll(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída tanto no Catbot quanto no Whatsapp.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessageForAll() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDeleteForAll(false) }}
                />
                <DialogBox
                    open={stateDialogDelete}
                    onClose={() => { setStateDialogDelete(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída apenas no Catbot.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessage() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDelete(false) }}

                />
                <div className="message-middle">
                    <div className="message-middle-content">
                        <div className='content'>
                            {msg?.file ? <FilesForMessages m={msg} /> : null}
                            {msg?.text ? <div className="text-and-hour">
                                {msg?.type?.typeMessage !== 'audio' ? <span className='text-message'>{formatText(msg?.text)}</span> : null}
                                <span className={msg?.type?.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>}
                                </span>
                            </div> :
                                <span className={!msg.type.toShow === true ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {
                                        statusSend ?
                                            <i className='bx bx-check'></i> :
                                            <i className='bx bx-time-five' ></i>
                                    }
                                </span>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type.typeMessage.substring(0, msg?.type.typeMessage.indexOf('/')) === 'response') {
        return (
            <div className=
                {!msg.type.toShow ?
                    " message message-container-client" :
                    "message message-container-attendance"
                }
                onMouseEnter={() => { if (!stateExampleMode) setArrowShow(true) }}
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
                    {!message.type.toShow ? <MenuItem onClick={() => {
                        setStateDialogDeleteForAll(true)
                        handleClose()
                    }}>Deletar para todos</MenuItem> : null}
                    <MenuItem onClick={() => {
                        setStateDialogDelete(true)
                        handleClose()
                    }}>Deletar</MenuItem>
                </Menu>
                <DialogBox
                    open={stateDialogDeleteForAll}
                    onClose={() => { setStateDialogDeleteForAll(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída tanto no Catbot quanto no Whatsapp.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessageForAll() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDeleteForAll(false) }}
                />
                <DialogBox
                    open={stateDialogDelete}
                    onClose={() => { setStateDialogDelete(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída apenas no Catbot.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessage() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDelete(false) }}

                />
                <div className={msg.type.typeMessage === 'text' ? "message-middle-text" : "message-middle"}>
                    <div className="message-middle-content">
                        <div className='content'>
                            <MessageComponentToResponseMessage typeMessage={msg?.response?.type?.typeMessage} text={msg?.response?.text} file={msg?.response?.file} />
                            {msg?.file ? <FilesForMessages m={msg} /> : null}
                            {msg?.text ? <div className="text-and-hour">
                                <span className='text-message'>{formatText(msg?.text)}</span>
                                <span className={!msg.type.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>}
                                </span>
                            </div> :
                                <span className={!msg.type.toShow === true ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>}
                                </span>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type.typeMessage === 'text') {
        return (
            <div className=
                {!msg.type.toShow ?
                    " message message-container-client" :
                    "message message-container-attendance"
                }
                onMouseEnter={() => { if (!stateExampleMode) setArrowShow(true) }}
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
                    {!!msg.type.toShow ? <MenuItem onClick={() => {
                        setStateDialogDeleteForAll(true)
                        handleClose()
                    }}>Deletar para todos</MenuItem> : null}
                    <MenuItem onClick={() => {
                        setStateDialogDelete(true)
                        handleClose()
                    }}>Deletar</MenuItem>
                </Menu>
                <DialogBox
                    open={stateDialogDeleteForAll}
                    onClose={() => { setStateDialogDeleteForAll(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída tanto no Catbot quanto no Whatsapp.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessageForAll() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDeleteForAll(false) }}
                />
                <DialogBox
                    open={stateDialogDelete}
                    onClose={() => { setStateDialogDelete(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída apenas no Catbot.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessage() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDelete(false) }}

                />
                <div className="message-middle-text">
                    <div className="message-middle-content">
                        <div className='content'>
                            <div className="text-and-hour">
                                <span className='text-message'>{formatText(msg?.text)}</span>
                                <span className={!msg.type.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {
                                        statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type.typeMessage === 'sticker') {
        return (
            <div className=
                {!msg.type.toShow ?
                    " message message-container-client" :
                    "message message-container-attendance"
                }
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                }}
                onMouseEnter={() => { if (!stateExampleMode) setArrowShow(true) }}
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
                    {!!msg.type.toShow ? <MenuItem onClick={() => {
                        setStateDialogDeleteForAll(true)
                        handleClose()
                    }}>Deletar para todos</MenuItem> : null}
                    <MenuItem onClick={() => {
                        setStateDialogDelete(true)
                        handleClose()
                    }}>Deletar</MenuItem>
                </Menu>
                <DialogBox
                    open={stateDialogDeleteForAll}
                    onClose={() => { setStateDialogDeleteForAll(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída tanto no Catbot quanto no Whatsapp.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessageForAll() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDeleteForAll(false) }}
                />
                <DialogBox
                    open={stateDialogDelete}
                    onClose={() => { setStateDialogDelete(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída apenas no Catbot.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessage() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDelete(false) }}

                />
                <div className="message-middle-text">
                    <div className="message-middle-content">
                        <div className='content'>
                            <div className="text-and-hour" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <img src={msg?.file?.url} alt="sticker" style={{ width: '10rem', height: '10rem' }} />
                                <span className={!msg.type.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} style={{ color: 'var(--text-color-one)' }}>
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {
                                        statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else if (msg?.type.typeMessage === 'error') {
        return (
            <div className={!msg.type.toShow ? " message message-container-client" : "message message-container-attendance"}>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={msg.type.typeMessage === 'text' ? "message-middle-text" : "message-middle"}>
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
    else if (msg?.type.typeMessage.includes('document')) {
        return (
            <div className=
                {msg?.type.toShow ?
                    " message message-container-client" :
                    "message message-container-attendance"
                }
                onMouseEnter={() => { if (!stateExampleMode) setArrowShow(true) }}
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
                    {!!msg.type.toShow ?
                        <MenuItem onClick={() => {
                            setStateDialogDeleteForAll(true)
                            handleClose()
                        }}>Deletar para todos</MenuItem> :
                        null}
                    <MenuItem onClick={() => {
                        setStateDialogDelete(true)
                        handleClose()
                    }}>Deletar</MenuItem>
                </Menu>
                <DialogBox
                    open={stateDialogDeleteForAll}
                    onClose={() => { setStateDialogDeleteForAll(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída tanto no Catbot quanto no Whatsapp.'
                    buttonOneText='Excluir'
                    onButtonOne={() => { deleteMessageForAll() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDeleteForAll(false) }}
                />
                <DialogBox
                    open={stateDialogDelete}
                    onClose={() => { setStateDialogDelete(false) }}
                    text='Você deseja excluir a mensagem? Essa mensagem será excluída apenas no Catbot.'
                    buttonOneText='Excluir'
                    onButtonOne={() => {
                        deleteMessage()

                    }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialogDelete(false) }}

                />
                <div className="message-middle">
                    <div className="message-middle-content">
                        <div className='content'>
                            <FilesForMessages m={msg} />
                            {msg?.text ? <div className="text-and-hour"><div className='text-message'> {formatText(msg?.text)}</div>
                                <span className={msg?.type.toShow === true ? 'footer-hour' : 'footer-hour-attendance'} >
                                    {msg?.hour}
                                    {
                                        statusSend ?
                                            <i className='bx bx-check'></i> :
                                            <i className='bx bx-time-five' ></i>
                                    }
                                </span>
                            </div> :
                                <span className={!msg.type.toShow === true ? 'footer-hour-no-text' : 'footer-hour-attendance-no-text'} >
                                    {`${(new Date(msg.date).toLocaleString()).substring(0, 5)}/${(new Date(msg.date).toLocaleString()).substring(8, 10)}, ${(new Date(msg.date).toLocaleString()).substring(12, 17)}`}
                                    {statusSend ? <i className='bx bx-check'></i> : <i className='bx bx-time-five' ></i>}
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