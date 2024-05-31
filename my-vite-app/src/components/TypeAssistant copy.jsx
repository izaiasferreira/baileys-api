
import './TypeAssistant.css'
import React, { useState, useContext, useEffect } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import MessageComponentExample from './MessageComponentExample'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import { AuthUser } from '../contexts/authentication'
import InputSelect from './InputSelect'
import IconButton from './IconButton'
import InputTextArea from './InputTextArea'
import EmojiComponent from './EmojiComponent'
import { Ring } from '@uiball/loaders'
import EditCustomAssistant from './EditCustomAssistant'

export default function TypeAssistant({ infos, onChange }) {
    const [info, setInfo] = useState(null)
    const [typeEdit, setTypeEdit] = useState(false)
    const { user, setPageState, setPageContent, setPageTitle, setModal, setPageCallBack } = useContext(AppContext)
    const { logout } = useContext(AuthUser)
    const [sectors, setSectors] = useState(null)
    const [welcomeMessage, setWelcomeMessage] = useState(null)
    const [anchorEmoji, setAnchorEmoji] = useState(null);
    const targetEmoji = (event) => {
        setAnchorEmoji(event)
    }
    useEffect(() => {
        async function fetchData() {
            setInfo(infos)
            var sectorsResponse = await ApiBack.get(`sectors`).catch(() => { logout() })
            setSectors(sectorsResponse.data.filter(sector => sector.name !== 'Default'))
        }
        fetchData()
        return () => { //executa essa função quando o componente é desmontado
            setSectors(null)
            setWelcomeMessage(null)
            setTypeEdit(null)
        }
    }, [logout, infos]);

    useEffect((() => {
        setInfo(infos)
        //setWelcomeMessage(formatWelcomeMessage(info?.typeAssistant?.type, info?.typeAssistant?.message, sectors))
    }), [infos])

    useEffect((() => {
        setWelcomeMessage(formatWelcomeMessage(info?.typeAssistant?.type, info?.typeAssistant?.message, sectors))
    }), [info, sectors])
    function formatWelcomeMessage(typeAssistant, messageText, sectors) {
        if (typeAssistant === 'default') {
            return (<span>{messageText}</span>)
        }

        if (typeAssistant === 'sector') {
            return (<span>
                {messageText}<br /><br />
                Por favor, informe com qual setor você deseja falar digitando o número correspondente:
                {sectors?.map((sector, index) => {
                    return (<span key={sector._id + '-sectorWelcomeMessage'}><br /> {`${index + 1} - ${sector.name}`}</span>)

                })}
                {<span><br /> {`${sectors?.length + 1} - Cancelar`}</span>}
            </span>)
        }
    }
    function editsArea(editState) {
        if (info?.typeAssistant?.type === 'custom') {
            if (user.role.includes('admin')) {
                return (
                    <div className="custom-area">
                        <PrimaryButton onChange={() => {
                            setPageContent(<EditCustomAssistant />)
                            setPageTitle('Editar Fluxo do Assistente')
                            setPageState(true)
                            setPageCallBack([() => {
                                setModal(true)
                            }])
                            setModal(false)
                        }}>Editar Fluxo do Assistente</PrimaryButton>
                    </div>
                )

            } else {
                return null
            }
        } else if (['sector', 'default'].includes(info?.typeAssistant?.type)) {
            return (
                <div>
                    {editState ?
                        <div className='edit'>
                            <div className="text-area">
                                <EmojiComponent target={anchorEmoji} onClick={async () => { await targetEmoji(document.getElementById('textAreaWelcomeMessage')) }}></EmojiComponent>
                                <InputTextArea
                                    id="textAreaWelcomeMessage"
                                    placeholder='Digite sua mensagem de boas-vindas.'
                                    value={info?.typeAssistant?.message}
                                    onChange={(value) => {
                                        var infoCopy = info
                                        infoCopy.typeAssistant.message = value
                                        setInfo(JSON.parse(JSON.stringify(infoCopy)))
                                    }}
                                />
                            </div>
                            <div className="buttons">
                                <SecoundaryButton onChange={() => {
                                    setTypeEdit(false)
                                }}>Cancelar</SecoundaryButton>
                                <PrimaryButton onChange={async () => {
                                    var data = info
                                    ApiBack.put(`informations`, data)
                                    onChange(data)
                                    setWelcomeMessage(formatWelcomeMessage(info?.typeAssistant?.type, info?.typeAssistant?.message, sectors))
                                }} > Salvar </ PrimaryButton>
                            </div>
                        </div> :
                        <div className="middle-header">
                            <h1 className='title'>Mensagem de boas-vindas</h1>
                            <div className='message'>
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
                                        text={welcomeMessage || 'Sua mensagem de boas-vindas!'}
                                        url={null}
                                        toShow={false}
                                        typeMessage='text'
                                        size={25}
                                    />
                                    {user.role.includes('admin') ?
                                        <IconButton
                                            onClick={async () => { await setTypeEdit(true) }}><i className='bx bx-edit'></i>
                                        </IconButton> : null}
                                </div>
                            </div>
                        </div>}
                </div>
            )
        }
    }
    if (info) {
        return (
            <div className='type-assistant-container'>
                <div className='edit'>
                    <div className="type-assistant-header">
                        {user.role.includes('admin') ?
                            <InputSelect
                                placeholder={'Tipo de Assistente'}
                                data={
                                    [
                                        { name: 'Padrão', value: 'default', selected: info?.typeAssistant?.type === 'default' ? true : false },
                                        { name: 'Setores', value: 'sector', selected: info?.typeAssistant?.type === 'sector' ? true : false },
                                        { name: 'Personalizado', value: 'custom', selected: info?.typeAssistant?.type === 'custom' ? true : false }
                                    ]
                                }
                                onChange={(value) => {
                                    var data = info
                                    data.typeAssistant.type = value
                                    ApiBack.put(`informations`, data).catch(() => { })
                                    setInfo(data)
                                    onChange(data)
                                    setWelcomeMessage(formatWelcomeMessage(info?.typeAssistant?.type, info?.typeAssistant?.message, sectors))
                                }}
                            /> : <span>{infos?.typeAssistant?.type === 'default' ? "Divisão padrão" : infos?.typeAssistant?.type === 'sector' ? "Divisão por setores" : 'Assistente Personalizado'}</span>}

                    </div>
                    <div className="type-assistant-middle">
                        {editsArea(typeEdit)}
                    </div>
                </div>
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
