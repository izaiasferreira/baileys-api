
import './ContactForList.css'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../contexts/userData';
import 'react-toastify/dist/ReactToastify.css';
import getTypeMessage from '../service/getTypeMessage';
import { useCallback } from 'react';
import addParam from '../service/addParamUrl';
import deleteParam from '../service/deleteParamUrl';
import formatDate from '../service/formatDate';
export default function ContactForList({ client: clientInfo, bookmarks, state, message }) {

    const { user, client, setClient, chatDataBase, sectorsList, usersList } = useContext(AppContext)
    const [clientState, setClientState] = useState(null)
    const [sectorState, setSectorState] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(false)
    const [bookmark, setBookmark] = useState(null)
    const [messageState, setMessageState] = useState(null)
    const verifyIsSelected = useCallback((client, clientState) => {
        if ((client && clientState) && (client?.client?.data.id === clientState?.id && client?.client?.connectionId === clientState?.connection.id)) {
            return true

        }
        if ((!client && !clientState) || client?.client?.data.id !== clientState?.id || client?.client?.connectionId !== clientState?.connection.id) {
            return false
        }

    }, [client, clientState])

    useEffect(() => {
        setSectorState(sectorsList.find(sector => sector._id === clientInfo?.sector) || null)
        setClientState(clientInfo)
        setBookmark(bookmarks)
        setMessageState(message)
        return () => {
            setSelectedStatus(null)
            setClientState(null)
            setBookmark(null)
            setMessageState(null)
        }

    }, [bookmarks, clientInfo, message, state, user, sectorsList])

    useEffect(() => {
        clientInfo ? setClientState(clientInfo) : setClientState(null)
    }, [clientInfo])

    useEffect(() => {
        setBookmark(bookmarks)
    }, [bookmarks])

    useEffect(() => {
        var value = verifyIsSelected(client, clientState)
        setSelectedStatus(value)
    }, [client, verifyIsSelected, clientState])

    function setBookmarks() {
        if (clientState?.bookmarks?.length > 0) {
            var index = bookmark?.findIndex(bookmark => bookmark?._id === clientState?.bookmarks[0])
            if (index >= 0) {
                if (clientState?.bookmarks?.length === 1) {
                    return (<div style={{ backgroundColor: bookmark[index]?.color, color: bookmark[index]?.textColor }} className="bookmark">{
                        " " + (bookmark[index]?.name?.length > 11 ? bookmark[index]?.name?.substring(0, 11) + '...' : bookmark[index]?.name)
                    }</div>)
                }
                if (clientState?.bookmarks?.length > 1) {
                    return (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <div style={{ backgroundColor: bookmark[index]?.color, color: bookmark[index]?.textColor }} className="bookmark">{
                                (bookmark[index]?.name?.length > 11 ? bookmark[index]?.name?.substring(0, 11) + '...' : bookmark[index]?.name)
                            }</div>
                            <div className="bookmark">+{clientState?.bookmarks?.length - 1}</div>
                        </div>)
                }
            } else {
                return <p className="bookmark"><i className='bx bx-tag'></i></p>
            }
        } else {
            return <p className="bookmark"><i className='bx bx-tag'></i></p>
        }

    }
    function setIcon(clientState) {
        if (clientState?.appFrom === 'site') {
            return <i className='bx bx-globe'></i>
        }
        else if (['whatsapp', 'facebook', 'instagram']?.includes(clientState?.appFrom)) {
            return <i className={`bx bxl-${clientState?.appFrom}`}></i>
        } else if (clientState?.appFrom === 'whatsapp_business_account') {
            return <i className='bx bxl-whatsapp' ></i >
        } else {
            return <i className='bx bx-link'></i>
        }
    }

    return (
        <div className={selectedStatus ? 'contact-for-list-container selected' : 'contact-for-list-container'}
            id={clientState?.id + "-" + clientState?.connection?.id + "-" + clientState?._id}
            onClick={() => {
                if (!selectedStatus) {

                    let chatDatabaseCopy = JSON.parse(JSON.stringify(chatDataBase))
                    let index = chatDatabaseCopy.findIndex(chat => chat.chatId === clientState?.id && chat.connectionId === clientState?.connection?.id)
                    if (index >= 0) {
                        addParam('chatId', chatDatabaseCopy[index].chatId)
                        addParam('connectionId', chatDatabaseCopy[index].connectionId)
                        setClient({ state: true, client: chatDatabaseCopy[index] })
                    }
                } else {
                    deleteParam('chatId')
                    deleteParam('connectionId')
                    setClient({ state: false, client: null })
                }
            }}>
            <div className={clientState?.inLine ? 'contact-for-list-body' : 'contact-for-list-body disable-state'}>
                <div className={selectedStatus === true ? "selected-bar" : 'disable-bar'}>
                </div>
                <div className="contact-for-list-name-number-image">
                    <div className="img-contact-for-list">

                        <span className={`img-icon-app-from ${clientState?.inLine ? clientState?.appFrom : 'other'}`}>
                            {setIcon(clientState)}
                        </span>
                        <img style={
                            clientState?.userInAttendance ?
                                { border: '2px solid var(--tree-color)', outlineOffset: '-5px' } :
                                { border: '2px solid var(--two-color)', outlineOffset: '-5px' }
                        }
                            src={clientState?.profilePic || '/img/avatar.svg'}
                            alt='Client'
                            onError={(event) => { event.target.src = '/img/avatar.svg' }} />
                    </div>
                    <div className="contact-for-list-number-name">

                        <div className="name">{clientState?.userName?.length > 25 ? clientState?.userName?.substring(0, 25) + '...' : clientState?.userName}
                            {clientState?.userInAttendance ?
                                user._id === clientState?.userInAttendance ?
                                    <span style={{
                                        margin: 0,
                                        padding: '0 .5rem 0 .5rem',
                                        borderRadius: '50rem',
                                        marginLeft: '.5rem',
                                        color: 'var(--success-color-text)',
                                        backgroundColor: 'var(--success-color)',
                                        fontSize: '9pt',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                    }}>
                                        <i className='bx bx-user'></i>
                                        Você
                                    </span> :
                                    <span style={{
                                        margin: 0,
                                        padding: '0 .5rem 0 .5rem',
                                        borderRadius: '50rem',
                                        marginLeft: '.5rem',
                                        color: 'var(--warn-color-text)',
                                        backgroundColor: 'var(--warn-color)',
                                        fontSize: '9pt',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                    }}>
                                        <i className='bx bx-user'></i>
                                        {usersList?.find(user => user.id === clientState?.userInAttendance)?.name}
                                    </span>
                                : null}
                        </div>

                        <div id={`lastMessage${messageState?.idConversation}`} className="message" >
                            {getTypeMessage(messageState)}
                        </div>

                        {user.role.includes('admin') ?
                            sectorState ?
                                <p className="sector">{sectorState?.name} | {clientState?.connection?.name}</p> :
                                <p className="sector">Visível para todos | {clientState?.connection?.name}</p> :
                            <div className="bookmarks-container">
                                <p className="sector" style={{ marginRight: '.3rem' }}> {clientState?.connection?.name}</p> {bookmark ? setBookmarks() : null}
                            </div>

                        }

                    </div>
                </div>
                {chatDataBase?.find(chat => chat.chatId === clientState?.id)?.messages?.filter(message => message.read === false)?.length > 0 ?
                    <div className='hour-message' style={{ color: 'var(--tree-color)', fontWeight: '600' }}>{formatDate(messageState?.date, 'HH:mm')}
                        <div className="unread-messages">
                            {chatDataBase?.find(chat => chat.chatId === clientState?.id)?.messages.filter(message => message.read === false)?.length}
                        </div>
                    </div> :
                    <div className='hour-message'>{formatDate(messageState?.date, 'HH:mm')}</div>
                }

            </div>
            {user.role.includes('admin') ?
                <div className="bookmarks-of-client" >
                    {bookmark ? setBookmarks() : null}
                </div> : null}
        </div >
    )
}