import './Contacts.css';
import React, { useState, useEffect, useContext, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { ApiBack } from '../service/axios';
import { Ring } from '@uiball/loaders';
import { AppContext } from '../contexts/userData';
import InputSelect from './InputSelect';
import ContactForExcludeList from './ContactForExcludeList';
import InputText from './InputText';
import IconButton from './IconButton';
import { debounce } from '@mui/material';
import DialogBoxChildren from './DialogBoxChildren';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import { FixedSizeList } from 'react-window';
import SendPreset from './SendPreset';
export default function Contacts() {
    const {
        setConnectionsList,
        connectionsList,
        client: clientMessageArea,
        setClient,
        chatDataBase,
        setChatDatabase,
        setModal,
        setModalContent,
        setModalTitle
    } = useContext(AppContext)
    const [clients, setClients] = useState([])
    const [clientsShow, setClientsShow] = useState([])
    const [clientsSelected, setClientsSelected] = useState([])
    const [connectionSelected, setConnectionSelected] = useState(null)
    const [nameFind, setNameFind] = useState(null)
    const [limit] = useState(20)
    const [syncStatus, setSyncStatus] = useState(false)
    const [dialogAddClients, setDialogAddClients] = useState(false)
    const [dialogSendPreset, setDialogSendPreset] = useState(false)
    const divRef = useRef();


    const handleTextName = debounce((textValue) => {
        setNameFind(textValue);
    }, 500);

    useEffect(() => {
        setClientsSelected([])
        if (connectionsList?.length > 0) {
            setConnectionSelected(connectionsList[0])
        } else {
            ApiBack.get('connection/getAllConnections').then((response) => {
                setConnectionsList(response?.data)
                setConnectionSelected(response?.data[0])
            })
        }
    }, [connectionsList]);

    useEffect(() => {
        if (connectionSelected) {
            getClients(connectionSelected?.id).then((clients) => {
                setClients(clients)
                setClientsShow(clients?.slice(0, limit))

            })

        }
    }, [connectionSelected]);
    useEffect(() => {

        if (nameFind && nameFind.length > 0 && nameFind !== ' ') {
            setClientsShow(clients?.filter((client) => {
                const { userName, id } = client
                var textFormated = nameFind?.toLowerCase()
                var nameFormated = userName?.toLowerCase()
                var idFormated = id?.toLowerCase()
                if (nameFormated?.includes(textFormated) || idFormated?.includes(textFormated)) {
                    return client
                }
            }))

        } else {
            setClientsShow(clients?.slice(0, limit))
        }
    }, [nameFind]);
    async function getClients(connectionId, limitValue, skipValue) {
        try {
            const response = await ApiBack.post(`clients/getAllClientsByConnection`, {
                connectionId: connectionId,
                name: nameFind,
                limit: limitValue || limit,
                skip: skipValue || 0
            })
            return response.data
        } catch (error) {
            return null;
        }
    }
    async function deleteClient() {
        ApiBack.delete(`clients/deleteClient`, {
            data: {
                ids: clientsSelected,
                connectionId: connectionSelected.id
            }

        })
    }
    const [file, setFile] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleFileInput = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };

    const handleSubmit = async (event) => {
        event?.preventDefault();
        // console.log('Arquivo enviado:', file);
        // Faça o que quiser com o arquivo aqui
        try {
            const formData = new FormData();
            formData.append('file', file);
            // console.log(connectionSelected);
            await ApiBack.post(`clients/addFromFile?connectionId=${connectionSelected?.id}&appFrom=${connectionSelected?.appFrom}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(async (response) => {
                console.log(response.data);
                document.querySelector('input[type=file]').value = ''
                setFile(null)
                await getClients(connectionSelected.id, limit, 0).then((clients) => {
                    setClients(clients)
                    setClientsShow(clients?.slice(0, limit))
                })
                toast.success(`Contatos importados com sucesso. Total: ${response.data.total} | Sucesso: ${response.data.success} | Erros: ${response.data.error}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
                setDialogAddClients(false)
            })

            return true;
        } catch (error) {
            return false;
        }

    };

    if (true) {
        return (
            <div className="contacts-container">
                <ToastContainer />
                <DialogBoxChildren
                    open={dialogAddClients}
                    onClose={() => {
                        document.querySelector('input[type=file]').value = ''
                        setFile(null)
                        setDialogAddClients(false)


                    }}>
                    <div
                        style={{
                            border: '2px dashed var(--text-color-one)',
                            borderRadius: '10px',
                            padding: '20px',
                            textAlign: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                        onDrop={handleDrop}
                        onDragOver={(event) => event.preventDefault()}
                    >
                        <h2>Arraste e solte um arquivo aqui</h2>
                        <input
                            type="file"
                            accept=".xls,.xlsx,.csv"
                            onChange={handleFileInput}
                            style={{ display: 'none' }}
                        />
                        {!file &&
                            <PrimaryButton onChange={() => document.querySelector('input[type=file]').click()}>
                                Clique aqui para selecionar o arquivo
                            </PrimaryButton>
                        }
                        {file &&
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '50%' }}>
                                <SecoundaryButton onChange={() => {
                                    document.querySelector('input[type=file]').value = ''
                                    setFile(null)
                                    document.querySelector('input[type=file]').click()
                                }}>
                                    Escolher outro
                                </SecoundaryButton>
                                <PrimaryButton onChange={handleSubmit}>
                                    Enviar
                                </PrimaryButton>
                            </div>}
                    </div>
                </DialogBoxChildren>
                <div className="header-contacts">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '40%', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <h4 style={{ marginRight: '1rem' }}>Conexão</h4>
                            <InputSelect placeholder='Selecione uma conexão'
                                data={connectionsList?.map(connection => {
                                    return {
                                        name: connection.name, value: connection.id, selected: connectionSelected?.id === connection.id
                                    }
                                })}
                                onChange={(value) => {
                                    var connectionFind = connectionsList.find(connection => connection.id === value)
                                    setConnectionSelected(connectionFind)
                                }}
                            />
                        </div>
                        <IconButton onClick={() => {
                            getClients(connectionSelected?.id, limit, 0).then((clients) => {
                                setClients(clients)
                                setClientsShow(clients?.slice(0, limit))

                            })
                        }}>
                            <i className="bx bx-rotate-left" />
                        </IconButton>
                        {['whatsapp', 'whatsapp_business_account'].includes(connectionSelected?.appFrom) &&
                            <>
                                {connectionSelected?.appFrom === 'whatsapp' && <IconButton disabled={syncStatus} onClick={() => {
                                    setSyncStatus(true)
                                    ApiBack.get(`connection/contactsForWhatsapp?id=${connectionSelected?.id}`).then(() => {
                                        toast.success('Contatos sincronizados com sucesso.', {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "colored",
                                        })
                                        getClients(connectionSelected?.id, limit, 0).then((clients) => {
                                            setClients(clients)
                                            setClientsShow(clients?.slice(0, limit))
                                        })
                                        setSyncStatus(false)
                                    })
                                }}>
                                    {syncStatus ? <Ring
                                        size={20}
                                        lineWeight={9}
                                        speed={2}
                                        color="blue"
                                    /> : <i className='bx bx-sync'></i>}
                                </IconButton>
                                }
                                <IconButton disabled={syncStatus} onClick={() => {
                                    setDialogAddClients(true)
                                }}>
                                    <i className='bx bx-cloud-upload'></i>
                                </IconButton>

                                <SecoundaryButton onChange={() => {
                                    document.getElementById('download-example').click()
                                }}>
                                    Modelo ‎ <i className='bx bxs-download' ></i>
                                </SecoundaryButton>
                                <a id='download-example' style={{ display: 'none' }} href={`${window.location.href}/docs/example.xlsx`}></a>
                            </>}
                    </div>
                    <div style={{ width: '30%' }}>
                        <InputText iconData={'bx bx-search'} size='large' style='clean' placeholder={'Pesquise um contato'} onChange={handleTextName} />
                    </div>
                </div>
                <div className="body-contacts" style={{ overflowY: 'auto', height: '90%' }} ref={divRef}>
                    {connectionSelected?.appFrom === 'whatsapp_business_account' &&
                        <DialogBoxChildren open={dialogSendPreset} onClose={() => { setDialogSendPreset(false) }}>
                            {dialogSendPreset && <SendPreset clientsIds={clientsSelected} connectionId={connectionSelected?.id} onClose={() => {
                                setDialogSendPreset(false)
                            }} />}
                        </DialogBoxChildren>
                    }
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'var(--six-color)',
                        marginBottom: '.5rem',
                        marginTop: '.5rem',
                    }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                margin: '.5rem'
                            }}
                        >
                            <input checked={clientsSelected?.length === clients?.length}
                                onChange={() => {
                                    if (clientsSelected?.length !== clients?.length) {
                                        setClientsSelected(clients?.map(client => client.id))
                                    }
                                    if (clientsSelected?.length === clients?.length) {
                                        setClientsSelected([])
                                    }

                                }} style={{ width: '1rem', height: '1rem', margin: '.5rem' }} type='checkbox' />
                            <div className="h4">Todos</div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-around',
                                margin: '.5rem',
                                width: '15%',

                            }}
                        >
                            {
                                connectionSelected?.appFrom === 'whatsapp_business_account' ?
                                    <IconButton onClick={() => { setDialogSendPreset(true) }}><i className='bx bx-message-alt-edit' ></i></IconButton> :
                                    <IconButton disable onClick={() => { }}><i className='bx bx-message-alt-edit' ></i></IconButton>
                            }
                            <IconButton onClick={async () => {
                                // console.log(clientsSelected, clientMessageArea, connectionSelected?.id);
                                // console.log(clientsSelected.includes(clientMessageArea?.client?.chatId) , clientMessageArea?.client?.connectionId !== connectionSelected.id);
                                if (clientsSelected.includes(clientMessageArea?.client?.chatId) && clientMessageArea?.client?.connectionId === connectionSelected.id) {
                                    setClient(client => ({ ...client, state: false }));
                                }
                                setClients(clientsOld => {
                                    var result = clientsOld.filter(client => !clientsSelected.includes(client.id))
                                    setClientsShow(result?.slice(0, limit))
                                    return result
                                })

                                await deleteClient()
                                setChatDatabase(oldChatDatabase => oldChatDatabase.filter(chat => !clientsSelected.includes(chat.chatId) && chat.connectionId !== connectionSelected?.id))
                                setClientsSelected([])
                            }}><i className='bx bx-trash' ></i></IconButton>
                            <IconButton onClick={() => {
                                var result = clientsSelected.map((clientId) => {
                                    var find = clients.find((clientFind) => clientFind.id === clientId)?.exclude ? false : true
                                    return { id: clientId, connectionId: connectionSelected.id, data: { exclude: find } }
                                })
                                ApiBack.put(`clients/many`, {
                                    data: result
                                }).then(() => {
                                    setClients(clientsOld => {
                                        var result = clientsOld.map(client => {
                                            if (clientsSelected.includes(client.id)) {
                                                var index = clientsOld.findIndex(clientFind => clientFind.id === client.id)
                                                if (index >= 0) {
                                                    var value = clientsOld[index]['exclude']
                                                    clientsOld[index]['exclude'] = !value ? true : false
                                                    return clientsOld[index]
                                                }
                                            }
                                            return client

                                        })
                                        setClientsShow(result?.slice(0, limit))
                                        setClientsSelected([])
                                        return result
                                    })

                                })


                            }}><i className='bx bx-user-minus'></i></IconButton>
                        </div>
                    </div>
                    {
                        clientsShow?.length > 0 ? clientsShow?.map((client, index) => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <input key={client.id + '-checkbox-' + index} checked={clientsSelected?.find(clientId => clientId === client?.id) ? true : false}
                                        onChange={() => {
                                            if (clientsSelected?.find(clientId => clientId === client?.id)) {
                                                setClientsSelected(clientsSelected?.filter(clientId => clientId !== client?.id))
                                            }
                                            else {
                                                setClientsSelected([...clientsSelected, client?.id])
                                            }

                                        }} style={{ width: '1rem', height: '1rem', margin: '1rem' }} type='checkbox' />
                                    <ContactForExcludeList
                                        key={client.id + '-' + index}
                                        client={client}
                                        onChat={() => {
                                            var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
                                            var index = chatDataBaseCopy.findIndex(chat => chat.chatId === client.id && chat.connectionId === connectionSelected?.id)
                                            if (index !== -1) {
                                                setClient({ state: true, client: chatDataBaseCopy[index] })
                                                setModalTitle(null);
                                                setModalContent(null)
                                                setModal(false)

                                            }
                                            else {
                                                ApiBack.get(`clients/getUniqueClient?id=${client?.id}&connectionId=${client?.connection?.id}`)
                                                    .then(async (responseChatsList) => {
                                                        chatDataBaseCopy.push(responseChatsList?.data)
                                                        setChatDatabase(chatDataBaseCopy)
                                                        setClient({ state: true, client: responseChatsList?.data })
                                                        setModalTitle(null);
                                                        setModalContent(null)
                                                        setModal(false)
                                                    })
                                            }
                                        }}
                                        // onDelete={() => {
                                        //     deleteClient(client.id, client.connection.id)
                                        //     var indexChatDatabase = chatDataBase.findIndex(chat => chat.chatId === client.id && chat.connectionId === connectionSelected?.id)
                                        //     if (indexChatDatabase !== -1) {
                                        //         var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
                                        //         chatDataBaseCopy.splice(indexChatDatabase, 1)
                                        //         setChatDatabase(chatDataBaseCopy)
                                        //         if (clientMessageArea.chatId !== client.id && clientMessageArea.connectionId !== client.connection.id) {
                                        //             setClient({ state: false, client: null })
                                        //         }
                                        //     }
                                        //     setClients(clientsOld => clientsOld.filter(clients => clients.id !== client.id))

                                        // }}
                                        onUpdate={(dataExclude) => {
                                            var clientsCopy = JSON.parse(JSON.stringify(clients))
                                            var index = clientsCopy.findIndex(clientData => clientData.id === client.id && clientData.connection.id === client.connection.id)
                                            if (index !== -1) {
                                                clientsCopy[index] = { ...clientsCopy[index], ...dataExclude }
                                                setClients(clientsCopy)

                                            }
                                        }}
                                    />
                                </div>
                            )
                        }) :
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', width: '100%', fontStyle: 'italic', opacity: '0.5' }}>Não há contatos</div>
                    }
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', width: '100%' }}>
                        {/* !stopGetClient && */ clients?.length > 0 && <IconButton onClick={() => {
                            setClientsShow(clientsOld => [...clientsOld, ...clients?.slice(clientsShow?.length, clientsShow?.length + limit)])
                        }}> <i className='bx bx-plus' ></i></IconButton>}
                    </div>
                </div >
            </div >
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


// Função para gerar uma grande lista de dados de exemplo
const generateData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push(`Item ${i}`);
    }
    return data;
};

// Componente para renderizar um item da lista
const ListItem = ({ index, style, data }) => {
    return (
        <div style={style}>
            {data[index]}
        </div>
    );
};

// Componente principal que renderiza a lista virtualizada
const VirtualizedList = () => {
    // Gerar uma grande lista de dados de exemplo
    const data = generateData(10000); // Você pode ajustar o número conforme necessário

    return (
        <div style={{ height: 400, width: '100%' }}>
            <FixedSizeList
                height={'90%'} // Altura do contêiner da lista
                width={'100%'} // Largura do contêiner da lista
                itemCount={data.length} // Número total de itens na lista
                itemSize={50} // Altura de cada item
            >
                {({ index, style }) => (
                    <ListItem index={index} style={style} data={data} />
                )}
            </FixedSizeList>
        </div>
    );
};

