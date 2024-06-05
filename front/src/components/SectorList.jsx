
import './SectorList.css'
import React, { useContext, useEffect, useState } from 'react'
import Modal from './Modal'
import SectorForList from './SectorForList'
import { AppContext } from '../contexts/userData'
import CreateNewSector from './CreateNewSector'
import { ApiBack } from '../service/axios'
import IconButton from './IconButton'
import { Ring } from '@uiball/loaders'
import DialogBoxChildren from './DialogBoxChildren'

export default function SectorList() {
    const [modalNewUser, setModalNewUser] = useState(false)
    const [newSectorDialog, setNewSectorDialog] = useState(false)
    const { setModal, setModalContent, setModalTitle, socket } = useContext(AppContext)
    const [sectors, setSectors] = useState(null)
    useEffect(() => {
        ApiBack.get(`sectors`).then((sectors) => { setSectors(sectors.data) })
        return () => { //executa essa função quando o componente é desmontado
            setSectors(null)
        }
    }, []);

    socket.on('UpdateSectorList', (sectors) => {
        setSectors(sectors)
    })
    if (sectors) {
        return (
            <div className="sector-list-container">
                {/* {modalNewUser === true ? <Modal onClose={() => { setModalNewUser(false) }} title="Adicionar Usuário"> </Modal> : null} */}
                <DialogBoxChildren open={newSectorDialog} onClose={() => { setNewSectorDialog(false) }}>
                    <CreateNewSector
                        onClose={() => {
                            setNewSectorDialog(false)
                            ApiBack.get(`sectors`).then((sectors) => { setSectors(sectors.data) })
                        }}
                    />
                </DialogBoxChildren>
                <div className="sector-list-header">
                    <span className='title'>
                        Setores
                    </span>
                    <span className='options-header'>
                        <IconButton onClick={() => { setNewSectorDialog(true) }}><i className='bx bx-customize'></i></IconButton>
                        <IconButton onClick={() => { ApiBack.get(`sectors`).then((sectors) => { setSectors(sectors.data) }) }}>
                            <i className='bx bx-sync' ></i>
                        </IconButton>
                    </span>
                </div>
                <div className="sector-for-list-body">
                    {sectors?.map((sector) => {
                        return <SectorForList key={sector._id} sector={sector} onDelete={(sector) => {
                            var dataSectors = sectors
                            var filter = dataSectors.filter(sectorData => sectorData._id !== sector._id)
                            setSectors(filter)
                        }} />
                    })}
                </div>
            </div>
        )
    } else {
        return (
            <div className="ring-container" style={{ minWidth: '15rem', height: '10rem', alignItems: 'center', padding: 0 }}>
                <Ring
                    size={60}
                    lineWeight={5}
                    speed={2}
                    color="blue"
                />
            </div>
        )
    }
}