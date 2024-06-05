import './AssistantsList.css';
import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../contexts/userData';
import AssistantsOptions from './AssistantsOptions';
import { ApiBack } from '../service/axios';
import DialogBoxChildren from './DialogBoxChildren';
import InputText from './InputText';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import { Ring } from '@uiball/loaders';
import { ToastContainer } from 'react-toastify';

export default function AssistantsList() {
    const { socket, assistants, setAssistants } = useContext(AppContext)
    const [nameAssistant, setNameAssistant] = useState(null)
    const [dialogNewAssistant, setDialogNewAssistant] = useState(false)


    useEffect(() => {
        async function fetchData() {
            var responseAssistants = await ApiBack.get('assistant/all')
            setAssistants(responseAssistants.data)
        }
        fetchData()
    }, [])
    
    socket.on('updateAssistants', (connections) => {
        setAssistants(connections)
    })
    function newassistant() {
        if (nameAssistant) {
            var data = { name: nameAssistant, status: true }
            ApiBack.post('assistant', data).then((response) => {
                console.log(response.data);
                setAssistants([...assistants, response.data])
                setNameAssistant(null)
            }).catch((error) => {
                console.log(error);
            })
        }
    }
    if (assistants) {
        return (
            <div className="connections-container">
                <ToastContainer />
                <div className="title">Crie, edite ou exclua seus assistentes aqui.</div>
                <DialogBoxChildren open={dialogNewAssistant} onClose={() => { setDialogNewAssistant(false) }} >
                    <div className="dialog-new-connection-container">
                        <div className="header">Como gostaria de chamar esse assistente?</div>
                        <div className="body">
                            <InputText
                                value={nameAssistant}
                                onEnter={() => {
                                    newassistant(); setDialogNewAssistant(false)
                                }} onFocus={true} id='assistantName' placeholder='Nome do Assistente' onChange={(value) => { setNameAssistant(value) }} />
                        </div>
                        <div className="footer">
                            <SecoundaryButton onChange={() => { setDialogNewAssistant(false) }}>Cancelar</SecoundaryButton>
                            <PrimaryButton onChange={() => { newassistant(); setDialogNewAssistant(false) }}>Criar</PrimaryButton>
                        </div>
                    </div>

                </DialogBoxChildren>

                <div className="body">
                    {assistants?.map((assistant) => {
                        return <AssistantsOptions key={assistant._id} data={assistant} update={(data) => {
                            const { action, assistant: dataAssistant } = data
                            if (action === 'delete') {
                                var dataAssistants = JSON.parse(JSON.stringify(assistants))
                                var update = dataAssistants.filter(assist => assist._id !== dataAssistant?._id)
                                setAssistants(update)
                            }
                        }} />
                    })}

                    <AssistantsOptions mode='button' onClick={() => { setDialogNewAssistant(true) }}>
                        <i className='bx bx-plus' ></i>
                    </AssistantsOptions>
                </div>
            </div>
        )
    } else {
        return (
            <div className="ring-container" style={{ minWidth: '15rem', height: '15rem', alignItems: 'center', padding: 0 }}>
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