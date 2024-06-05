import './InstancesForList.css';
import React, { useContext, useEffect, useState } from 'react'
import Bar from './Space';
import DialogBoxChildren from './DialogBoxChildren';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from './IconButton';
import PrimaryButtonGenerics from '../components/PrimaryButtonGenerics'
import QRCode from '../components/QRCode'
import { AppContext } from '../contexts/userData';
import InstanceInfos from './InstanceInfos';

export default function InstancesForList({ instance, setInstances }) {
    const [dialogInfosState, setDialogInfosState] = useState(false)
    const [dialogQrCode, setDialogQrCode] = useState(false)
    const {
        socket,
        setSocket

    } = useContext(AppContext)

    useEffect(() => {
        if (instance.statusConnection !== 'qrcode') {
            setDialogQrCode(false)
        } else setDialogQrCode(dialogQrCode)
    }, [instance])

    function textButton(instance) {
        if (instance.statusConnection === 'qrcode') return 'Ler QRCode'
        if (instance.statusConnection === 'connected') return 'Desconectar'
        if (instance.statusConnection === 'disconnected') return 'Conectar'
    }
    function actionButton(params) {
        if (instance.statusConnection === 'qrcode') return setDialogQrCode(true)
        if (instance.statusConnection === 'connected') socket.emit('disconnectInstance', instance.id, (instances) => {
            setInstances(instances)
        })
        if (instance.statusConnection === 'disconnected') socket.emit('connectInstance', instance.id, (instances) => {
            setInstances(instances)
        })

    }
    function styleStatusConnection(params) {
        const all = { marginTop: '.4rem', backgroundColor: 'var(--two-color)', padding: '.5rem', borderRadius: '.5rem', fontWeight: '700' }
        if (instance.statusConnection === 'qrcode') return { ...all, color: 'var(--warn-color)' }
        if (instance.statusConnection === 'connected') return { ...all, color: 'var(--success-color)' }
        if (instance.statusConnection === 'disconnected') return { ...all, color: 'var(--danger-color)' }

    }
    return (
        <div className="instance-option-container" >
            <DialogBoxChildren open={dialogInfosState} onClose={() => { setDialogInfosState(false); }}>
                {<InstanceInfos instanceData={instance} onClose={() => { setDialogInfosState(false); }} update={(instanceUpdate) => {
                    socket.emit('updateInstance', instanceUpdate, (instances) => {
                        setInstances(instances)
                    })
                }} />}
            </DialogBoxChildren>
            <DialogBoxChildren open={dialogQrCode} onClose={() => { setDialogQrCode(false); }}>
                <QRCode qrcode={instance.qrcode} onClose={() => { setDialogQrCode(false); }}></QRCode>
            </DialogBoxChildren>

            <div className="button-edit" style={{ display: 'flex', alignItems: 'center' }} >
                <IconButton onClick={() => { setDialogInfosState(true); }}>
                    <i className='bx bxs-cog'></i>
                </IconButton>
                <IconButton onClick={() => {
                    socket.emit('deleteInstance', instance.id, (instances) => {
                        setInstances(instances)
                    })
                }}>
                    <i className='bx bxs-trash'></i>
                </IconButton>


            </div>

            <div className="header-instance">
                {instance.statusConnection === 'connected' && instance.profilePic ?
                    <img style={
                        {
                            width:'20%',
                            borderRadius:'100%',
                            objectFit: 'cover'
                            
                        }
                    }
                        src={instance.profilePic}
                    /> :
                    <div className="icon" style={true ? { color: 'var(--tree-color)' } : { color: 'var(--five-color)' }}><i className='bx bxl-whatsapp' /></div>}
            </div>
            <Bar />
            <div className="body">
                <div className="name" >{instance?.name}</div>
                <div className="info" > {instance?.id} </div>
                <div className="info" >{instance?.phoneNumberFormated || '+99 99 9999-9999'}</div>
                <div className="info" style={styleStatusConnection(instance)}>{instance?.statusConnection}</div>
            </div>
            <div className="footer">
                <PrimaryButtonGenerics
                    onClick={() => {
                        actionButton(instance)
                    }}>
                    {textButton(instance)}
                </PrimaryButtonGenerics>
            </div>
        </div >
    )
}
