import './NewClient.css';
import React, { useContext, useEffect } from 'react'
import { ApiBack } from '../service/axios';
import { useState } from 'react';
import InputRounded from './InputRounded';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ButtonModel from './ButtonModel';
import { Ring } from '@uiball/loaders';
export default function SendPreset({ clientsIds, connectionId, onClose }) {
    const [presetSelected, setPresetSelected] = useState(null)
    const [sendStatus, setSendStatus] = useState(false)
    const [presets, setPresets] = useState(null)
    useEffect(() => {
        async function fetchData() {

            var responsePresets = await ApiBack.get('clients/newClientPresets')
            setPresets(responsePresets.data)
        }
        fetchData()
        return () => {
            setPresetSelected(null)

        }
    }, [])

    // useEffect(() => {
    //     console.log(presetSelected);
    // }, [presetSelected])

    function sendPreset() {
        setSendStatus(true)
        ApiBack.post('clients/sendTemplate', { preset: presetSelected, clientsIds: clientsIds, connectionId: connectionId }).then((response) => {
            alert(`Template(s) enviado(s) com sucesso.\n Total de clientes: ${response.data.total} | Sucesso: ${response.data.success} | Falhas: ${response.data.error}`);
            setSendStatus(false)
            onClose()
        }).catch((err) => {
            setSendStatus(false)
            alert(err?.response?.data?.message || 'Erro ao enviar o(s) template(s).');
        })
    }

    return (
        <div className="new-client-container" style={{ width: '20rem' }}>
            <ToastContainer />
            <div className="new-client-section-row" >
                <div className="title">
                    Suas Predefinições
                </div>
                <div className="content" style={{ overflowX: 'hidden', overflowY: 'auto', marginTop: '2rem', marginBottom: '3rem' }}>
                    <InputRounded>
                        {presets?.map((preset, index) => {
                            return <InputRoundedOptionChildren
                                name='presetSend'
                                key={index + '-preset'}
                                onChange={() => {
                                    setPresetSelected(preset)
                                }}
                                checked={presetSelected?._id === preset?._id}
                            >
                                <Presets
                                    checked={presetSelected?._id === preset?._id}
                                    key={index + '-preset'}
                                    data={preset}
                                />
                            </InputRoundedOptionChildren>
                        })}
                    </InputRounded>
                </div>
                <ButtonModel onClick={() => {
                    if (presetSelected) sendPreset()
                    else toast.error('Escolha uma predefinição para enviar o template ao cliente.',
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        }
                    )

                }}>{sendStatus ? <Ring
                    size={25}
                    lineWeight={5}
                    speed={2}
                    color="white"
                /> : 'Enviar'}</ButtonModel>
                <div className="discription">
                    Escolha uma predefinição para o cliente
                </div>
            </div>
        </div >
    )
}


function Presets({ data, checked }) {
    function configuretheme(app) {
        if (app === 'whatsapp') {
            return { icon: 'bx bxl-whatsapp', color: '#3d71ff' }
        } else if (app === 'whatsapp_business_account') {
            return { icon: 'bx bxl-whatsapp', color: '#23b857' }
        } else if (app === 'facebook') {
            return 'bx bxl-facebook'
        } else if (app === 'instagram') {
            return 'bx bxl-instagram'
        } else if (app === 'site') {
            return 'bx bx-planet'
        } else {
            return { icon: 'bx bxl-whatsapp', color: '#3d71ff' }
        }
    }
    return (
        <div style={{
            width: '15rem',
            borderRadius: '.5rem',
            backgroundColor: checked ? 'var(--tree-color)' : configuretheme(data?.appFrom).color,
            color: 'var(--text-color-two)',
            margin: '.3rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
        }}>

            <div style={{
                fontSize: '12pt',
                fontWeight: '500',
                padding: '.5rem'
            }}>{data?.presetName?.length > 25 ? data?.presetName?.substring(0, 25) + '...' : data?.presetName}</div>

        </div>
    )

}