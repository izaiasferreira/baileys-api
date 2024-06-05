
import './TypeAssistant.css'
import React, { useState, useContext, useEffect } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import MessageComponentExample from './MessageComponentExample'
import { ApiBack } from '../service/axios'
import { v4 as uuidv4 } from 'uuid'
import InputSelect from './InputSelect'
import IconButton from './IconButton'
import InputTextArea from './InputTextArea'
import EmojiComponent from './EmojiComponent'
import { Ring } from '@uiball/loaders'
import InputRoundedOptionChildren from './InputRoundedOptionChildren'
import InputRounded from './InputRounded'
import Space from './Space'

export default function TypeAssistant({ connection, onChange }) {
    const [nameOption] = useState(uuidv4())
    const [option, setOption] = useState(null)
    const [assistants, setAssistants] = useState(null)



    useEffect(() => {
        async function fetchData() {
            setOption(connection)
            var assistantsResponse = await ApiBack.get(`assistant/all`)
            setAssistants(assistantsResponse.data)
        }
        if (connection) fetchData()
        return () => { //executa essa função quando o componente é desmontado
            setAssistants(null)
        }
    }, [connection]);

    if (option) {
        return (
            <div className='type-assistant-container'>
                <div className="custom-area">
                    <div className="title">Por favor escolha o assistente:</div>
                    <InputRounded >
                        {assistants?.map((assistant) => {
                            return <InputRoundedOptionChildren
                                checked={option.assistantId === assistant._id}
                                balls={true}
                                id={assistant._id}
                                key={assistant._id}
                                value={assistant._id}
                                name={'assistant-' + nameOption}
                                onChange={(value) => {
                                    const optionsCopy = { ...option, assistantId: value }
                                    setOption(optionsCopy)
                                    onChange(optionsCopy)
                                }}><div className="content-connection">
                                    <i className='bx bxs-bot'></i> {assistant.name}</div>
                            </InputRoundedOptionChildren>
                        })}
                    </InputRounded>
                </div >
            </div >
        )
    }
    else {
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
