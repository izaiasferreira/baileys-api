import './AdminDashboard.css'
import React, { useContext, useEffect, useState } from 'react';
import { AuthUser } from '../contexts/authentication';
import { ApiBack } from '../service/axios';
import Chart from 'react-apexcharts'
import InputRounded from './InputRounded';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import UserList from './UserList';
import SectorList from './SectorList';
import InputText from './InputText';
import PrimaryButton from './PrimaryButton';
import MessageComponent from './MessageComponent';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment-timezone';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import getParam from '../service/getParamUrl';
import addParam from '../service/addParamUrl';
import deleteParam from '../service/deleteParamUrl';
import { AppContext } from '../contexts/userData';
import formatDate from '../service/formatDate';
import formatHour from '../service/formatHour';

export default function AdminDashboard() {
    const [informations, setinformations] = useState(null)
    const [pageValue, setPageValue] = useState(1);
    const [surveys, setSurveys] = useState(null)
    const [protocolResult, setProtocolResult] = useState(null)
    const [protocolData, setProtocolData] = useState(null)
    const [textSeachProtocol, setTextSeachProtocol] = useState(null)
    const { logout } = useContext(AuthUser)
    const {
        sectorsList,
        usersList,
        setUsersList
    } = useContext(AppContext)
    useEffect(() => {
        async function fetchData() {
            try {
                var responseUsersList = await ApiBack.get('users/getNameAndIdAllUsers')
                setUsersList(responseUsersList?.data)
                await ApiBack.get(`informations`).then((result) => {
                    // console.log(result.data);
                    setinformations(result?.data)
                }).catch(() => { console.log('erro'); logout(); })

                await ApiBack.get(`assistant/allSurveys`).then((result) => {
                    setSurveys(result?.data)
                    // console.log(result.data);
                })
            } catch (error) {
                console.log(error);
            }


        }
        fetchData()
        handleUrlChange()
        setInterval(() => {
            fetchData()
        }, 1000 * 60 * 2);
        return () => {
            setinformations(null)
            setSurveys(null)
        }
    }, [logout]);

    function handleUrlChange() {
        var page = getParam('page')
        if (!page || page === '1') {
            addParam('page', '1')
            setPageValue(1)
        }
        if (!page || page === '2') {
            // addParam('page', '2')
            setPageValue(2)
        }
        if (page === '3') {
            setPageValue(3)
            var textSeach = getParam('textSeachProtocol')
            if (textSeach && textSeach.length > 0) {
                getProtocol(textSeach)
                setTextSeachProtocol(textSeach)
            }
        }

    }

    function textSwitch(text, state) {
        return <div style={{ padding: '.5rem', fontSize: '15pt', fontWeight: '500', color: state ? 'var(--tree-color)' : 'var(--text-color-one)' }}>
            {text}
        </div>
    }
    function getProtocol(protocol) {

        ApiBack.get(`informations/protocol?protocol=${protocol}`).then((result) => {
            setProtocolResult(result?.data)
        }).catch((error) => {
            toast.error(error?.response?.data?.message, {
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
    }
    function iconTimeline(action) {
        if (action === 'end') return <i className='bx bxs-flag-checkered' ></i>
        else if (action === 'userInAttendance') return <i className='bx bx-user'></i>
        else if (action === 'transfer') return <i className='bx bx-transfer-alt'></i>
        else if (action === 'start') return <i className='bx bx-flag' ></i>
        else if (action === 'inLine') return <i className='bx bx-list-ul'></i>
        else if (action === 'reset') return <i className='bx bx-reset'></i>
        else if (action === 'hourAtendance') return <i className='bx bx-time'></i>
        else if (action === 'inactivity') return <i className='bx bx-timer' ></i>
        else return
    }
    function textTimeline(action) {
        if (action === 'start') return 'Inicio'
        else if (action === 'transfer') return "Transf. p/ setor"
        else if (action === 'userInAttendance') return "Usuário assumiu"
        else if (action === 'reset') return "Reiniciado"
        else if (action === 'end') return "Fim"
        else if (action === 'inLine') return "Adicionado a fila"
        else if (action === 'inactivity') return "Assit. de inatividade"
        else if (action === 'hourAtendance') return "Fora do expediente"
        else return
    }
    function textTimelineMoreData(action, moreData) {
        // console.log(action);
        if (action === 'transfer') return (sectorsList?.find(sector => sector._id === moreData.from)?.name || "Nenhum") + " > " + (sectorsList?.find(sector => sector._id === moreData.to)?.name)
        else return
    }
    function textTimelineUserId(id) {
        // console.log(usersList);
        if (id === 'client') return 'Cliente'
        else if (id === 'assistant') return "Assistente"
        else return usersList?.find(user => user.id === id)?.name
    }
    function iconTimelineUsers(action) {
        if (action === 'login') return <i className='bx bx-log-in' ></i>
        else if (action === 'logout') return <i className='bx bx-log-out' ></i>
        else if (action === 'pause') return <i className='bx bx-pause-circle' ></i>
        else if (action === 'resume') return <i className='bx bx-play-circle' ></i>
        else return
    }
    function textTimelineUsers(action) {
        if (action === 'login') return 'Entrou'
        else if (action === 'logout') return "Saiu"
        else if (action === 'pause') return "Pausou"
        else if (action === 'resume') return "Retomou"
        else return
    }
    if (informations) {
        return (
            <>

                <div className="admin-dashboar-area-container">
                    <ToastContainer />
                    <Section style={{ justifyContent: 'center' }}>
                        <InputRounded row minWidth={3} >
                            <InputRoundedOptionChildren
                                checked={pageValue === 1}
                                balls={true}
                                key='1-option'
                                value={1}
                                name='connection'
                                onChange={(value) => {
                                    addParam('page', '1')
                                    setPageValue(parseInt(value))

                                }}>

                                {textSwitch('Relatórios', pageValue === 1)}
                            </InputRoundedOptionChildren>
                            <InputRoundedOptionChildren
                                checked={pageValue === 2}
                                balls={true}
                                key='2-option'
                                value={2}
                                name='connection'
                                onChange={(value) => {
                                    addParam('page', '2')
                                    setPageValue(parseInt(value))
                                }}>

                                {textSwitch('Usuários e Setores', pageValue === 2)}
                            </InputRoundedOptionChildren>
                            <InputRoundedOptionChildren
                                checked={pageValue === 3}
                                balls={true}
                                key='3-option'
                                value={3}
                                name='connection'
                                onChange={(value) => {
                                    addParam('page', '3')
                                    setPageValue(parseInt(value))
                                }}>

                                {textSwitch('Protocolos', pageValue === 3)}
                            </InputRoundedOptionChildren>
                        </InputRounded>
                    </Section>
                    {pageValue === 1 ?
                        <>
                            <Section>
                                <Display text='Clientes Atendidos' number={informations?.custumersServed || '0'} />
                                <Display text='Clientes na Fila' number={informations?.custumersInLine || '0'} />
                                <Display text="Clientes em Atendimento" number={informations?.custumersInAttendance || '0'} />
                            </Section>
                            <Section >
                                <Card >
                                    {informations?.custumersServed > 0 && informations?.custumersInLine > 0 ? < ChartPizza

                                        title='Atendimentos'
                                        labels={
                                            ['Atendidos', 'Na Fila']
                                        }
                                        series={
                                            [informations?.custumersServed || 0, informations?.custumersInLine || 0]
                                        }
                                    /> :
                                        <div style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            fontStyle: 'italic',
                                            opacity: '0.7',
                                            alignItems: 'center',
                                            height: '100%',
                                        }}>Não há dados de atendimentos para serem exibidos</div>
                                    }
                                </Card>
                                <Card style={{ width: '40%' }}>
                                    <Display key='awaitTime' style={{ width: 'auto' }} text="Tempo de Espera" number={Math.round(informations?.awaitTime) + 'min' || '0min'} />
                                    <Display key='attendanceTime' style={{ width: 'auto' }} text="Tempo de Atendimento" number={Math.round(informations?.attendanceTime) + 'min' || '0'} />
                                    <Display key='cancelAttendance' style={{ width: 'auto' }} text="Atendimentos Cancelados" number={informations?.clientsCancelAttendance || '0'} />
                                    <Display key='transfersSectors' style={{ width: 'auto' }} text="Transferencias entre Setores" number={informations?.transfersSectors || '0'} />
                                    <Display key='totalAttendances' style={{ width: 'auto' }} text="Total de Atendimentos" number={informations?.totalAttendances || '0'} />
                                </Card>
                            </Section>
                            <Section>
                                <Card>
                                    <ChartBar
                                        title='Atendimentos por Usuário' labels={informations?.attendancesPerUser?.map(item => item.name)}
                                        series={informations?.attendancesPerUser?.map(item => item.attendaces)}
                                    />
                                </Card>
                            </Section>
                            <Section >
                                <Card style={{ height: '35rem', overflowX: 'auto', overflowY: "hidden", display: 'flex' }}>

                                    {informations?.attendancesPerUser?.map((user) => {
                                        return <InvivibleCard key={user.id + 'timeline'} style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            alignContent: 'center',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            backgroundColor: 'var(--six-color)',
                                            width: '15rem',
                                            height: '34em',
                                            borderRadius: '1rem',
                                            padding: 'none'
                                        }}>
                                            <div style={{ fontWeight: '700', fontSize: '10pt', padding: '1rem' }}> {user.name}</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignContent: 'flex-start' }}>

                                                {user.timeLineAttendaces ? user.timeLineAttendaces?.map((item) => {
                                                    return <TimelineItem key={item._id}>
                                                        <TimelineOppositeContent
                                                            style={{ fontWeight: '700' }}
                                                            sx={{ m: 'auto 0' }}
                                                            align="right"
                                                            variant="body2"
                                                        >
                                                            {formatDate(item.date, "HH:mm")}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <TimelineConnector />
                                                            <TimelineDot color="primary">
                                                                {iconTimelineUsers(item?.data?.movement)}
                                                            </TimelineDot>
                                                            <TimelineConnector />
                                                        </TimelineSeparator>
                                                        <TimelineContent sx={{ py: '15px', px: 1.5 }} style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                                            <Typography style={{ fontSize: '10pt' }}>{textTimelineUsers(item?.data?.movement)}</Typography>
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                }) :
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        fontStyle: 'italic',
                                                        fontSize: '10pt',
                                                        opacity: '0.7',
                                                        alignItems: 'center',
                                                        width: '100%',
                                                        height: '100%',
                                                    }}>Nenhum registro encontrado</div>

                                                }
                                            </div>

                                        </InvivibleCard>
                                    })}
                                </Card>

                            </Section>
                            <Section>
                                <Card>
                                    <ChartBar
                                        horizontal
                                        title='Atendimentos por conexão' labels={informations?.attendancesPerConnection?.map(item => item.name)}
                                        series={informations?.attendancesPerConnection?.map(item => item.attendances)}
                                    />
                                </Card>
                                <Card>
                                    <ChartBar
                                        title='Escolha de Setores' labels={informations?.attendancesPerSector?.map(item => item.name)}
                                        series={informations?.attendancesPerSector?.map(item => item.attendances)}
                                    />
                                </Card>
                            </Section>
                            <Section>
                                <Display key={'UsuáriosOnlineDisplay'} text={'Usuários Online'} number={informations?.onlineUsers || '0'} />
                                <Display key={'UsuáriosPausadosDisplay'} text={'Usuários Pausados'} number={informations?.statusUsers.filter(item => item.isPaused)?.length || '0'} />
                                <Display key={'UsuáriosAtivosDisplay'} text={'Usuários Ativos'} number={informations?.statusUsers.filter(item => !item.isPaused)?.length || '0'} />
                            </Section>
                            <Section>
                                {surveys?.map(item => {
                                    var result = item?.data?.options?.map(option => {
                                        return { name: option.name, value: item?.data?.votes?.filter(vote => vote.name === option.name)?.length }
                                    })
                                    // console.log(result);
                                    return <ChartPizza title={item?.name} labels={result?.map(item => item.name)} series={result?.map(item => item.value)} />
                                })}
                            </Section>
                        </> : null}
                    {pageValue === 2 ? <>
                        <Section>
                            <Card>
                                <UserList />
                            </Card>
                            <Card>
                                <SectorList />
                            </Card>
                        </Section>

                    </> : null}
                    {pageValue === 3 ? <>
                        <Section style={{ flexDirection: 'column' }}>

                            <InvivibleCard style={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
                                <InputText
                                    value={textSeachProtocol}
                                    onFocus
                                    onEnter={(e) => {
                                        if (e.length > 0) {
                                            getProtocol(e);
                                            setTextSeachProtocol(e);
                                            setProtocolResult(null);
                                            addParam('textSeachProtocol', e)
                                        }
                                    }}
                                    onChange={(e) => {
                                        if (e.length > 0) {
                                            setTextSeachProtocol(e);
                                            addParam('textSeachProtocol', e);
                                            setProtocolResult(null)
                                        } else {
                                            deleteParam('textSeachProtocol')
                                        }
                                    }}
                                    iconData='bx bx-search'
                                    size="large"
                                    placeholder='Pesquisar por protocolo, nome ou id do cliente'
                                />
                                <PrimaryButton onChange={() => { getProtocol(textSeachProtocol) }}>Buscar</PrimaryButton>
                            </InvivibleCard>
                            {protocolResult ?
                                <Section style={{ display: 'flex', alignItems: 'center', width: 'auto', maxHeight: '40rem' }}>
                                    <Card style={{ height: '100%', width: '20%', overflowY: 'auto' }}>
                                        <InputRounded >
                                            {
                                                protocolResult?.map((protocol) => {
                                                    var icon = 'bx bx-link';
                                                    var color = 'var(--tree-color)';
                                                    if (protocol.fromApp === 'whatsapp') {
                                                        icon = 'bx bxl-whatsapp'
                                                        color = 'var(--success-color)'
                                                    } else if (protocol.fromApp === 'whatsapp_business_account') {
                                                        icon = 'bx bxl-whatsapp'
                                                        color = 'var(--success-color)'
                                                    } else if (protocol.fromApp === 'facebook') {
                                                        icon = 'bx bxl-facebook'
                                                        color = 'var(--blue-color)'
                                                    } else if (protocol.fromApp === 'instagram') {
                                                        icon = 'bx bxl-instagram'
                                                        color = 'var(--pink-color)'
                                                    } else if (protocol.fromApp === 'site') {
                                                        icon = 'bx bx-planet'
                                                        color = 'var(--orange-color)'
                                                    } else {
                                                        icon = 'bx bx-link'
                                                    }
                                                    return <InputRoundedOptionChildren
                                                        style={{ width: '100%' }}
                                                        checked={protocol?.protocol === protocolData?.protocol}
                                                        balls={true}
                                                        key={protocol?.protocol}
                                                        value={protocol}
                                                        name='result-protocol'
                                                        onChange={value => setProtocolData(value)}
                                                    // onChange={value => console.log(value)}
                                                    >
                                                        <div style={{
                                                            padding: '.3rem',

                                                        }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}>
                                                                <h2 style={{
                                                                    fontSize: '14pt',
                                                                    fontWeight: '500',
                                                                    margin: '0',
                                                                    padding: '0',
                                                                }}>{protocol?.clientData ? protocol?.clientData.userName : protocol?.protocol}</h2>
                                                                <i class={icon} style={{
                                                                    color: color,
                                                                    fontSize: '17pt',
                                                                    marginLeft: '.5rem',
                                                                }} />
                                                            </div>
                                                            <span style={{
                                                                fontSize: '9pt',
                                                                fontWeight: '400',
                                                                opacity: '0.7',
                                                                margin: '0',
                                                                padding: '0',

                                                            }}>
                                                                {formatDate(protocol.date, "DD MMMM yyyy")}
                                                            </span>
                                                        </div>
                                                    </InputRoundedOptionChildren>
                                                })
                                            }
                                        </InputRounded>

                                    </Card>
                                    {protocolData ? <>
                                        <Card style={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '50%',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                width: '98%',
                                                padding: '.5rem',
                                                borderRadius: '.5rem',
                                            }}>
                                                <img
                                                    style={{
                                                        width: '3rem',
                                                        borderRadius: '50%',
                                                    }}
                                                    src={protocolData?.clientData?.profilePic || '/img/clients/default.png'} alt="" />
                                                <span style={{
                                                    fontSize: '14pt',
                                                    fontWeight: '500',
                                                    padding: '.5rem',
                                                }}>{protocolData?.clientData?.userName || protocolData?.protocol}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                overflowY: 'auto',
                                                marginTop: '.1rem',
                                                backgroundColor: 'var(--two-color)',
                                                borderRadius: '.5rem',
                                                width: '99.5%',
                                            }}>
                                                {
                                                    protocolData?.messages ? protocolData?.messages?.slice(0)?.reverse()?.map((message) => {
                                                        return <MessageComponent key={message.controlId} message={message} exampleMode />
                                                    }) : null
                                                }
                                            </div>
                                        </Card>
                                        <Card style={{ width: '30%', height: '100%' }}>
                                            <h3 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}> Linha do tempo </h3>
                                            <h6 style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>{formatDate(protocolData.date, "DD MMMM yyyy")}</h6>
                                            <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', height: '88%', overflowY: 'auto' }}>

                                                {
                                                    protocolData?.movements?.map((movement, index) => {
                                                        return <TimelineItem key={index + 'protocol-timeline'}>
                                                            <TimelineOppositeContent
                                                                style={{ fontWeight: '700' }}
                                                                sx={{ m: 'auto 0' }}
                                                                align="right"
                                                                variant="body2"
                                                            >
                                                                {formatHour(movement.date)}
                                                            </TimelineOppositeContent>
                                                            <TimelineSeparator>
                                                                <TimelineConnector />
                                                                <TimelineDot color="primary">
                                                                    {iconTimeline(movement.movement)}
                                                                </TimelineDot>
                                                                <TimelineConnector />
                                                            </TimelineSeparator>
                                                            <TimelineContent sx={{ py: '12px', px: 1 }}>
                                                                <Typography style={{ fontSize: '10pt', fontWeight: '700' }}>{textTimeline(movement.movement)}</Typography>
                                                                <Typography style={{ fontSize: '7pt', opacity: '0.7', fontWeight: '700', fontStyle: 'italic' }}>
                                                                    {textTimelineUserId(movement.userId)}
                                                                </Typography>
                                                                {
                                                                    movement?.moreData &&
                                                                    <Typography style={{ fontSize: '6pt', opacity: '0.5', fontWeight: '400', fontStyle: 'italic' }}>
                                                                        {
                                                                            textTimelineMoreData(movement.movement, movement.moreData)
                                                                        }
                                                                    </Typography>
                                                                }
                                                            </TimelineContent>
                                                        </TimelineItem>
                                                    })
                                                }
                                            </div>
                                        </Card>
                                    </> :
                                        <>
                                            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '60%' }}>
                                                <span style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    fontStyle: 'italic',
                                                    opacity: '0.7',
                                                    alignItems: 'center',
                                                    height: '100%',
                                                }}> Aqui aparecerá as mensagens</span>
                                            </Card>
                                            <Card style={{ width: '20%', height: '100%' }}>
                                                <span style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    fontStyle: 'italic',
                                                    opacity: '0.7',
                                                    alignItems: 'center',
                                                    height: '100%',
                                                }}> Aqui aparecerá a timeline</span>
                                            </Card>
                                        </>
                                    }
                                </Section> : null}

                        </Section>

                    </> : null}
                </div >

            </>
        )
    } else {
        return <div className="admin-dashboar-area-container">
        </div>
    }
}

function ChartPizza({ labels, series, title }) {
    // console.log(labels, series);
    const [data, setData] = useState(null)
    useEffect(() => {
        setData({
            series: series,
            options: {
                labels: labels,
                chart: {
                    width: 200,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: true,

                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 100
                        },
                        legend: {
                            show: true
                        }
                    }
                }],
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                }
            }
        })
    }, [labels, series])
    if (data) {
        return <div style={{ width: '100%' }}>
            {title ? <h3 style={{ textAlign: 'left', fontSize: '10pt', fontWeight: '400', padding: '1rem', opacity: '0.5' }}>{title}</h3> : null}
            < Chart options={data?.options} series={data?.series} type="donut" width='100%' height={300} />
        </div>
    }
    return null

}
function ChartBar({ labels, series, title, horizontal }) {
    // console.log(labels, series);
    const [data, setData] = useState(null)
    useEffect(() => {
        setData({

            series: [{
                data: series
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: horizontal,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: labels,
                }
            }
        })
    }, [])
    // console.log(data?.chart?.type);
    if (data) {
        return <div style={{ width: '100%' }}>
            {title ? <h3 style={{ textAlign: 'left', fontSize: '10pt', fontWeight: '400', padding: '1rem', opacity: '0.5' }}>{title}</h3> : null}
            {/* {console.log(series && series.length > 0)} */}

            < Chart options={data?.options} series={data?.series} type="bar" width={'100%'} height={300} />
        </div >
    }
    return null

}
function Display({ text, number, style }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: 'var(--one-color)',
            color: 'var(--text-color-one)',
            borderRadius: '.7rem',
            height: '4rem',
            width: '100%',
            margin: '.3rem',
            padding: '1rem',
            ...style
        }}>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignContent: 'flex-start' }}>

                <h3 style={{ fontSize: '30pt', fontWeight: '600' }}>{number}</h3>
                <h3 style={{ fontSize: '8pt', fontWeight: '400', opacity: '0.5' }}>{text}</h3>
            </div>
        </div>
    )
}

function Section({ style, children }) {
    return (
        <div className="admin-dashboar-area-section" style={style}>
            {children}
        </div>
    )
}

function Card({ style, children }) {
    return (
        <div style={{
            padding: '1rem',
            borderRadius: '1rem',
            backgroundColor: 'var(--one-color)',
            boxShadow: ' 10px 10px 14px -5px rgba(0,0,0,0.16)',
            color: 'var(--text-color-one)',
            minWidth: '10rem',
            width: '100%',
            minHeight: '10rem',
            margin: '.3rem',
            ...style,
        }}>
            {children}
        </div>
    )
}
function InvivibleCard({ style, children }) {
    return (
        <div style={{
            padding: '1rem',
            minWidth: '10rem',
            width: '100%',
            minHeight: '10rem',
            margin: '.3rem',
            ...style,
        }}>
            {children}
        </div>
    )
}
