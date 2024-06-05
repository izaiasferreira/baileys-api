
import './Config.css'
import Button from './Button'
import HourConfig from './HourConfig'
import Bar from './Bar'
import Space from './Space'
import React, { useState, useEffect, useContext } from 'react'
import { AuthUser } from '../contexts/authentication';
import { ApiBack } from '../service/axios';
import TypeAssistant from './TypeAssistant'
import { Ring } from '@uiball/loaders'
import InputNumber from './InputNumber'
import { debounce } from '@mui/material'
import InputText from './InputText'
import InputSelect from './InputSelect'
import OutputCopyText from './OutputCopyText'
import { AppContext } from '../contexts/userData'

export default function Config() {
    const [infos, setInfos] = useState(null)
    const { logout } = useContext(AuthUser)
    const { sectorsList } = useContext(AppContext)

    useEffect(() => {
        async function fetchData() {
            var response = await ApiBack.get(`informations/infos`).catch(() => { logout() })
            setInfos(response?.data)
        }
        fetchData()
        return () => {
            setInfos(null)
        }
    }, [logout])

    function generateProtocol(type) {
        function generateCurrentDate() {
            const date = new Date();
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            return `${day}${month}${year}`;
        }

        function generateRandomCombinationLetters() {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            let combination = '';
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * letters.length);
                combination += letters[randomIndex];
            }
            return combination.toUpperCase();
        }

        function generateRandomCombinationNumbers() {
            const numbers = '0123456789';
            let combination = '';
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                combination += numbers[randomIndex];
            }
            return combination;
        }
        if (type === 'type1' || !type) {
            return `${infos?.protocolData?.prefix || ''}${generateCurrentDate()}${generateRandomCombinationNumbers()}`
        }
        if (type === 'type2') {
            return `${infos?.protocolData?.prefix || ''}${generateRandomCombinationNumbers()}${generateRandomCombinationLetters()}`
        }
        if (type === 'type3') {
            return `${infos?.protocolData?.prefix || ''}${generateCurrentDate()}${generateRandomCombinationLetters()}`
        }
    }

    const handleUpdateMinutes = debounce((value) => {
        var data = { ...infos, finishedAutomaticAttendanceMessage: { ...infos?.finishedAutomaticAttendanceMessage, minutes: parseInt(value) } }
        updateInformations(data)
        setInfos(data)
        console.log('updateMinites');
    }, 0);

    function updateInformations(informations) {
        ApiBack.put(`informations`, informations).catch(() => { logout() })
    }

    if (infos) {
        return (
            <div className="config-container" >
                <div className="config-content">
                    <div className="config-content-body">
                        <div className="config-option">
                            <h1 className="title">Funcionamento</h1>
                            <Button placeholder='Ligar/Desligar' onChange={(value) => {
                                var data = { ...infos, funcStatus: value }
                                updateInformations(data)
                                setInfos(data)
                                console.log('ligar');
                            }} status={infos?.funcStatus} />
                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <h1 className="title">Horário de Atendimento</h1>
                            <HourConfig infos={infos} onChange={(data) => {
                                updateInformations(data)
                                setInfos(data)
                                console.log('SET HOUR');
                            }} />
                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <h1 className="title">Mensagem de Ausência</h1>
                            <TypeAssistant
                                connection={infos?.absenceMessage}
                                onChange={(value) => {
                                    var data = { ...infos, absenceMessage: value }
                                    updateInformations(data)
                                    setInfos(data)
                                    console.log('Ausencia');
                                }} />
                            <Button
                                placeholder='Ativar/Desativar'
                                status={infos?.absenceMessage?.status}
                                bold
                                onChange={(value) => {
                                    var newData = { ...infos };
                                    var newEndMessage = {
                                        ...newData.absenceMessage,
                                        status: value,
                                    };
                                    newData.absenceMessage = newEndMessage;
                                    updateInformations(newData);
                                    setInfos(newData);

                                }} />
                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <h1 className="title">Ao finalizar o atendimento</h1>
                            <TypeAssistant
                                connection={infos?.endMessage}
                                onChange={(value) => {
                                    var data = { ...infos, endMessage: value }
                                    updateInformations(data)
                                    setInfos(data)
                                    console.log('finalizar');
                                }} />
                            <Button
                                placeholder='Ativar/Desativar'
                                status={infos?.endMessage?.status}
                                bold
                                onChange={(value) => {
                                    var newData = { ...infos };
                                    var newEndMessage = {
                                        ...newData.endMessage,
                                        status: value,
                                    };
                                    newData.endMessage = newEndMessage;
                                    updateInformations(newData);
                                    setInfos(newData);

                                }} />
                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <Space />
                            <h1 className="title">Encaminhar automaticamente</h1>
                            <Space />
                            <InputSelect
                                style={{ width: '100%' }}
                                placeholder='Selecione um setor'
                                data={sectorsList?.map(sector => {
                                    if (sector.name === 'Default') sector.name = 'Padrão'
                                    return { name: sector.name, value: sector._id, selected: infos.sectorAutomaticTransfer === sector._id ? true : false }
                                })}
                                onChange={(value) => {
                                    var data = { ...infos, sectorAutomaticTransfer: value };
                                    updateInformations(data);
                                    setInfos(data)
                                }}
                            />
                            <Space />
                            <Space />
                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <h1 className="title">Quando o cliente demorar responder</h1>
                            <Space />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                Após
                                <InputNumber
                                    min={1}
                                    id={'minutes'}
                                    dataDefault={infos?.finishedAutomaticAttendanceMessage?.minutes}
                                    onChange={handleUpdateMinutes}
                                />
                                minuto(s)
                            </div>
                            <Space />
                            <Space />
                            <TypeAssistant
                                disableCientMessageShowing={true}
                                connection={infos?.finishedAutomaticAttendanceMessage}
                                onChange={(value) => {
                                    var data = { ...infos, finishedAutomaticAttendanceMessage: value }
                                    updateInformations(data)
                                    setInfos(data)
                                    console.log('demora');
                                }} />
                            <Button
                                placeholder='Ativar durante o atendimento'
                                status={infos?.finishedAutomaticAttendanceMessage?.inAttendance}
                                bold
                                onChange={(value) => {
                                    var newData = { ...infos };
                                    var newfinishedAutomaticAttendanceMessage = {
                                        ...newData.finishedAutomaticAttendanceMessage,
                                        inAttendance: value,
                                    };
                                    newData.finishedAutomaticAttendanceMessage = newfinishedAutomaticAttendanceMessage;
                                    updateInformations(newData);
                                    setInfos(newData);

                                }} />
                            <Button
                                placeholder='Ativar/Desativar'
                                status={infos?.finishedAutomaticAttendanceMessage?.status}
                                bold
                                onChange={(value) => {
                                    var newData = { ...infos };
                                    var newfinishedAutomaticAttendanceMessage = {
                                        ...newData.finishedAutomaticAttendanceMessage,
                                        status: value,
                                    };
                                    newData.finishedAutomaticAttendanceMessage = newfinishedAutomaticAttendanceMessage;
                                    updateInformations(newData);
                                    setInfos(newData);

                                }} />

                        </div>
                        <Space />
                        <Bar />
                        <Space />
                        <div className="config-option">
                            <h1 className="title">Protocolo de Atendimento</h1>
                            <OutputCopyText placeholder={generateProtocol(infos?.protocolData?.type || 'type1')} />
                            <Space />
                            <InputText
                                onChange={(value) => {
                                    var data = { ...infos, protocolData: { ...infos?.protocolData, prefix: value } };
                                    updateInformations(data);
                                    setInfos(data)
                                    console.log('protocolo');
                                }}
                                value={infos?.protocolData?.prefix}
                                placeholder='Prefixo' />
                            <InputSelect
                                placeholder={'Padrão de Protocolo'}
                                data={
                                    [
                                        { name: 'PREFIXO + DATA ATUAL + NÚMERO ALEATÓRIO', value: 'type1', selected: infos?.protocolData?.type === 'type1' ? true : false },
                                        { name: 'PREFIXO + NÚMERO ALEATÓRIO + LETRAS ALEATÓRIAS', value: 'type2', selected: infos?.protocolData?.type === 'type2' ? true : false },
                                        { name: 'PREFIXO + DATA ATUAL + LETRAS ALEATÓRIAS', value: 'type3', selected: infos?.protocolData?.type === 'type3' ? true : false },
                                    ]

                                }
                                onChange={(value) => {
                                    var newData = JSON.parse(JSON.stringify(infos));
                                    if (newData.protocolData === undefined) {
                                        newData.protocolData = {};
                                    }
                                    newData.protocolData.type = value;
                                    updateInformations(newData)
                                    setInfos(newData)
                                }}
                            />
                            <Space /><Space />
                            <Button
                                placeholder='Ativar/Desativar'
                                status={infos?.protocolData?.status || false}
                                bold
                                onChange={(value) => {
                                    var newData = { ...infos };
                                    var newProtocolData = {
                                        ...newData.protocolData,
                                        status: value,
                                    };
                                    newData.protocolData = newProtocolData;
                                    updateInformations(newData);
                                    setInfos(newData);

                                }} />
                        </div>
                        <Space />

                    </div>
                </div>
            </div>
        )
    }
    if (infos === null) {
        return (
            <div className="ring-container" style={{ minWidth: '23rem', height: '35rem', alignItems: 'center', padding: 0 }}>
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