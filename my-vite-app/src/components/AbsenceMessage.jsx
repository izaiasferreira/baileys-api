
import './AbsenceMessage.css'
import React, { useState, useContext, useEffect } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import MessageComponentExample from './MessageComponentExample'
import IconButton from './IconButton'
import InputTextArea from './InputTextArea'
import Button from './Button'
import EmojiComponent from './EmojiComponent'


export default function AbsenceMessage({ infos, onChange }) {
    const [statusMessage, setStatusMessage] = useState(null)
    const [info, setInfo] = useState(null)
    const { user } = useContext(AppContext)
    useEffect(() => {
        setInfo(infos)
        setStatusMessage(false)
        return () => { //executa essa função quando o componente é desmontado
            setInfo(null)
            setStatusMessage(null)
        }
    }, [infos]);
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }

    function updateMessage() {
        var message = document.getElementById('textAreaInfos')
        if (message.value) {
            var data = info
            data.absenceMessage = message.value
            ApiBack.put(`informations`, data)
            setInfo(data)
            onChange(data)
            setStatusMessage(false)
        }
    }
    if (statusMessage === false) {
        return (

            <div>
                <div className='absence-message-container'>
                    <div className="part">
                        <MessageComponentExample
                            text={'Olá!'}
                            url={null}
                            toShow={true}
                            typeMessage='text'
                            size={25}
                        />
                    </div>
                    <div className="part">
                        <MessageComponentExample
                            text={info?.absenceMessage || 'Sua mensagem de ausência.'}
                            url={null}
                            toShow={false}
                            typeMessage='text'
                            size={25}
                        />
                        {user.role.includes('admin') ? <IconButton
                            onClick={() => {
                                setStatusMessage(true)
                            }} > <i className='bx bx-edit'></i></IconButton> : null}
                    </div>
                </div>

                {
                    user.role !== 'admin' ?
                        <div className="config-option">

                            <div className='status'>
                                Enviar mensagem de ausência? <span> {info?.sendAbsenceMessage ? "Sim" : "Não"} </span>
                            </div>
                        </div>
                        :
                        <div className="config-option">
                            <Button placeholder='Enviar mensagem' onChange={(value) => {
                                var data = info
                                data.sendAbsenceMessage = value
                                ApiBack.put(`informations`, data).catch(() => { })
                                onChange(data)
                            }} status={info?.sendAbsenceMessage} />
                        </div>
                }
            </div>
        )
    } else {
        return (
            <div className='absence-message-container'>
                <div className='edit'>
                    <div className="text-area">
                        <EmojiComponent target={anchorEmoji} onClick={() => { targetEmoji(document.getElementById('textAreaInfos')) }}></EmojiComponent>
                        <InputTextArea
                            onChange={(value) => {
                                var infoCopy = JSON.parse(JSON.stringify(info))
                                infoCopy.absenceMessage = value
                                setInfo(infoCopy)
                            }}
                            onFocus
                            value={info?.absenceMessage}
                            id="textAreaInfos"
                            placeholder='Digite sua mensagem de ausência!'
                            emoji={true}
                        />
                    </div>
                    <div className="buttons">
                        <SecoundaryButton onChange={() => {
                            setStatusMessage(false)
                        }}>Cancelar</SecoundaryButton>
                        <PrimaryButton onChange={() => {
                            updateMessage()
                        }} > Salvar </ PrimaryButton>
                    </div>

                </div>
            </div>
        )
    }
}
