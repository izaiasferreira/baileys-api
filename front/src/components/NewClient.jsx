import './NewClient.css';
import React, { useContext, useEffect } from 'react'
import PrimaryButton from './PrimaryButton';
import { ApiBack } from '../service/axios';
import { AppContext } from '../contexts/userData';
import SecoundaryButton from './SecoundaryButton';
import { useState } from 'react';
import InputText from './InputText';
import InputRounded from './InputRounded';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from './InputSelect';
import { Ring } from '@uiball/loaders';
import InputRoundedOption from './InputRoundedOption';
import BookmarkForList from './BookmarkForList';
import Bar from './Bar';
import Space from './Space';
import IconButton from './IconButton';
import MessageComponent from './MessageComponent';
import DialogBoxChildren from './DialogBoxChildren';
import MessageComponentTemplate from './MessageComponentTemplates';
export default function NewClient({ onClose }) {
    const { setModal, setModalContent, setModalTitle, sectorsList, usersList, bookmarks, assistants, setAssistants } = useContext(AppContext)
    const [numberClient, setNumberClient] = useState(null)
    const [connections, setConnections] = useState(null)
    const [newClientInfo, setNewClientInfo] = useState({
        botstatus: false,
        botResponsible: null,
        statusAttendance: false,
        sector: null,
        userName: '',
        connection: null,

    })
    const [tempatesWhatsappBusiness, setTempatesWhatsappBusiness] = useState(null)
    const [presets, setPresets] = useState(null)
    const [dialogNewPreset, setDialogNewPreset] = useState(false)
    useEffect(() => {
        async function fetchData() {
            var response = await ApiBack.get('connection/getAllConnections')
            if (response?.data?.length > 0) {
                var filter = response.data.filter((connection) => {
                    if (connection.status && (connection.appFrom === 'whatsapp' || connection.appFrom === 'whatsapp_business_account')) {
                        return connection
                    }
                })
                setConnections(filter)
            }
            var responsePresets = await ApiBack.get('connection/templatesMeta')
            // console.log(responsePresets.data);
            setTempatesWhatsappBusiness(responsePresets.data)
            var responsePresets = await ApiBack.get('assistant/all')
            setAssistants(responsePresets.data)
            var responsePresets = await ApiBack.get('clients/newClientPresets')
            setPresets(responsePresets.data)
            // if (responsePresets.data?.length > 0) {
            //     setNewClientInfo(responsePresets.data[0])
            // }
        }
        fetchData()
        return () => {
            setNewClientInfo(null)
            setNumberClient(null)
            setConnections(null)

        }
    }, [])
    // useEffect(() => {
    //     console.log(newClientInfo);
    // }, [newClientInfo])
    function generateDdiCode() {
        var elements = []
        for (let index = 1; index < 999; index++) {
            if (index === 55) {
                elements.push({ name: `+${index}`, value: index, selected: true })
            } else {
                elements.push({ name: `+${index}`, value: index })
            }

        }
        return elements
    }
    async function addClient() {
        if (newClientInfo?.userName && numberClient && newClientInfo?.connection) {

            try {
                await ApiBack.post('clients', newClientInfo)
                if (onClose) onClose();
            } catch (error) {
                // console.log();
                toast.error(error?.response?.data?.message || 'Ocorreu um erro ao cadastrar o cliente.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
            }

        } else {
            toast.error('Verifique se você preencheu ao menos o nome, número e conexão desejada.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        }

    }
    async function savePreset() {
        if (newClientInfo?.presetName) {
            ApiBack.post('clients/newClientPresets', newClientInfo).then((response) => {
                setPresets(response.data)
                setDialogNewPreset(false);
            })
        }
    }
    async function editPreset() {
        if (newClientInfo?._id) {
            ApiBack.put(`clients/newClientPreset?id=${newClientInfo?._id}`, newClientInfo).then((response) => {
                setPresets(response.data)
                setDialogNewPreset(false);
            })
        }
    }
    async function deletePreset(preset) {
        if (preset?._id) {
            ApiBack.delete(`clients/newClientPreset?id=${preset?._id}`).then((response) => {
                setPresets(response.data)
            })
        }
    }
    function phoneMask(value, id) {
        var returnValue = value.replace(/\D/g, "");
        returnValue = returnValue.replace(/^0/, "");
        if (returnValue.length > 10) {
            returnValue = returnValue.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (returnValue.length > 5) {
            if (returnValue?.length === 6 /*&&  event?.code === "Backspace" */) {
                // necessário pois senão o "-" fica sempre voltando ao dar backspace
                return;
            }
            returnValue = returnValue.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (returnValue.length > 2) {
            returnValue = returnValue.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
        } else {
            if (returnValue.length !== 0) {
                returnValue = returnValue.replace(/^(\d*)/, "($1");
            }
        }
        if (id) document.getElementById(id).attributes[0].ownerElement['value'] = returnValue;
        return returnValue;
    }

    function formatTemplate(template) {
        var headerPrev = template?.components?.find(component => component.type === 'HEADER')
        var bodyPrev = template?.components?.find(component => component.type === 'BODY')
        var buttonsPrev = template?.components?.find(component => component.type === 'BUTTONS')?.buttons
        var header = null
        var body = null
        var buttons = null
        var bodyText = null
        var headerText = null
        // console.log(headerPrev, 'headerPrev');
        // console.log(bodyPrev, 'bodyPrev');
        // console.log(buttonsPrev, 'buttonsPrev');
        // console.log('===========================');

        if (headerPrev) {
            var type = headerPrev?.format?.toLowerCase()
            if (type !== 'text') {
                header = {
                    type: "header",
                    parameters: [{
                        type: type,
                        [type]: { link: '' }
                    }]
                }

            }
            if (type === 'text') {
                if (headerPrev?.example) {
                    header = {
                        type: "header",
                        parameters: headerPrev?.example?.header_text.map(() => { return { type: 'text', text: null } })
                    }
                }

                headerText = headerPrev?.text
            }
        }
        if (bodyPrev) {
            if (bodyPrev?.example) {
                body = {
                    type: "body",
                    parameters: bodyPrev?.example?.body_text[0].map(() => { return { type: 'text', text: null } })
                }
            }

            bodyText = template?.components?.find(component => component.type === 'BODY')?.text
        }
        if (buttonsPrev) {
            var buttonsPrevMap = buttonsPrev?.map((button, index) => {
                button['index'] = index
                return button
            })
            buttonsPrev = buttonsPrevMap?.filter(button => button.type === 'COPY_CODE')
            buttons = buttonsPrev?.map((button, index) => {
                // console.log('button', button);
                return {
                    type: "button",
                    sub_type: button.type.toLowerCase(),
                    index: button?.index,
                    parameters: [
                        {
                            type: "payload",
                            payload: null
                        }
                    ]
                }
            })
            // console.log(buttons, 'buttonsPrevMap');
        }
        // console.log('header', header);
        // console.log('body', body);
        // console.log('buttons', buttons);
        // console.log('===========================');
        var result = {
            name: template.name,
            id: template.id,
            language: template.language,
            header: header,
            headerText: headerText,
            body: body,
            bodyText: bodyText,
            buttons: buttons
        }
        // console.log(result, 'result');
        return result
    }
    if (!connections || connections.length === 0) {
        return (
            <div className="new-client-content-alternative" style={{ maxWidth: '25rem' }}>
                <span className='text-title'>
                    <span className='title'>Só é possível adicionar clientes se você possuir ao menos uma conexão criada e conectada ao WhatsApp.</span>
                    <span className='text'>Feche esta janela e clique em <strong>Conexões</strong> para criar uma nova.</span>
                </span>
            </div>
        )
    }
    else if (connections) {
        return (
            <div className="new-client-container">
                <ToastContainer />
                <div className="new-client-content">
                    <div className="new-client-content-left">
                        <div className="new-client-section-collum">
                            <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <InputText value={newClientInfo?.userName} id="nameClient" placeholder='Nome do Cliente' onChange={(value) => {
                                    var newClientInfoCopy = { ...newClientInfo, userName: value }
                                    setNewClientInfo(newClientInfoCopy)
                                }} />
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <InputSelect id='ddiValue' data={generateDdiCode()} defaultValue='+55' placeholder='País' />
                                <InputText value={numberClient} id="numberClient" placeholder='Número do Whatsapp' onChange={(value) => {
                                    setNumberClient(phoneMask(value, "numberClient"))
                                    var ddi = document.getElementById('ddiValue').value
                                    var id = phoneMask(value)?.replace(/\D/g, '')?.replace(/\s/g, '')
                                    if (id && id.length > 10) id = ddi + id.slice(0, 2) + id.slice(3, 11)
                                    if (id && id.length <= 10) id = ddi + id
                                    // if (newClientInfo?.appFrom === 'whatsapp') id = `${id}@s.whatsapp.net`
                                    var newClientInfoCopy = { ...newClientInfo, id: id }
                                    setNewClientInfo(newClientInfoCopy)
                                }} />

                            </span>
                        </div>
                        <div className="new-client-section-collum">
                            <div className="title">Escolha a conexão</div>
                            <InputRounded row={true} minWidth='100%'>
                                {connections?.map((connection) => {
                                    return <InputRoundedOptionChildren
                                        checked={newClientInfo?.connection?.id === connection?.id}
                                        balls={true}
                                        id={connection.id}
                                        key={connection.id}
                                        value={connection}
                                        name='connection'
                                        onChange={(value) => {
                                            var newClientInfoCopy = { ...newClientInfo, connection: { id: value.id, name: value.name }, appFrom: value.appFrom }

                                            if (newClientInfoCopy?.appFrom === 'whatsapp') newClientInfoCopy = { ...newClientInfoCopy, template: null }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>
                                        <ButtonSelect
                                            colorIcon={connection.appFrom === 'whatsapp_business_account' ? 'var(--success-color)' : null}
                                            classIcon='bx bxl-whatsapp'
                                            text={connection.name}
                                        />
                                    </InputRoundedOptionChildren>
                                })}
                            </InputRounded>
                            <div className="discription">Só serão listadas as conexões ativas.</div>
                        </div>
                        {tempatesWhatsappBusiness && tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)] && !tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.error && (
                            <div className="new-client-section-collum" style={{ backgroundColor: 'var(--six-color)', margin: '.5rem', borderRadius: '.5rem' }}>
                                <div className="title">Escolha um modelo</div>
                                <InputRounded row={true} minWidth='100%'>
                                    {tempatesWhatsappBusiness && !tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.error ? tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.data?.map((data) => {
                                        return data.status === "APPROVED" ? (
                                            <InputRoundedOptionChildren
                                                checked={newClientInfo?.template?.id === data?.id}
                                                balls={true}
                                                id={data.id}
                                                key={data.id}
                                                value={data}
                                                name='NEW-templatesWAB'
                                                onChange={(value) => {
                                                    var result = formatTemplate(value);
                                                    var newClientInfoCopy = { ...newClientInfo, template: result };
                                                    setNewClientInfo(newClientInfoCopy);
                                                }}
                                            >
                                                <ModelWABusiness
                                                    data={data}
                                                />
                                            </InputRoundedOptionChildren>
                                        ) : null;
                                    }) : null}
                                </InputRounded>
                                {newClientInfo?.template && (
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '17rem' }}>
                                            {<MessageComponentTemplate
                                                body={newClientInfo?.template?.body}
                                                bodyText={newClientInfo?.template?.bodyText}
                                                header={newClientInfo?.template?.header}
                                                headerText={newClientInfo?.template?.headerText} />}
                                        </div>
                                        <div key='is-d0fs-0'>
                                            {newClientInfo?.template?.header?.parameters?.map((data, index) => {
                                                if (['image', 'video', 'document'].includes(data?.type)) {
                                                    return (
                                                        <InputText
                                                            value={data[data?.type]['link']}
                                                            placeholder={`Url do arquivo de cabeçalho`}
                                                            onChange={(value) => {
                                                                var newClientInfoCopy = { ...newClientInfo };
                                                                newClientInfoCopy.template.header.parameters[0][newClientInfoCopy.template.header.parameters[0].type].link = value;
                                                                setNewClientInfo(newClientInfoCopy);
                                                            }}
                                                        />
                                                    );
                                                } else {
                                                    return (
                                                        <InputText
                                                            value={data?.text}
                                                            placeholder={`Variável do cabeçalho {{${index + 1}}}`}
                                                            onChange={(value) => {
                                                                var newClientInfoCopy = { ...newClientInfo };
                                                                newClientInfoCopy.template.header.parameters[index].text = value;
                                                                setNewClientInfo(newClientInfoCopy);
                                                            }}
                                                        />
                                                    );
                                                }
                                            })}
                                            {newClientInfo?.template?.body?.parameters?.map((text, index) => {
                                                return (
                                                    <InputText
                                                        value={text?.text}
                                                        placeholder={`Variável do corpo {{${index + 1}}}`}
                                                        onChange={(value) => {
                                                            var newClientInfoCopy = { ...newClientInfo };
                                                            newClientInfoCopy.template.body.parameters[index].text = value;
                                                            setNewClientInfo(newClientInfoCopy);
                                                        }}
                                                    />
                                                );
                                            })}
                                            {newClientInfo?.template?.buttons?.map((button, index) => {
                                                return (
                                                    <InputText
                                                        value={button?.text}
                                                        placeholder={`Valor do botão`}
                                                        onChange={(value) => {
                                                            var newClientInfoCopy = { ...newClientInfo };
                                                            newClientInfoCopy.template.buttons[index].parameters[0].payload = value;
                                                            setNewClientInfo(newClientInfoCopy);
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="discription">Só são listados os modelos aprovados.</div>
                            </div>
                        )}

                        <div className="new-client-section-collum">
                            <div className="title">Assistente responsável</div>
                            <InputRounded row={true} minWidth='100%'>
                                <InputRoundedOptionChildren
                                    checked={!newClientInfo?.botstatus ? true : false}
                                    balls={true}
                                    id={'none-assistant-new-client'}
                                    key={'none-assistant-new-client'}
                                    value={null}
                                    name='assistantsTransfer'
                                    onChange={() => {
                                        var newClientInfoCopy = { ...newClientInfo, presetName: null, _id: null, botstatus: false, botResponsible: null }
                                        setNewClientInfo(newClientInfoCopy)
                                    }}>
                                    <ButtonSelect
                                        classIcon='bx bxs-bot'
                                        text='Desativado'
                                    />
                                </InputRoundedOptionChildren>
                                {assistants?.map((assistant, index) => {
                                    return <InputRoundedOptionChildren
                                        checked={newClientInfo?.botstatus && newClientInfo?.botResponsible === assistant._id ? true : false}
                                        balls={true}
                                        id={assistant.id}
                                        key={index + '-' + assistant?.id + '-assistant-new-client'}
                                        value={assistant._id}
                                        name='assistantsTransfer'
                                        onChange={(value) => {
                                            console.log(value);
                                            var newClientInfoCopy = { ...newClientInfo, presetName: null, _id: null, botstatus: true, botResponsible: value }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>
                                        <ButtonSelect

                                            classIcon='bx bxs-bot'
                                            text={assistant.name}
                                        />
                                    </InputRoundedOptionChildren>
                                })}
                            </InputRounded>
                            <InputRounded row={true}>
                                {connections?.map((connection) => {
                                    return <InputRoundedOptionChildren
                                        balls={true}
                                        id={connection.id}
                                        key={connection.id}
                                        value={connection}
                                        name='connection'
                                        onChange={(value) => {
                                            var newClientInfoCopy = { ...newClientInfo, presetName: null, _id: null, connection: value }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>

                                    </InputRoundedOptionChildren>
                                })}
                            </InputRounded>
                        </div>
                    </div>
                    <div className="new-client-content-rigth">

                        <div className="new-client-section-row">
                            <div className="title">
                                Suas Predefinições
                            </div>
                            <div className="content" style={{ overflowX: 'auto', overflowY: 'hidden', maxWidth: '37rem', }}>

                                <Presets more onClick={() => {
                                    var newClientInfoCopy = { ...newClientInfo }
                                    delete newClientInfoCopy._id
                                    delete newClientInfoCopy.name
                                    setNewClientInfo(newClientInfoCopy)
                                    setDialogNewPreset(true)
                                }} />
                                {presets?.map((preset, index) => {
                                    return <Presets
                                        checked={newClientInfo?._id === preset?._id}
                                        key={index + '-preset'}
                                        data={preset}
                                        onClick={() => {
                                            if (newClientInfo?._id === preset?._id) {
                                                var newClientInfoCopy = { ...newClientInfo }
                                                setNewClientInfo({ id: newClientInfoCopy.id, userName: newClientInfoCopy.userName })
                                            } else {
                                                var newClientInfoCopy = { ...newClientInfo }
                                                setNewClientInfo({ ...preset, id: newClientInfoCopy.id, userName: newClientInfoCopy.userName })
                                            }
                                            // setTimeout(() => {
                                            //     setNewClientInfo({ ...newClientInfo, id: newClientInfoCopy.id, userName: newClientInfoCopy.userName })
                                            //         , 500
                                            // })
                                        }}
                                        onDelete={() => {
                                            deletePreset(preset)
                                        }}
                                        onEdit={() => {
                                            setNewClientInfo(preset)
                                            setDialogNewPreset(true)
                                        }}
                                    />
                                })}
                            </div>
                            <div className="discription">
                                Escolha uma predefinição para o cliente
                            </div>
                        </div>
                        <div className="title">Mais Opções</div>
                        <div style={{ overflowY: 'auto', maxHeight: '20rem', backgroundColor: 'var(--six-color)', borderRadius: '.5rem' }}>
                            <div className="new-client-section-collum">
                                <div className="title">Setor Responsável</div>
                                <InputRounded row={true} minWidth='100%'>
                                    <InputRoundedOptionChildren
                                        checked={!newClientInfo?.sector}
                                        name='sectorsTransfer'
                                        value={null}
                                        label='Visível para todos.'
                                        onChange={() => {
                                            var newClientInfoCopy = { ...newClientInfo, presetName: null, _id: null, sector: null }
                                            setNewClientInfo(newClientInfoCopy)
                                        }} >
                                        <ButtonSelect
                                            text='Visível para Todos'
                                            classIcon="bx bx-support"
                                        />
                                    </ InputRoundedOptionChildren>
                                    {
                                        sectorsList.map((sector) => {
                                            if (sector.name !== "Default") {
                                                return <InputRoundedOptionChildren
                                                    checked={sector._id === newClientInfo?.sector}
                                                    key={sector._id + 'sector'}
                                                    name='sectorsTransfer'
                                                    value={sector._id}
                                                    onChange={(value) => {
                                                        var newClientInfoCopy = { ...newClientInfo, sector: value }
                                                        setNewClientInfo(newClientInfoCopy)
                                                    }} >
                                                    <ButtonSelect
                                                        text={sector.name}
                                                        classIcon="bx bx-support"
                                                    />
                                                </ InputRoundedOptionChildren>
                                            } else {
                                                return <InputRoundedOptionChildren
                                                    checked={sector._id === newClientInfo?.sector}
                                                    key={sector._id + 'sector'}
                                                    name='sectorsTransfer'
                                                    value={sector._id}
                                                    onChange={(value) => {
                                                        var newClientInfoCopy = { ...newClientInfo, sector: value }
                                                        setNewClientInfo(newClientInfoCopy)
                                                    }}  >
                                                    <ButtonSelect
                                                        text='Setor Padrão'
                                                        classIcon="bx bx-support"
                                                    />
                                                </ InputRoundedOptionChildren>
                                            }
                                        })
                                    }
                                </InputRounded>
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Usuário Responsável</div>
                                <InputRounded row={true} minWidth='100%'>
                                    <InputRoundedOptionChildren
                                        checked={!newClientInfo?.userInAttendance}
                                        balls={true}
                                        key={'user-new-client'}
                                        value={null}
                                        name='usersTransfer'
                                        onChange={() => {
                                            var newClientInfoCopy = { ...newClientInfo, userInAttendance: null, statusAttendance: false }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>
                                        <ButtonSelect
                                            text='Nenhum'
                                            classIcon="bx bx-user"
                                        />
                                    </InputRoundedOptionChildren>
                                    {usersList?.map((user, index) => {
                                        return <InputRoundedOptionChildren
                                            checked={user.id === newClientInfo?.userInAttendance}
                                            balls={true}
                                            id={user.id}
                                            key={index + '-' + user?.id + '-new-client'}
                                            value={user.id}
                                            name='usersTransfer'
                                            onChange={(value) => {
                                                var newClientInfoCopy = { ...newClientInfo, userInAttendance: value, statusAttendance: true }
                                                setNewClientInfo(newClientInfoCopy)
                                            }}>
                                            <ButtonSelect
                                                text={user.name}
                                                classIcon="bx bx-user"
                                            />
                                        </InputRoundedOptionChildren>
                                    })}
                                </InputRounded>
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Adicionar marcador</div>
                                {bookmarks?.map((bookmark) => {

                                    return (
                                        <BookmarkForList
                                            mode={true}
                                            key={bookmark._id + 'bookmark-assistant'}
                                            active={newClientInfo?.bookmarks?.includes(bookmark._id) ? true : false}
                                            bookmark={bookmark}
                                            onChange={(data) => {
                                                const { action, id } = data
                                                var newClientInfoCopy = JSON.parse(JSON.stringify(newClientInfo))
                                                if (!newClientInfoCopy?.bookmarks) newClientInfoCopy.bookmarks = []
                                                var indexBookmark = newClientInfoCopy?.bookmarks?.findIndex(bookmarkId => bookmarkId === id)

                                                if (action && indexBookmark === -1) {
                                                    newClientInfoCopy.bookmarks.push(id)
                                                }

                                                if (!action && indexBookmark !== -1) {
                                                    newClientInfoCopy.bookmarks = newClientInfoCopy?.bookmarks?.filter(bookmark => bookmark !== id)
                                                }
                                                setNewClientInfo(newClientInfoCopy)
                                            }
                                            } />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="new-client-bottom">
                    <SecoundaryButton onChange={() => { setModalContent(null); setModalTitle(null); setModal(false); }}>Cancelar</SecoundaryButton>
                    <PrimaryButton onChange={() => { addClient() }}>Adicionar</PrimaryButton>
                </div>
                <DialogBoxChildren open={dialogNewPreset} onClose={() => { setDialogNewPreset(false) }}>
                    <div >
                        <div style={{ height: '80vh', overflowY: 'auto' }}>
                            <div className="new-client-section-collum">
                                <InputText value={newClientInfo?.presetName} id="nameClient" placeholder='Nome do Preset' onChange={(value) => {
                                    var newClientInfoCopy = { ...newClientInfo, presetName: value }
                                    setNewClientInfo(newClientInfoCopy)
                                }} />
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Escolha a conexão</div>
                                <InputRounded row={true} minWidth='100%'>
                                    {connections?.map((connection) => {
                                        return <InputRoundedOptionChildren
                                            checked={newClientInfo?.connection?.id === connection?.id}
                                            balls={true}
                                            id={connection.id}
                                            key={connection.id}
                                            value={connection}
                                            name='new-connection'
                                            onChange={(value) => {
                                                var newClientInfoCopy = { ...newClientInfo, connection: { id: value.id, name: value.name }, appFrom: value.appFrom }
                                                if (newClientInfoCopy?.appFrom === 'whatsapp') newClientInfoCopy = { ...newClientInfoCopy, template: null }

                                                setNewClientInfo(newClientInfoCopy)
                                            }}>
                                            <ButtonSelect
                                                colorIcon={connection.appFrom === 'whatsapp_business_account' ? 'var(--success-color)' : null}
                                                classIcon='bx bxl-whatsapp'
                                                text={connection.name}
                                            />
                                        </InputRoundedOptionChildren>
                                    })}
                                </InputRounded>
                                <div className="discription">Só serão listadas as conexões ativas.</div>
                            </div>
                            {/*Novo*/}
                            {tempatesWhatsappBusiness && tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)] && !tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.error && (
                                <div className="new-client-section-collum" style={{ backgroundColor: 'var(--six-color)', margin: '.5rem', borderRadius: '.5rem' }}>
                                    <div className="title">Escolha um modelo</div>
                                    <InputRounded row={true} minWidth='100%'>
                                        {tempatesWhatsappBusiness && !tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.error ? tempatesWhatsappBusiness[tempatesWhatsappBusiness?.findIndex(connection => connection?.connection?.id === newClientInfo?.connection?.id)]?.data?.map((data) => {
                                            return data.status === "APPROVED" ? (
                                                <InputRoundedOptionChildren
                                                    checked={newClientInfo?.template?.id === data?.id}
                                                    balls={true}
                                                    id={data.id}
                                                    key={data.id}
                                                    value={data}
                                                    name='NEW-templatesWAB'
                                                    onChange={(value) => {
                                                        var result = formatTemplate(value);
                                                        var newClientInfoCopy = { ...newClientInfo, template: result };
                                                        setNewClientInfo(newClientInfoCopy);
                                                    }}
                                                >
                                                    <ModelWABusiness
                                                        data={data}
                                                    />
                                                </InputRoundedOptionChildren>
                                            ) : null;
                                        }) : null}
                                    </InputRounded>
                                    {newClientInfo?.template && (
                                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <div key='oipoi' style={{ width: '17rem' }}>
                                                {<MessageComponentTemplate
                                                    body={newClientInfo?.template?.body}
                                                    bodyText={newClientInfo?.template?.bodyText}
                                                    header={newClientInfo?.template?.header}
                                                    headerText={newClientInfo?.template?.headerText} />}
                                            </div>
                                            <div key='is-d0fs-0'>
                                                {newClientInfo?.template?.header?.parameters?.map((data, index) => {
                                                    if (['image', 'video', 'document'].includes(data?.type)) {
                                                        return (
                                                            <InputText
                                                                value={data[data?.type]['link']}
                                                                placeholder={`Url do arquivo de cabeçalho`}
                                                                onChange={(value) => {
                                                                    var newClientInfoCopy = { ...newClientInfo };
                                                                    newClientInfoCopy.template.header.parameters[0][newClientInfoCopy.template.header.parameters[0].type].link = value;
                                                                    setNewClientInfo(newClientInfoCopy);
                                                                }}
                                                            />
                                                        );
                                                    } else {
                                                        return (
                                                            <InputText
                                                                value={data?.text}
                                                                placeholder={`Variável do cabeçalho {{${index + 1}}}`}
                                                                onChange={(value) => {
                                                                    var newClientInfoCopy = { ...newClientInfo };
                                                                    newClientInfoCopy.template.header.parameters[index].text = value;
                                                                    setNewClientInfo(newClientInfoCopy);
                                                                }}
                                                            />
                                                        );
                                                    }
                                                })}
                                                {newClientInfo?.template?.body?.parameters?.map((text, index) => {
                                                    return (
                                                        <InputText
                                                            value={text?.text}
                                                            placeholder={`Variável do corpo {{${index + 1}}}`}
                                                            onChange={(value) => {
                                                                var newClientInfoCopy = { ...newClientInfo };
                                                                newClientInfoCopy.template.body.parameters[index].text = value;
                                                                setNewClientInfo(newClientInfoCopy);
                                                            }}
                                                        />
                                                    );
                                                })}
                                                {newClientInfo?.template?.buttons?.map((button, index) => {
                                                    return (
                                                        <InputText
                                                            value={button?.text}
                                                            placeholder={`Valor do botão`}
                                                            onChange={(value) => {
                                                                var newClientInfoCopy = { ...newClientInfo };
                                                                newClientInfoCopy.template.buttons[index].parameters[0].payload = value;
                                                                setNewClientInfo(newClientInfoCopy);
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    <div className="discription">Só são listados os modelos aprovados.</div>
                                </div>
                            )}

                            <div className="new-client-section-collum">
                                <div className="title">Assistente responsável</div>
                                <InputRounded row={true} minWidth='100%'>
                                    <InputRoundedOptionChildren
                                        checked={!newClientInfo?.botstatus}
                                        balls={true}
                                        id={'none-assistant-new-client'}
                                        key={'none-assistant-new-client'}
                                        value={null}
                                        name='new-assistantsTransfer'
                                        onChange={() => {
                                            var newClientInfoCopy = { ...newClientInfo, botstatus: false, botResponsible: null }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>
                                        <ButtonSelect
                                            classIcon='bx bxs-bot'
                                            text='Desativado'
                                        />
                                    </InputRoundedOptionChildren>
                                    {assistants?.map((assistant, index) => {
                                        return <InputRoundedOptionChildren
                                            checked={newClientInfo?.botstatus && newClientInfo?.botResponsible === assistant._id ? true : false}
                                            balls={true}
                                            id={assistant.id}
                                            key={index + '-' + assistant?.id + '-assistant-new-client'}
                                            value={assistant._id}
                                            name='new-assistantsTransfer'
                                            onChange={(value) => {
                                                var newClientInfoCopy = { ...newClientInfo, botstatus: true, botResponsible: value }
                                                setNewClientInfo(newClientInfoCopy)
                                            }}>
                                            <ButtonSelect
                                                classIcon='bx bxs-bot'
                                                text={assistant.name}
                                            />
                                        </InputRoundedOptionChildren>
                                    })}
                                </InputRounded>
                                <InputRounded row={true}>
                                    {connections?.map((connection) => {
                                        return <InputRoundedOptionChildren
                                            balls={true}
                                            id={connection.id}
                                            key={connection.id}
                                            value={connection}
                                            name='connection'
                                            onChange={(value) => {
                                                var newClientInfoCopy = { ...newClientInfo, connection: value }
                                                setNewClientInfo(newClientInfoCopy)
                                            }}>

                                        </InputRoundedOptionChildren>
                                    })}
                                </InputRounded>
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Setor Responsável</div>
                                <InputRounded row={true} minWidth='100%'>
                                    <InputRoundedOptionChildren
                                        checked={!newClientInfo?.sector}
                                        name='new-sectorsTransfer'
                                        value={null}
                                        label='Visível para todos.'
                                        onChange={() => {
                                            var newClientInfoCopy = { ...newClientInfo, sector: null }
                                            setNewClientInfo(newClientInfoCopy)
                                        }} >
                                        <ButtonSelect
                                            text='Visível para Todos'
                                            classIcon="bx bx-support"
                                        />
                                    </ InputRoundedOptionChildren>
                                    {
                                        sectorsList.map((sector) => {
                                            if (sector.name !== "Default") {
                                                return <InputRoundedOptionChildren
                                                    checked={sector._id === newClientInfo?.sector}
                                                    key={sector._id + 'sector'}
                                                    name='new-sectorsTransfer'
                                                    value={sector._id}
                                                    onChange={(value) => {
                                                        var newClientInfoCopy = { ...newClientInfo, sector: value }
                                                        setNewClientInfo(newClientInfoCopy)
                                                    }} >
                                                    <ButtonSelect
                                                        text={sector.name}
                                                        classIcon="bx bx-support"
                                                    />
                                                </ InputRoundedOptionChildren>
                                            } else {
                                                return <InputRoundedOptionChildren
                                                    checked={sector._id === newClientInfo?.sector}
                                                    key={sector._id + 'sector'}
                                                    name='new-sectorsTransfer'
                                                    value={sector._id}
                                                    onChange={(value) => {
                                                        var newClientInfoCopy = { ...newClientInfo, sector: value }
                                                        setNewClientInfo(newClientInfoCopy)
                                                    }}  >
                                                    <ButtonSelect
                                                        text='Setor Padrão'
                                                        classIcon="bx bx-support"
                                                    />
                                                </ InputRoundedOptionChildren>
                                            }
                                        })
                                    }
                                </InputRounded>
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Usuário Responsável</div>
                                <InputRounded row={true} minWidth='100%'>
                                    <InputRoundedOptionChildren
                                        checked={!newClientInfo?.userInAttendance}
                                        balls={true}
                                        key={'user-new-client'}
                                        value={null}
                                        name='new-usersTransfer'
                                        onChange={() => {
                                            var newClientInfoCopy = { ...newClientInfo, userInAttendance: null, statusAttendance: false }
                                            setNewClientInfo(newClientInfoCopy)
                                        }}>
                                        <ButtonSelect
                                            text='Nenhum'
                                            classIcon="bx bx-user"
                                        />
                                    </InputRoundedOptionChildren>
                                    {usersList?.map((user, index) => {
                                        return <InputRoundedOptionChildren
                                            checked={user.id === newClientInfo?.userInAttendance}
                                            balls={true}
                                            id={user.id}
                                            key={index + '-' + user?.id + '-new-client'}
                                            value={user.id}
                                            name='new-usersTransfer'
                                            onChange={(value) => {
                                                var newClientInfoCopy = { ...newClientInfo, userInAttendance: value, statusAttendance: true }
                                                setNewClientInfo(newClientInfoCopy)
                                            }}>
                                            <ButtonSelect
                                                text={user.name}
                                                classIcon="bx bx-user"
                                            />
                                        </InputRoundedOptionChildren>
                                    })}
                                </InputRounded>
                            </div>
                            <div className="new-client-section-collum">
                                <div className="title">Adicionar marcador</div>
                                {bookmarks?.map((bookmark) => {

                                    return (
                                        <BookmarkForList
                                            mode={true}
                                            key={bookmark._id + 'bookmark-assistant'}
                                            active={newClientInfo?.bookmarks?.includes(bookmark._id) ? true : false}
                                            bookmark={bookmark}
                                            onChange={(data) => {
                                                const { action, id } = data
                                                var newClientInfoCopy = JSON.parse(JSON.stringify(newClientInfo))
                                                if (!newClientInfoCopy?.bookmarks) newClientInfoCopy.bookmarks = []
                                                var indexBookmark = newClientInfoCopy?.bookmarks?.findIndex(bookmarkId => bookmarkId === id)

                                                if (action && indexBookmark === -1) {
                                                    newClientInfoCopy.bookmarks.push(id)
                                                }

                                                if (!action && indexBookmark !== -1) {
                                                    newClientInfoCopy.bookmarks = newClientInfoCopy?.bookmarks?.filter(bookmark => bookmark !== id)
                                                }
                                                setNewClientInfo(newClientInfoCopy)
                                            }
                                            } />
                                    )
                                })}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <SecoundaryButton onChange={() => { setDialogNewPreset(false); }}>Cancelar</SecoundaryButton>
                            <PrimaryButton onChange={() => {
                                if (newClientInfo?._id) {
                                    editPreset()
                                } else {
                                    savePreset()
                                }
                            }}>{newClientInfo?._id ? 'Salvar' : 'Criar Preset'}</PrimaryButton>
                        </div>
                    </div>

                </DialogBoxChildren >
            </div >
        )
    }
}
function ButtonSelect({ classIcon, text, colorIcon }) {
    return (
        <div style={
            {
                minWidth: '8rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                padding: '.1rem .5rem .1rem .5rem'

            }
        }>
            <i style={{
                fontSize: '15pt',
                marginRight: '.5rem',
                color: colorIcon || 'var(--tree-color)'
            }} className={classIcon}></i>{text}</div>
    )
}

function Presets({ data, more, onClick, onDelete, onEdit, checked }) {
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
    if (more) {
        return (
            <div onClick={onClick} style={{
                width: '10rem',
                height: '4.3rem',
                padding: '.3rem 1rem',
                borderRadius: '.5rem',
                backgroundColor: 'var(--two-color)',
                color: 'var(--text-color-one)',
                margin: '.3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
            }}>
                <i className="bx bx-plus" style={{
                    fontSize: '25pt',
                    fontWeight: '800',
                    position: 'absolute',
                }}></i>
            </div>
        )
    } else {
        return (
            <div style={{
                width: '10rem',
                height: '5rem',
                borderRadius: '.5rem',
                backgroundColor: configuretheme(data?.appFrom).color,
                color: 'var(--text-color-two)',
                margin: '.3rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',

            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}>

                    <div onClick={onClick} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '.5rem',
                        fontSize: '20pt',

                    }}>{checked ?
                        <i style={{
                            fontSize: '25pt',
                            fontWeight: '900',
                            position: 'absolute',
                            opacity: '.5',
                            top: 0,
                            left: 0
                        }}
                            className="bx bx-check"></i> : null
                        }</div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        zIndex: 5
                    }}>
                        {/* <IconButton onClick={onEdit} size='small'>
                            <i className="bx bxs-cog"></i>
                        </IconButton> */}
                        <IconButton onClick={onDelete} size='small'>
                            <i className="bx bx-trash"></i>
                        </IconButton>
                    </div>
                    <div onClick={onClick} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '10rem',
                        height: '3.5rem',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        // backgroundColor: 'var(--two-color)',
                        cursor: 'pointer',

                    }} />

                </div>
                <div onClick={onClick} style={{
                    fontSize: '12pt',
                    fontWeight: '500',
                    fontFamily: 'Poppins',
                    cursor: 'pointer',
                    marginLeft: '1rem',
                }}>{data?.presetName?.length > 13 ? data?.presetName?.substring(0, 13) + '...' : data?.presetName}</div>
                {/* <div onClick={() => {
                    navigator.clipboard.writeText(data?._id)
                        .then(function () {
                            toast.success('ID copiado para a área de transferência.', {
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
                }} style={{
                    fontSize: '8pt',
                    fontWeight: '300',
                    marginLeft: '1rem',
                    marginBottom: '.5rem',
                    cursor: 'copy'
                }}>{data?._id}</div> */}
            </div>
        )
    }

}
function ModelWABusiness({ data }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--two-color)',
            padding: '.5rem',
            borderRadius: '.5rem'
        }} >
            <span>{data.name}</span>

        </div>
    )
}