import './AssistantsOptions.css';
import React, { useState, useEffect, useContext } from 'react'
import Bar from './Space';
import DialogBox from './DialogBox';
import { ApiBack } from '../service/axios';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import { AppContext } from '../contexts/userData';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditCustomAssistant from './EditCustomAssistant';
import Space from './Space';
import Button from './Button';
import InputText from './InputText';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import InputTextArea from './InputTextArea';
import DialogBoxChildren from './DialogBoxChildren';
import addParam from '../service/addParamUrl';
import getParam from '../service/getParamUrl';
import deleteParam from '../service/deleteParamUrl';
export default function AssistantsOptions({ onClick, data, children, mode, update }) {
    const { setPageState, setPageContent, setPageTitle, setPageCallBack, setModal } = useContext(AppContext)
    const [dataState, setDataState] = useState(null)
    const [editState, setEditState] = useState(false)
    const [dialogState, setDialogState] = useState(false)
    const [nameState, setNameState] = useState(null)
    const [dialogDeleteState, setDialogDeleteState] = useState(false)

    useEffect(() => {
        setDataState(data)
        setNameState(data?.name)
        return () => {
            setDataState(null)
        }
    }, [data])

    useEffect(() => {
        handleUrlChange()
    }, [dataState])

    function handleUrlChange() {
        var assistantId = getParam('assistantId')
        if (!assistantId) return
        if (assistantId === data?._id) {
            setModal(false)
            setPageContent(<EditCustomAssistant assistant={dataState} />)
            setPageTitle('Editar Fluxo do Assistente - ' + dataState?.name)
            setPageState(true)
            setPageCallBack([() => {
                setModal(true)
                deleteParam('assistantId')
            }])
        }
    }

    function updateAssistant(dataAssistant) {
        // console.log(dataAssistant);
        ApiBack.put('assistant', dataAssistant)
    }
    function editFlux(dataState) {
        setModal(false)
        setPageContent(<EditCustomAssistant assistant={dataState} />)
        setPageTitle('Editar Fluxo do Assistente - ' + dataState?.name)
        setPageState(true)
        setPageCallBack([() => {
            setModal(true)
            deleteParam('assistantId')
        }])
    }


    if (!mode || mode !== 'button') {
        return (
            <div className={!editState ? "assistants-option-container" : "assistants-option-container-edit"}>
                <ToastContainer />
                <div className="close" onClick={() => {
                    setDialogDeleteState(true)
                }}>
                    <i className='bx bx-trash' ></i>
                </div>

                <DialogBox
                    open={dialogDeleteState}
                    onClose={() => { setDialogDeleteState(false) }}
                    text='Você deseja mesmo excluir este assistente? A exclusão fará com que todas as conexões e ações vinculadas a este assistente parem de funcionar.'
                    buttonOneText='Excluir'
                    onButtonOne={() => {
                        ApiBack.delete(`assistant?id=${dataState?._id}`)
                        update({ action: 'delete', assistant: dataState })
                        setDialogDeleteState(false)
                    }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setDialogDeleteState(false) }}
                />
                <DialogBoxChildren
                    open={dialogState}
                    onClose={() => { setDialogState(false) }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '25rem'
                    }}>
                        <InputText value={dataState?.data?.url} placeholder={'URL'} onChange={(value) => {
                            var dataCopy = JSON.parse(JSON.stringify(dataState))
                            if (!dataCopy?.data) {
                                dataCopy['data'] = { url: null }
                            }
                            dataCopy['data']['url'] = value
                            setDataState(dataCopy)
                        }}></InputText>
                        <InputText value={dataState?.data?.token} placeholder={'Token'} onChange={(value) => {
                            var dataCopy = { ...dataState }
                            if (!dataCopy?.data) {
                                dataCopy['data'] = { token: null }
                            }
                            dataCopy['data']['token'] = value
                            setDataState(dataCopy)
                        }}></InputText>
                    </div>
                    <Space />
                    <PrimaryButtonGenerics onClick={() => {
                        updateAssistant(dataState)
                        setDialogState(false)
                    }}>Salvar</PrimaryButtonGenerics>
                </DialogBoxChildren>

                <div className="header">
                    <div className="icon" >{!dataState?.type?.includes('model') ? <i className='bx bxs-bot' ></i> : <i className='bx bxs-brain'></i>}</div>
                </div>
                <Bar />
                <div className="body">
                    {!editState ? <div className="name" onClick={() => { setEditState(true) }} style={{ cursor: 'pointer' }}> {dataState?.name} </div> :
                        <div>
                            <div className="edit">
                                <InputTextArea
                                    placeholder={'Nome'}
                                    value={dataState?.name}
                                    columns={10}
                                    onChange={(value) => { setDataState({ ...dataState, name: value }) }}
                                />
                                <div className="buttons" style={{ display: 'flex', justifyContent: 'right', borderRadius: '1rem' }}>
                                    <SecoundaryButton onChange={() => { setDataState({ ...dataState, name: nameState }); setEditState(false) }}>Cancelar</SecoundaryButton>
                                    <PrimaryButton onChange={() => { updateAssistant(dataState); setEditState(false) }}>Salvar</PrimaryButton>
                                </div>
                            </div>
                        </div>}
                </div>
                <div className="footer">
                    <Button status={dataState?.status || false} placeholder={!dataState?.status ? 'Desativado' : 'Ativado'} onChange={(value) => {
                        var dataStateCopy = { ...dataState, status: value }
                        setDataState(dataStateCopy)
                        updateAssistant(dataStateCopy)
                    }} />
                    <PrimaryButtonGenerics onClick={() => {
                        addParam('assistantId', dataState?._id)
                        !dataState?.type?.includes('model') ? editFlux(dataState) : setDialogState(true)
                    }}>Editar</PrimaryButtonGenerics>
                </div>
            </div >
        )
    }
    if (mode === 'button') {
        return (
            <div className="assistants-option-container" style={{ cursor: 'pointer' }} onClick={onClick}>
                <div className="icon-button-mode">{children}</div>
            </div>
        )
    }
}
