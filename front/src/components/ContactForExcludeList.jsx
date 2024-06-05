
import './ContactForExcludeList.css'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../contexts/userData';
import 'react-toastify/dist/ReactToastify.css';
import { ApiBack } from '../service/axios';
import IconButton from './IconButton';
export default function ContactForExcludeList({ client: clientInfo, onChat, onDelete, onUpdate }) {

    const { sectorsList, } = useContext(AppContext)
    const [clientState, setClientState] = useState(null)
    const [sectorState, setSectorState] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(false)

    useEffect(() => {
        setSectorState(sectorsList.find(sector => sector._id === clientInfo?.sector) || null)
        setClientState(clientInfo)

        return () => {
            setSelectedStatus(null)
            setClientState(null)
        }
    }, [clientInfo, sectorsList])

    useEffect(() => {
        clientInfo ? setClientState(clientInfo) : setClientState(null)
    }, [clientInfo])

    return (
        <div className='contact-for-exclude-list-container' style={{ height: '70px' }}>
            <div className='contact-for-list-body'>
                <div className={'disable-bar'}>
                </div>
                <div className="contact-for-list-name-number-image">
                    <div className="img-contact-for-list">
                        <img
                            src={clientState?.profilePic || '/img/avatar.svg'}
                            alt='Client'
                            onError={(event) => { event.target.src = '/img/avatar.svg' }} />
                    </div>
                    <div className="contact-for-list-number-name">
                        <p className="name">{clientState?.userName}</p>


                        {
                            sectorState ?
                                <p className="sector">{sectorState?.name} | {clientState?.connection?.name}</p> :
                                <p className="sector">Visível para todos | {clientState?.connection?.name}</p>

                        }

                    </div>
                </div>
                <div className="buttons-contact-list" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '10%' }}>
                    <IconButton onClick={() => { onChat() }}><i className='bx bx-message-alt-detail' ></i></IconButton>
                    <IconButton disable onClick={() => { }}>{clientState?.exclude ? <i className='bx bx-minus' ></i> : <i className='bx bx-plus' ></i>}</IconButton>
                </div>
            </div>

        </div >
    )
}