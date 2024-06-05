import './InstanceInfos.css';
import React, { useContext, useState } from 'react'
import InputText from './InputText';
import ButtonModel from './ButtonModel';
import { AdminContext } from '../contexts/userData/admin';
import Space from './Space';
import Button from './Button'

export default function InstanceInfos({ instanceData, update }) {
    const [instanceInfos, setInstanceInfos] = useState(instanceData)

    const styleTitles = {
        fontSize: '12pt',
        fontWeight: '500',
        padding: '.2rem'
    }
    function saveInfos() {
        update(instanceInfos)
    }



    return (
        <div className='company-infos-container'>
            <Space />

            <div className="title" style={styleTitles}>Informações gerais</div>
            <InputText value={instanceInfos?.name} placeholder='Nome da Instância' onChange={(value) => { setInstanceInfos(old => { return { ...old, name: value } }) }} />
            <Space />
            <Space />
            <Button placeholder='Webhook' status={instanceInfos?.webhook?.state} emphasis onChange={(value) => {
                var infosCopy = { ...instanceInfos }
                infosCopy.webhook.state = value
                setInstanceInfos(infosCopy)
            }} />
            <InputText value={instanceInfos?.webhook?.url} placeholder='Url do webhook' onChange={(value) => {
                var infosCopy = { ...instanceInfos }
                infosCopy.webhook.url = value
                setInstanceInfos(infosCopy)
            }} />

            <div className="title" style={styleTitles}>Eventos</div>
            {Object.keys(instanceInfos?.webhook?.events).map((key) => {
                return <Button placeholder={key} status={instanceInfos?.webhook?.events[key]} onChange={(state) => {
                    var infosCopy = { ...instanceInfos }
                    infosCopy.webhook.events[key] = state
                    setInstanceInfos(infosCopy)
                }} />
            })}
            <Space />
            <Space />
            <ButtonModel onClick={() => {
                saveInfos()

            }}>Salvar</ButtonModel>
        </div>
    )
}