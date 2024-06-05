
import './ContactExcludeList.css'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import UserForList from './UserForList'
import SectorList from './SectorList'
import CreateNewUser from './CreateNewUser'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import { Ring } from '@uiball/loaders'
import IconButton from './IconButton'
import ContactForExcludeList from './ContactForExcludeList'
import InputText from './InputText'
import Space from './Space'
export default function ContactExcludeList() {
    const { chatDataBase, setChatDatabase } = useContext(AppContext)
    const [clientListDB, setClientistDB] = useState(null)
    const [clientList, setClientist] = useState([])
    const [filter, setFilter] = useState({
        text: null
    })
    useEffect(() => {
        async function fetchData() {
            var response = await ApiBack.get('clients/getAllClients')
            setClientistDB(response.data)
        }
        fetchData()
    }, [])
    useEffect(() => {
        const filteredClients = filterClients(clientListDB, filter)
        setClientist(filteredClients)
    }, [clientListDB, filter]);

    const filterClients = useCallback((clients, filters) => {
        const { text } = filters
        if (clients) {
            var result = clients?.filter(client => {
                var finalResult = false
                //verificação de texto
                if (text && text.length > 0 && text !== '' && text !== ' ') {
                    const { userName, id } = client
                    var textFormated = text.toLowerCase()
                    var nameFormated = userName.toLowerCase()
                    var idFormated = id.toLowerCase()
                    if (nameFormated.includes(textFormated) || idFormated.includes(textFormated)) {
                        finalResult = true
                    } else {
                        finalResult = false
                    }
                } else {
                    finalResult = true
                }
                if (finalResult) { return client } else { return null }
            })
            return result
        }
    }, [])

    function updateList(clientData) {
        var clientListDBCopy = JSON.parse(JSON.stringify(clientListDB))
        var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        var indexChatDatabase = chatDataBaseCopy.findIndex((chatData) => {
            return chatData.chatId === clientData.id && chatData.connectionId === clientData.connection.id
        })
        var indexClientListDB = clientListDBCopy.findIndex((client) => {
            return client.id === clientData.id && client.connection.id === clientData.connection.id
        })
        if (indexClientListDB !== -1) {
            clientListDBCopy[indexClientListDB] = clientData
            setClientistDB(clientListDBCopy)
        }
        if (indexChatDatabase !== -1) {
            chatDataBaseCopy[indexChatDatabase].data = clientData
            setChatDatabase(chatDataBaseCopy)
        }


    }
    if (clientList) {
        return (
            <div className="contact-exclude-list-container">
                <div className="seach">
                    <InputText
                        placeholder='Pesquise um cliente'
                        clear={true}
                        iconData='bx bx-search'
                        onChange={(value) => {
                            setFilter({
                                ...filter,
                                text: value
                            })

                        }}></InputText>
                </div>
                {filter.text && filter.text.length > 0 ? <div className="contacts-container">
                    <div className="contacts">
                        {
                            clientList?.map((client) => {
                                return <ContactForExcludeList
                                    key={client?.id + client.connection.id + 'excludeList'}
                                    client={client}
                                    onUpdate={updateList}
                                />
                            })
                        }
                    </div>
                </div> :
                    clientList && clientList.length > 0 ? <div className="alteradoagora">

                        <div className="contacts-container">
                            <div className="title">Clientes Excluídos</div>
                            <div className="contacts">
                                {
                                    clientList?.map((client) => {
                                        if (client?.exclude) return <ContactForExcludeList
                                            key={client?.id + client?.connection.id + 'excludeList'}
                                            client={client}
                                            onUpdate={updateList}
                                        />
                                    })
                                }
                            </div>
                        </div>
                        <div className="contacts-container">
                            <div className="title">Clientes Não Excluídos</div>
                            <div className="contacts">
                                {
                                    clientList?.map((client) => {
                                        if (!client?.exclude) return <ContactForExcludeList
                                            key={client?.id + client.connection.id + 'excludeList'}
                                            client={client}
                                            onUpdate={updateList}
                                        />
                                    })
                                }
                            </div>
                        </div>

                    </div> :
                        <div style={{ margin: '3rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Ring
                                size={60}
                                lineWeight={5}
                                speed={2}
                                color="blue"
                            />
                        </div>

                }
                <Space />
                <Space />
                <Space />
                <Space />
            </div>
        )
    }
    else {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '25rem',
                height: '80vh'
            }}>
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