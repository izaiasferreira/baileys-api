import './ConnectionsOption.css';
import React, { useState, useEffect, useContext } from 'react'
import Bar from './Space';
import DialogBox from './DialogBox';
import { ApiBack } from '../service/axios';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import { AppContext } from '../contexts/userData';
import DialogBoxChildren from './DialogBoxChildren';
import QRcode from './QRCode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from './IconButton';
import TypeAssistant from './TypeAssistant';
import { backUrl } from '../service/backUrl';
import InputText from './InputText';
import OutputCopyText from './OutputCopyText';


export default function ConnectionsOption({ onClick, data, children, mode, update }) {
    const { user, setConnectionsList, connectionsList } = useContext(AppContext)
    const [dataStateConnection, setDataStateConnection] = useState(null)
    const [dialogCloseState, setDialogCloseState] = useState(false)
    const [dialogConfigState, setDialogConfigState] = useState(false)
    const [dialogDisconnectState, setDialogDisconnectState] = useState(false)
    const [dialogQrcodeState, setDialogQrcodeState] = useState(false)

    function configureIconClass(app) {
        if (app === 'whatsapp') {
            return 'bx bxl-whatsapp'
        } else if (app === 'whatsapp_business_account') {
            return 'bx bxl-whatsapp'
        } else if (app === 'facebook') {
            return 'bx bxl-facebook'
        } else if (app === 'instagram') {
            return 'bx bxl-instagram'
        } else if (app === 'site') {
            return 'bx bx-planet'
        } else {
            return 'bx bx-link'
        }
    }
    useEffect(() => {
        setDataStateConnection(data)
        /*  if ((!data?.status || data?.status === true) && data?.appFrom === 'whatsapp' && dialogQrcodeState) {
             setDialogQrcodeState(false)
         } */
        return () => {
            setDataStateConnection(null)
        }
    }, [data])

    function typeAssistant(type) {
        if (type === 'default') {
            return 'Padrão'
        }
        if (type === 'sector') {
            return 'Setor'
        }
        if (type === 'custom') {
            return 'Personalizado'

        }
    }
    function disconnect(connection) {
        ApiBack.post(`connection/endConnection?id=${connection.id}`).then((response) => {
            var connections = JSON.parse(JSON.stringify(connectionsList))
            var index = connections.findIndex((c) => c.id === response.data.id)
            connections[index] = response.data
            setConnectionsList(connections)
        })
    }
    function connect(connection) {
        ApiBack.post(`connection/startConnection?id=${connection.id}`).then((response) => {
            var connections = JSON.parse(JSON.stringify(connectionsList))
            var index = connections.findIndex((c) => c.id === response.data.id)
            connections[index] = response.data
            setConnectionsList(connections)
            if (response?.status === 'qrCode') {
                setDialogQrcodeState(true)
            }
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

    function copyLink() {
        // console.log('dataStateConnection', dataStateConnection);
        var code = `${window.location.href}externalchat?name=${dataStateConnection.name}&token=${dataStateConnection?.data?.token}&textTitle=Chat`;

        // Copia o código para a área de transferência
        navigator.clipboard.writeText(code)
            .then(function () {
                toast.success('Copiado para a área de transferência.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })
            .catch(function (error) {
                // Exibe uma mensagem de erro, se ocorrer algum problema
                console.error('Erro ao copiar o código:', error);
            });
    }
    function copyCode() {
        // console.log('dataStateConnection', dataStateConnection);
        var code = ` 
        <div class="cattalk-external-chat-container">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link href='${window.location.href}externalChatFiles/style.css' rel='stylesheet'>

    <div id="cattalk-external-chat-content" class="cattalk-external-chat-unshow">
        <iframe class="cattalk-external-chat"
            src="${window.location.href}externalchat?name=${dataStateConnection.name}&token=${dataStateConnection?.data?.token}&textTitle=Chat"
            frameborder="0">
        </iframe>
    </div>
    <script src="${window.location.href}externalChatFiles/script.js"></script>
</div>`;

        // Copia o código para a área de transferência
        navigator.clipboard.writeText(code)
            .then(function () {
                toast.success('Copiado para a área de transferência.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })
            .catch(function (error) {
                // Exibe uma mensagem de erro, se ocorrer algum problema
                console.error('Erro ao copiar o código:', error);
            });
    }

    function moreConfigs(dataConnection, callback) {
        const { appFrom, data } = dataConnection
        var styleMore = { display: 'flex', alignItems: 'center', width: '100%' }
        if (appFrom === 'facebook' || appFrom === 'instagram') {
            return (
                <div className="config-option">
                    <div className="title">Cole aqui seus dados da Meta</div>
                    <InputText value={data?.metaToken} placeholder={'Cole aqui o seu token'} onChange={(value) => {
                        var dataConnectionCopy = { ...dataConnection }
                        dataConnectionCopy['data']['metaToken'] = value
                        callback(dataConnectionCopy)
                    }} />
                    <InputText value={data?.metaId} placeholder={'Cole aqui o ID da sua página/conta'} onChange={(value) => {
                        var dataConnectionCopy = { ...dataConnection }
                        dataConnectionCopy['data']['metaId'] = value
                        callback(dataConnectionCopy)
                    }} />
                    <div className="title">Informações de Webhook</div>
                    <div style={styleMore}>
                        <OutputCopyText value={data?.token} />
                        <IconButton onClick={() => {
                            navigator.clipboard.writeText(data?.token)
                            toast.success('Token copiado para a área de transferência.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}><i className='bx bx-copy-alt'></i></IconButton>
                    </div>
                    <div style={styleMore}>
                        <OutputCopyText value={`${backUrl}/connection/metaWebhook?token=${data?.token}`} />

                        <IconButton onClick={() => {
                            navigator.clipboard.writeText(`${backUrl}/connection/metaWebhook?token=${data?.token}`)
                            toast.success('Url copiada para a área de transferência.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}><i className='bx bx-copy-alt'></i></IconButton>
                    </div>

                </div>
            )
        } else if (appFrom === 'whatsapp_business_account') {
            return (
                <div className="config-option">
                    <div className="title">Cole aqui seus dados da Meta</div>
                    <InputText value={data?.metaToken} placeholder={'Cole aqui o seu token'} onChange={(value) => {
                        var dataConnectionCopy = { ...dataConnection }
                        dataConnectionCopy['data']['metaToken'] = value
                        callback(dataConnectionCopy)
                    }} />
                    <InputText value={data?.metaId} placeholder={'Cole aqui o ID do do número de telefone'} onChange={(value) => {
                        var dataConnectionCopy = { ...dataConnection }
                        dataConnectionCopy['data']['metaId'] = value
                        callback(dataConnectionCopy)
                    }} />
                    <InputText value={data?.identification} placeholder={'Cole aqui o ID da conta do WhatsApp Business'} onChange={(value) => {
                        var dataConnectionCopy = { ...dataConnection }
                        dataConnectionCopy['data']['identification'] = value
                        callback(dataConnectionCopy)
                    }} />
                    <div className="title">Informações de Webhook</div>
                    <div style={styleMore}>
                        <OutputCopyText value={data?.token} />
                        <IconButton onClick={() => {
                            navigator.clipboard.writeText(data?.token)
                            toast.success('Token copiado para a área de transferência.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}><i className='bx bx-copy-alt'></i></IconButton>
                    </div>
                    <div style={styleMore}>
                        <OutputCopyText value={`${backUrl}/connection/metaWebhook?token=${data?.token}`} />

                        <IconButton onClick={() => {
                            navigator.clipboard.writeText(`${backUrl}/connection/metaWebhook?token=${data?.token}`)
                            toast.success('Url copiada para a área de transferência.', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });
                        }}><i className='bx bx-copy-alt'></i></IconButton>
                    </div>

                </div>
            )
        } else {
            return null
        }
    }

    function buttonPrincipal(dataConnection) {
        if (dataConnection && dataConnection?.status === true) {
            return <PrimaryButtonGenerics onClick={() => {
                setDialogDisconnectState(true)
            }}>Desconectar</PrimaryButtonGenerics>
        }
        if (dataConnection && dataConnection?.status === 'qrcode') {
            return <PrimaryButtonGenerics onClick={() => {
                setDialogQrcodeState(true)
            }}>Ler QrCode</PrimaryButtonGenerics>

        } if (dataConnection && !dataConnection?.status) {
            return <PrimaryButtonGenerics onClick={() => {
                connect(dataStateConnection)
            }}>Conectar</PrimaryButtonGenerics>
        }
    }

    if (!mode || mode !== 'button' && dataStateConnection) {
        return (
            <div className="connections-option-container">
                <ToastContainer />
                <div className="close" style={{ display: 'flex', alignItems: 'center' }} >
                    <IconButton onClick={() => {
                        setDialogCloseState(true)
                    }}>
                        <i className='bx bx-trash' />
                    </IconButton>


                </div>
                <div className="button-edit" style={{ display: 'flex', alignItems: 'center' }} >
                    <IconButton onClick={() => {
                        setDialogConfigState(true)
                    }}>
                        <i className='bx bxs-cog'></i>
                    </IconButton>


                </div>
                {dataStateConnection?.status && dataStateConnection?.appFrom === 'site' ?

                    <div className="button-sync" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', width: '4rem', height: '2rem' }} >
                        <IconButton size='small' onClick={() => { copyCode() }}>
                            <i className='bx bx-code-alt' ></i>
                        </IconButton>
                        <IconButton size='small' onClick={() => { copyLink() }}>
                            <i className='bx bx-link'></i>
                        </IconButton>
                    </div> : null

                }
                <DialogBox
                    open={dialogCloseState}
                    onClose={() => { setDialogCloseState(false) }}
                    text='Você deseja mesmo excluir essa conexão? A exclusão fará com que você não receba mais as mensagens da mesma.'
                    buttonOneText='Excluir'
                    onButtonOne={() => {
                        var connections = JSON.parse(JSON.stringify(connectionsList))
                        connections = connections.filter((connection) => {
                            return connection?.id !== dataStateConnection?.id
                        })
                        setConnectionsList(connections)
                        ApiBack.delete(`connection/deleteConnection?id=${dataStateConnection?.id}`).then((response) => {
                            setConnectionsList(response.data)
                        })
                        // update({ action: 'delete', connection: dataStateConnection })
                        setDialogCloseState(false)
                    }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setDialogCloseState(false) }}

                />

                <DialogBoxChildren
                    open={dialogConfigState}
                    onClose={() => { setDialogConfigState(false) }}
                >
                    <div className="connections-config-container">
                        <div className="close-button">
                            <IconButton onClick={() => { setDialogConfigState(false) }}><i className='bx bx-x'></i></IconButton>
                        </div>
                        <h2 className="title">{dataStateConnection?.name}</h2>
                        <div className="config-option">
                            <h1 className="title">Tipo de Assistente</h1>
                            {dialogConfigState ? <TypeAssistant connection={dataStateConnection} onChange={(connection) => {
                                console.log('connection', connection);
                                setDataStateConnection(old => ({ ...old, ...connection }))
                                // 
                            }} /> : null}
                        </div>
                        {moreConfigs(data, (result) => {
                            setDataStateConnection(JSON.parse(JSON.stringify(result)))
                        })}
                    </div>

                    <PrimaryButtonGenerics onClick={() => {
                        if (dataStateConnection) {
                            ApiBack.put(`connection/updateConnection?id=${dataStateConnection.id}`, dataStateConnection).then(() => {
                                // setConnectionsList(response.data)
                            })
                            update({ action: 'update', connection: dataStateConnection })
                            setDialogConfigState(false)
                        }
                    }}>Salvar</PrimaryButtonGenerics>
                </DialogBoxChildren>

                <DialogBox
                    open={dialogDisconnectState}
                    onClose={() => { setDialogDisconnectState(false) }}
                    text='Você deseja mesmo desconectar? Isso fará com que você não receba mais as mensagens desta conexão.'
                    buttonOneText='Desconectar'
                    onButtonOne={() => {
                        disconnect(dataStateConnection)
                        setDialogDisconnectState(false)
                    }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setDialogDisconnectState(false) }}

                />
                <DialogBoxChildren open={dialogQrcodeState} onClose={() => {
                    setDialogQrcodeState(false);
                }}>
                    {dialogQrcodeState ?
                        <QRcode
                            connection={dataStateConnection}
                            onClose={() => {
                                setDialogQrcodeState(false)
                            }}
                        /> : null}
                </DialogBoxChildren>
                <div className="header">
                    <div className="icon" style={dataStateConnection?.status ? { color: 'var(--tree-color)' } : { color: 'var(--five-color)' }}>
                        <i className={configureIconClass(data?.appFrom)}></i>{data?.appFrom === 'whatsapp_business_account' ? <span style={{
                            fontSize: '15pt',
                            position: 'absolute',
                            bottom: '1.46rem',
                            left: '.6rem',
                            color: dataStateConnection?.status ? 'var(--tree-color)' : 'var(--two-color)',
                            backgroundColor: 'var(--five-color)',
                            width: '1.3rem',
                            height: '1.3rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                            fontWeight: '700'
                        }}>B</span> : ''}</div>
                </div>
                <Bar />
                <div className="body">
                    <div className="name" > {dataStateConnection?.name} </div>
                    <div className="info" > {typeAssistant(dataStateConnection?.typeAssistant)} </div>
                </div>
                <div className="footer">
                    {buttonPrincipal(dataStateConnection)}
                </div>
            </div >
        )
    }
    if (mode === 'button') {
        return (
            <div className="connections-option-container" style={{ cursor: 'pointer' }} onClick={onClick}>
                <div className="icon-button-mode">{children}</div>
            </div>
        )
    }
}
