
import './SectorsForTransfer.css'
import React, { useContext, useEffect, useState } from 'react'
import { ApiBack } from '../service/axios'
import { AppContext } from '../contexts/userData'
import { AuthUser } from '../contexts/authentication'
import ButtonModel from './ButtonModel';
import InputRounded from './InputRounded';
import InputRoundedOption from './InputRoundedOption';
import DialogBox from './DialogBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function SectorsForTransfer() {
    const { user, client, setClient, chatDataBase, setChatDatabase, } = useContext(AppContext)
    const { logout } = useContext(AuthUser)
    const [sector, setSector] = useState(null)
    const [sectorValue, setSectorValue] = useState(null)
    const [stateDialog, setStateDialog] = useState(false)
    const [stateDialog2, setStateDialog2] = useState(false)
    useEffect(() => {
        ApiBack.get(`sectors`)
            .then((sector) => { setSector(sector.data) }).catch(() => { logout() })
    }, [user, logout]);

    function transfer() {
        var dataClient = client.client.data
        var oldSector = dataClient.sector
        if (dataClient.sector !== sectorValue) {
            dataClient.sector = sectorValue
            dataClient.statusAttendance = false
            dataClient.userInAttendance = null
            ApiBack.put(`clients/transfer`, { id: dataClient.id, connectionId: dataClient.connection.id, nextSector: sectorValue, beforeSector: oldSector }).catch(() => {
                toast.error('Ocorreu um erro ao transferir este cliente, por favor tente novamente.', {
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
        }
        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        var chatFilter = chatDataBaseCopy.filter(chat => chat.chatId !== dataClient.id && chat.connectionId !== dataClient.connection.id)

        if (user.role === 'normal') {
            setChatDatabase(chatFilter)
        }
        setStateDialog(false)
        setClient({ state: false, client: null })
    }
    return (
        <div className="sectors-transfer-container">
            <ToastContainer />
            <div className="sectors-transfer-options">
                <InputRounded >
                    {
                        sector?.map((sector) => {
                            return (sector._id !== user.sectorId && user.role === 'normal' && sector._id !== client.client.data.sector) ||
                                (user.role.includes('admin') && sector._id !== client.client.data.sector)
                                ?
                                <InputRoundedOption
                                    key={sector._id}
                                    onChange={(value) => {
                                        setSectorValue(value)
                                    }}
                                    name='sectors'
                                    id={sector._id}
                                    value={sector._id}
                                    label={sector.name !== 'Default' ? sector.name : 'Padrão'}
                                /> :
                                null
                        })
                    }

                </InputRounded>
                <DialogBox
                    open={stateDialog}
                    text='Deseja mesmo transferir o atendimento?'
                    buttonOneText='Transferir'
                    onButtonOne={() => { transfer() }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setStateDialog(false) }}
                    onClose={() => { setStateDialog(false) }}
                />
                <DialogBox
                    open={stateDialog2}
                    text='É necessário escolher um setor antes de transferir.'
                    onClose={() => { setStateDialog2(false) }}
                />
                <ButtonModel onClick={() => {
                    sectorValue ? setStateDialog(true) : setStateDialog2(true)
                }}> Transferir</ButtonModel>
            </div>

        </div>
    )
}