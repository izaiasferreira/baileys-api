import './Connections.css';
import React, { useContext, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';
import { AppContext } from '../contexts/userData';
import ConnectionsOption from './ConnectionsOption';
import { ApiBack } from '../service/axios';
import DialogBoxChildren from './DialogBoxChildren';
import InputText from './InputText';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import { Ring } from '@uiball/loaders';
import { ToastContainer, toast } from 'react-toastify';
import { AuthUser } from '../contexts/authentication';
import InputRounded from './InputRounded';
import InputRoundedOption from './InputRoundedOption';
import IconButton from './IconButton';

export default function Connections() {
    const { companyData, setConnectionsList, connectionsList } = useContext(AppContext)
    const { logout } = useContext(AuthUser)
    const [nameConnections, setNameConnections] = useState(null)
    const [appConnections, setAppConnections] = useState(null)
    const [dialogNewConnection, setDialogNewConnection] = useState(false)
    const [apps] = useState([
        {
            value: 'whatsapp',
            name: 'Whatsapp',
        },
        {
            value: 'whatsapp_business_account',
            name: 'Whatsapp Business',
        },
        {
            value: 'facebook',
            name: 'Facebook',
        },
        {
            value: 'instagram',
            name: 'Instagram',
        },
        {
            value: 'site',
            name: 'Site',
        },
    ])

    useEffect(() => {
        fetchData()
        return () => {
            setConnectionsList(null)
            setNameConnections(null)
        }
    }, [])
    async function fetchData() {
        var responseConnections = await ApiBack.get('connection/getAllConnections').catch((err) => {
            if (err?.response?.status === 401) {
                logout()

            }

        })
        setConnectionsList(responseConnections?.data)
    }
    /*    socket.on('updateConnections', (connections) => {
           console.log(connections);
           setConnectionsList(JSON.parse(JSON.stringify(connections)))
       // }) */
    // socket.off('updateConnection').on('updateConnection', (connection) => {
    //     console.log(connection);
    //     if (connection) {
    //         setConnectionsList((prevConnections) => {
    //             var connectionsCopy = JSON.parse(JSON.stringify(prevConnections));
    //             const index = connectionsCopy?.findIndex((item) => item.id === connection.id);
    //             if (index >= 0) {
    //                 connectionsCopy[index] = connection
    //             }

    //             return connectionsCopy;
    //         });
    //     }

    // })
    function newConnection() {
        if (nameConnections && appConnections) {
            var data = {
                name: nameConnections,
                appFrom: appConnections,
                id: uuid(),
                status: false,
                assistantId: null,
                typeAssistant: 'default',
                messageAssistant: 'Sua mensagem aqui.',
                company: { id: companyData._id, name: companyData.name }
            }
            setConnectionsList([...connectionsList, data])
            ApiBack.post('connection/createConnection', data).then((response) => {
                setConnectionsList(response.data)
                setAppConnections(null)
                setNameConnections(null)
                document.getElementById('connectionName').value = ''
            }).catch((err) => {
                toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            })

        }
    }
    if (connectionsList) {
        return (
            <div className="connections-container">
                <ToastContainer />
                <div className="title" style={{ display: 'flex', justifyContent: 'space-between' }}>Crie ou exclua suas conexões aqui. <IconButton onClick={() => { fetchData() }}> <i className='bx bx-rotate-left'></i></IconButton></div>
                <DialogBoxChildren open={dialogNewConnection} onClose={() => { setDialogNewConnection(false) }} >
                    <div className="dialog-new-connection-container">
                        <div className="header">Digite as informações abaixo para criar uma nova conexão.</div>
                        <div className="body">
                            <InputText onEnter={() => {
                                newConnection(); setDialogNewConnection(false)
                            }} onFocus={true} id='connectionName' placeholder='Nome da Conexão' onChange={(value) => { setNameConnections(value) }} />
                            <div className="title">Tipo de conexão</div>
                            <InputRounded>
                                {apps?.map((app) => {
                                    return <InputRoundedOption checked={app.value === appConnections} key={uuid()} name='appFrom' label={app.name} value={app.value} onChange={(value) => { setAppConnections(value) }} />
                                })}
                            </InputRounded>
                        </div>
                        <div className="footer">
                            <SecoundaryButton onChange={() => { setDialogNewConnection(false) }}>Cancelar</SecoundaryButton>
                            <PrimaryButton onChange={() => { newConnection(); setDialogNewConnection(false) }}>Criar</PrimaryButton>
                        </div>
                    </div>

                </DialogBoxChildren>

                <div className="body">
                    {connectionsList?.map((connection) => {
                        return <ConnectionsOption key={connection.id + '-' + connection._id + '-' + connection.name} data={connection} update={(data) => {
                            const { action, connection } = data
                            var dataConnections = [...connectionsList]
                            if (action === 'update') {
                                var index = dataConnections?.findIndex(con => con?.id === connection?.id)
                                if (index >= 0) {
                                    dataConnections[index] = connection
                                    setConnectionsList(dataConnections)
                                }
                            }
                        }} />
                    })}

                    <ConnectionsOption mode='button' onClick={() => { setDialogNewConnection(true) }}>
                        <i className='bx bx-plus' ></i>
                    </ConnectionsOption>
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
