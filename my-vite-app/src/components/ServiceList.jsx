import './ServiceList.css';
import ContactForList from './ContactForList'
import React, { useState, useEffect, useContext, Suspense } from 'react'
import { AppContext } from '../contexts/userData';
import NewClient from './NewClient';
import { ApiBack } from '../service/axios';
import { Ring } from '@uiball/loaders'
import BookmarkForList from './BookmarkForList';
import FloatBox from './FloatBox';
import RoundedButton from './RoundedButton';
import IconButton from './IconButton';
import InputText from './InputText';
import Bar from './Bar';
import Space from './Space';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import DialogBoxChildren from './DialogBoxChildren';
import NewBookmark from './NewBookmark';
import Switch from './Switch';
import configureLastMessage from '../service/configureLastMessage';
import notification from '../service/notificationsBack';
import playAudio from '../service/playAudio';
import responseSocketRequest from '../service/responseSocketRequest';
import { ToastContainer, toast } from 'react-toastify';
import { debounce } from '@mui/material'
import DialogBox from './DialogBox';
import getParam from '../service/getParamUrl';
export default function ServiceList() {
  const {
    user,
    setUser,
    socket,
    socketReconnectStatus,
    client,
    setClient,
    chatDataBase,
    setChatDatabase,
    sectorsList,
    bookmarks,
    setModal, setModalContent, setModalTitle,
    usersList,
  } = useContext(AppContext)
  const [dialogPauseUser, setDialogPauseUser] = useState(false)
  const [clientShow, setClientShow] = useState(null);
  const [lengthStateClientsAtive, setLengthStateClientsAtive] = useState(0);
  const [lengthStateClientsInative, setLengthStateClientsInative] = useState(0);
  const [limit] = useState(10);
  const [firstRow, setFirstRow] = useState(true);
  const [stateDisableChatDatabase, setStateDisableChatDatabase] = useState(true);
  const [stateClientShow, setStateClientShow] = useState(true);
  const [statusClientBar, setStatusClientBar] = useState(true);
  const [sectorListNoDefault, setsectorListNoDefault] = useState(null);
  const [syncClientsState, setSyncClientsState] = useState(false);
  const [interval, setIntervalState] = useState(null);
  const [filter, setFilter] = useState({
    status: true,
    attendance: null,
    sectors: [],
    bookmarks: [],
    channels: [],
    text: null,
    myAttendances: false
  })
  const [stateDialogNewBookmark, setStateDialogNewBookmark] = useState(false)
  const [stateMethodDialogNewBookmark, setStateMethodDialogNewBookmark] = useState(null)
  const [anchorFilter, setAnchorFilter] = useState(null);
  const openFilter = (event) => { setAnchorFilter(event) }



  useEffect(() => {
    debounce(getClients(), 1000)
    /* const intervalId = setInterval(() => getClientsHidden(), 120000)
    return () => clearInterval(intervalId); */
  }, []);


  useEffect(() => {
    if (stateDisableChatDatabase) setClientsCurrent()
    if (!stateDisableChatDatabase) setStateDisableChatDatabase(true)
    setTimeout(() => {
      // handleUrlChange()  
    }, 3000);
  }, [chatDataBase, filter, stateClientShow, stateDisableChatDatabase]);


  useEffect(() => {
    setsectorListNoDefault(sectorsList.filter(sector => sector?.name !== 'Default'))
  }, [sectorsList]);

  const filterClients = (clients, filters) => {
    const { bookmarks, attendance, sectors, text, myAttendances } = filters
    if (clients) {
      var result = clients?.filter(client => {
        var finalResult = [true, true, true, true, true]
        //verificação bookmarks
        if (bookmarks.length > 0) {
          if (!client?.data.bookmarks.every(elemento => bookmarks.includes(elemento))) finalResult[0] = false
        }


        //verificação de espera ou em atendimento
        if (attendance) {
          finalResult[1] = false
          if (client?.data.userInAttendance && attendance === 'inAttendace' || !client.data.userInAttendance && attendance === 'inAwait') finalResult[1] = true
        }
        //verifica se o cliente é do atendente
        if (myAttendances) {
          if (!(client?.data.userInAttendance === user._id)) finalResult[2] = false
        }

        //verificação de setores
        if (sectors.length > 0) {
          if (client.data.sector) {
            if (!sectors.includes(client.data.sector)) finalResult[3] = false
          } else {
            if (!sectors.includes('all')) finalResult[3] = false
          }
        }

        //verificação de texto
        if (text && text.length > 0 && text !== ' ') {
          const { userName, id } = client.data
          const nameFormated = userName.toLowerCase()
          const idFormated = id.toLowerCase()
          const textArray = text.split(' ')
          const textLowerCase = textArray.map(element => element.toLowerCase())
          finalResult[4] = textLowerCase.some(word =>
            idFormated.toLowerCase().includes(word.toLowerCase()) || nameFormated.toLowerCase().includes(word.toLowerCase())
          );

        }
        // console.log(finalResult);
        finalResult = finalResult[0] + finalResult[1] + finalResult[2] + finalResult[3] + finalResult[4]
        if (finalResult === 5) { return client } else { return null }
      })
      return result
    }
  }
  async function getClients() {

    setSyncClientsState(true)
    await ApiBack.get(`clients/getClientsFromUser`).then(responseClients => {
      setChatDatabase(responseClients.data)
    }).catch(error => {
      // alert(error.response.data.message)
    })
    setTimeout(() => {
      setSyncClientsState(false)
    }, 2000);

  }
  async function getClientsHidden() {

    await ApiBack.get(`clients/getClientsFromUser`).then(responseClients => {
      setChatDatabase(responseClients.data)
    })

  }
  function setClientsCurrent() {
    if (
      filter?.status &&
      filter?.attendance === null &&
      filter?.sectors.length === 0 &&
      filter?.bookmarks.length === 0 &&
      filter?.channels.length === 0 &&
      filter?.text === null &&
      filter?.myAttendances === false
    ) {
      const filterChatsByState = stateClientShow ? chatDataBase?.filter(client => client?.data?.inLine) : chatDataBase?.filter(client => !client?.data?.inLine)
      const start = stateClientShow ? lengthStateClientsAtive : lengthStateClientsInative
      const clientsSlice = filterChatsByState/* ?.slice(0, start + limit) */
      setClientShow(filterClients(clientsSlice, filter))
      if (firstRow) {
        stateClientShow ? setLengthStateClientsAtive(start + limit) : setLengthStateClientsInative(start + limit)
        setFirstRow(false)
      }
      return
    }
    if (filter?.text && filter?.text?.length > 0) {
      setClientShow(filterClients(chatDataBase, filter))
      return
    }
    const filterChatsByState = stateClientShow ? chatDataBase?.filter(client => client?.data?.inLine) : chatDataBase?.filter(client => !client?.data?.inLine)
    setClientShow(filterClients(filterChatsByState, filter))
    return
  }
  function setClientsCurrentAdd(setLimit) {

    if (
      filter?.status &&
      filter?.attendance === null &&
      filter?.sectors.length === 0 &&
      filter?.bookmarks.length === 0 &&
      filter?.channels.length === 0 &&
      filter?.text === null &&
      filter?.myAttendances === false
    ) {
      const filterChatsByState = stateClientShow ? chatDataBase?.filter(client => client?.data?.inLine) : chatDataBase?.filter(client => !client?.data?.inLine)
      const start = stateClientShow ? lengthStateClientsAtive : lengthStateClientsInative
      const clientsSlice = filterChatsByState?.slice(0, (setLimit ? setLimit : limit) + start)
      setClientShow(filterClients(clientsSlice, filter))
      stateClientShow ? setLengthStateClientsAtive(clientsSlice.length) : setLengthStateClientsInative(clientsSlice.length)
      return
    }
  }
  function pauseUser() {
    ApiBack.post('users/pause', { isPaused: !user?.isPaused || false }).then((response) => {
      setUser(response.data)
      setDialogPauseUser(false)
      // alert(`Seu atendimento foi ${!user?.isPaused ? 'Pausado' : 'Retomado'}.`)
      setClient(old => ({ ...old, client: null }))
      setChatDatabase([])
      if (response.data.isPaused === false) getClients()
    }).catch((err) => {
      console.log(err);
      setDialogPauseUser(false)
      toast.error(`Houve um erro ao tentar ${user?.isPaused ? 'ativar' : 'desativar'} o atendimento, por favor tente novamente.`, {
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

  function handleUrlChange() {

    const chatId = getParam('chatId')
    const connectionId = getParam('connectionId')
    if (!chatId || !connectionId) return
    const client = chatDataBase?.find(client => client?.chatId === chatId && client?.connectionId === connectionId)
    if (client) {
      setClient({ state: true, client: client })
      return
    }
    ApiBack.get(`clients/getUniqueClient?id=${chatId}&connectionId=${connectionId}`)
      .then(async (responseChatsList) => {
        const chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
        chatDataBaseCopy.push(responseChatsList?.data)
        setClient({ state: true, client: responseChatsList?.data })
        setChatDatabase(chatDataBaseCopy)
        return
      })

  }






  // const [previousScroll, setPreviousScroll] = useState(0)
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log('scrollBottom');
      setClientsCurrentAdd(3)
    }

  };

  socket?.off('connect').on("connect", () => {
    if (socketReconnectStatus) {
      setTimeout(() => {
        getClients()
      }, 3000);
    }

  });

  socket?.off("sendMessageToClientInAttendance").on('sendMessageToClientInAttendance', async (message, socketMessageId) => {
    console.log('MESSAGE ENVIADO PARA CLIENT EM ATENDIMENTO ', `${new Date().getHours()}: ${new Date().getMinutes()}`);

    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var index = chatDataBaseCopy ? chatDataBaseCopy?.findIndex(chat => chat?.chatId === message?.idConversation && chat?.connectionId === message?.from?.connection?.id) : null

    if (index >= 0) {
      var findControlId = chatDataBaseCopy[index]?.messages?.find((messageObject) => messageObject.controlId === message.controlId)

      if (!findControlId) {
        chatDataBaseCopy[index].messages.unshift(message)
        var chatSelected = chatDataBaseCopy.splice(index, 1)[0]
        chatDataBaseCopy.unshift(chatSelected);
      } else {
        var indexMessage = chatDataBaseCopy[index]?.messages?.findIndex((messageObject) => messageObject.controlId === message.controlId)
        chatDataBaseCopy[index].messages[indexMessage] = message
      }

      var result = await configureLastMessage(document.getElementById(`lastMessage${message?.idConversation}`), message)
      if (document.hidden &&
        message.type.toShow &&
        chatDataBaseCopy[index].data.inLine &&
        (
          (
            chatDataBaseCopy[index].data.userInAttendance && //verifica se o cliente esta em atendimento
            chatDataBaseCopy[index].data.userInAttendance === user._id //verifica se o usuário logado e o cliente em atendimento sao o mesmo
          ) || !chatDataBaseCopy[index].data.userInAttendance)) { // verifica se o cliente nao esta em atendimento
        notification(`Mensagem de ${message.from.name}`, result)
        playAudio('./audio/newMessage.mp3')
      }
    } else {
      if (message && message?.idConversation && message?.from?.connection?.id) {
        ApiBack.get(`clients/getUniqueClient?id=${message?.idConversation}&connectionId=${message?.from?.connection?.id}`)
          .then(async (responseChatsList) => {
            chatDataBaseCopy.push(responseChatsList?.data)
          })
      }

    }
    setChatDatabase(chatDataBaseCopy)
    responseSocketRequest(socket, socketMessageId)
  })

  socket?.off("readMessage").on("readMessage", (chatData) => {
    console.log('MESSAGE LIDO', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var indexClient = chatDataBaseCopy.findIndex(chat => chat.chatId === chatData.chatId && chat.connectionId === chatData.connectionId)
    if (indexClient >= 0) {
      chatDataBaseCopy[indexClient].messages = chatDataBaseCopy[indexClient].messages.map(message => {
        message.read = true
        return message
      })
      setChatDatabase(chatDataBaseCopy)
    }
  })

  socket?.off("deleteMessage").on("deleteMessage", (data) => {
    console.log('MESSAGE DELETADO', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var index = chatDataBaseCopy?.findIndex(chat => chat.chatId === data.idConversation && chat.connectionId === data.connectionId)
    if (index >= 0) {
      chatDataBaseCopy[index].messages = chatDataBaseCopy[index].messages.filter(messageData => messageData._id !== data.messageId)
      configureLastMessage(document.getElementById(`lastMessage${data.idConversation}`), chatDataBaseCopy[index].messages[0])
      setChatDatabase(chatDataBaseCopy)
    }
  })

  socket?.off("updateMessage").on("updateMessage", (message) => {
    console.log('MESSAGE ATUALIZADO', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var index = chatDataBaseCopy?.findIndex(chat => chat.chatId === message.idConversation && chat.connectionId === message.from.connection.id)
    if (index >= 0) {
      var indexMessage = chatDataBaseCopy[index].messages.findIndex(messageData => messageData._id === message._id)
      chatDataBaseCopy[index].messages[indexMessage] = message
      configureLastMessage(document.getElementById(`lastMessage${message.idConversation}`), chatDataBaseCopy[index].messages[0])
      if (client.state && client.client.data.id === message.idConversation) { setChatDatabase(chatDataBaseCopy) }
    }
  })

  socket?.off("updateClientInLine").on("updateClientInLine", (clientData) => {
    console.log('CLIENTE ATUALIZADO', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var index = chatDataBaseCopy?.findIndex(chat => chat.chatId === clientData.id && chat.connectionId === clientData.connection.id)
    if (index >= 0) {
      chatDataBaseCopy[index].data = clientData
      setChatDatabase(chatDataBaseCopy)
      if (client.state && client.client.data.id === clientData.id) {
        setClient({ state: true, client: chatDataBaseCopy[index] })
      }
    }
  })

  socket?.off("addClientToLine").on("addClientToLine", (chatData) => {
    console.log('CLIENTE ADICIONADO A FILA', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var index = chatDataBaseCopy?.findIndex(chat => chat.chatId === chatData.chatId && chat.connectionId === chatData.connectionId)
    if (index === -1) {
      chatDataBaseCopy.push(chatData)
      setChatDatabase(chatDataBaseCopy)

    } else {
      chatDataBaseCopy[index] = chatData
      setChatDatabase(chatDataBaseCopy)
    }
    notification('Novo Cliente', `Cliente adicionado a fila de atendimento.`)
    playAudio('./audio/newClient.mp3')
    // responseSocketRequest(socket, socketMessageId)
  })

  socket?.off("deleteClientToLine").on("deleteClientToLine", (chatData) => {
    console.log('CLIENTE REMOVIDO DA FILA ', `${new Date().getHours()}: ${new Date().getMinutes()}`);

    const connectionsId = chatData.map(chat => chat.connectionId)
    const chatsIds = chatData.map(chat => chat.chatId);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))

    if (chatsIds.includes(client?.client?.chatId) && connectionsId.includes(client?.client?.connectionId)) {
      setClient(old => {
        return { ...old, state: false }
      })
    }

    var filter = chatDataBaseCopy?.filter(chat => {
      if (!chatsIds.includes(chat.chatId)) return true
      if (connectionsId.includes(chat.connectionId)) return false
      return true
    })

    setChatDatabase(filter)
  })

  socket?.off("removeClient").on("removeClient", (clients) => {
    console.log('CLIENTE(s) REMOVIDO(s) DA FILA ', `${new Date().getHours()}: ${new Date().getMinutes()}`);
    var chatDataBaseCopy = JSON.parse(JSON.stringify(chatDataBase))
    var dataFilter = null
    var connectionIds = []
    var chatsIds = []
    if (clients?.length > 0) { dataFilter = clients }
    else { dataFilter = [{ chatId: clients?.chatId, connectionId: clients?.connectionId }] }
    dataFilter.forEach(chat => {
      if (!connectionIds.includes(chat.connectionId)) {
        connectionIds.push(chat.connectionId)
      }
      chatsIds.push(chat.idConversation)
    })
    var filter = chatDataBaseCopy?.filter(chat => !chatsIds.includes(chat.chatId) && !connectionIds.includes(chat.connectionId))
    setChatDatabase(filter)
  })

  socket?.off("updateClientList").on("updateClientList", () => {
    getClients()
  })

  function verifyStateClient(client, user) {
    if (client?.statusAttendance === true) {
      if (client?.userInAttendance !== user._id && user.role === 'normal') {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  return (
    <div className='service-list-container'>
      <ToastContainer />
      <div className="service-list-content">
        <div style={{ fontStyle: 'italic', width: '100%', textAlign: 'center', opacity: '.5', fontSize: '8pt', padding: '.5rem' }}>Versão Beta Persa 1.5</div>
        <div className="service-list-header">
          <div className="service-list-header-content">
            <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }} >
              Fila de clientes
              <div style={{ padding: '.3rem', backgroundColor: 'var(--six-color)', borderRadius: '.5rem', marginLeft: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '4.5rem' }} >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-color)', fontWeight: 'bold' }}>
                  <i className="bx bxs-hourglass"></i>
                  {chatDataBase?.filter(client => client?.data?.inLine && !client?.data?.userInAttendance).length}
                </div>
                |
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger-color)', fontWeight: 'bold' }}>
                  <i className="bx bx-message-rounded-check"></i>
                  {chatDataBase?.filter(client => client?.data?.inLine && client?.data?.userInAttendance).length}
                </div>
              </div>
            </h1>
            <div className='buttons'>
              <DialogBox
                open={dialogPauseUser}
                onClose={() => { setDialogPauseUser(false) }}
                text={
                  user?.isPaused ? 'Deseja reabilitar seu atendimento?' :
                    'Deseja pausar seu atendimento? Isso fará com que você deixe de receber novos atendimentos até que seja reabilitado.'
                }
                onButtonOne={() => {
                  pauseUser()
                }}
                onButtonTwo={() => {
                  setDialogPauseUser(false)
                }}
                buttonOneText={user?.isPaused ? 'Reabilitar' : 'Pausar'}
                buttonTwoText='Cancelar'
              />
              <IconButton onClick={() => {
                setDialogPauseUser(true)
              }}>

                {user?.isPaused ? <i className='bx bx-play-circle' style={{ color: 'var(--success-color)' }} /> : <i style={{ color: 'var(--danger-color)' }} className='bx bx-pause-circle' />}

              </IconButton>
              {
                syncClientsState ? <IconButton onClick={async () => { }}>
                  <Ring
                    size={20}
                    lineWeight={9}
                    speed={2}
                    color="blue"
                  />
                </IconButton> :
                  <IconButton onClick={() => {
                    getClients()
                  }}>
                    <i className='bx bx-rotate-left'></i>
                  </IconButton>
              }
              <IconButton onClick={() => { setModalTitle('Adicionar cliente'); setModalContent(<NewClient onClose={() => { setModal(false); setModalTitle(null); setModalContent(null) }} />); setModal(true) }}> <i className='bx bx-message-square-add' ></i> </IconButton>
            </div>
          </div>
        </div>
        <Bar />
        <div className="seach-filter-container">
          <div className="seach">
            <InputText
              placeholder='Busque aqui uma conversa'
              clear={true}
              iconData='bx bx-search'
              onChange={(text) => {
                var data = { ...filter }
                data.text = text

                setClientShow(null)
                if (!text || text.length === 0) {
                  data.text = null
                  setStatusClientBar(true)
                } else {
                  setStatusClientBar(false)
                  // setClientShow(filterClients(chatDataBase, filter))
                }
                // console.log(data);
                setFilter(data)
              }}></InputText>
          </div>
          <div className="filter">
            <div className="buttons">
              <IconButton onClick={openFilter}><i className='bx bx-filter' ></i></IconButton>
              {/* <IconButton onClick={openBookmarks}><i className='bx bxs-tag' ></i></IconButton> */}
            </div>
            <FloatBox direction="row" anchorElement={anchorFilter}>
              <div className="section">
                <h1>Atendimento</h1>
                <div className="option">
                  <RoundedButton key='inAwait' value='inAwait' active={filter?.attendance === null || filter?.attendance !== 'inAwait' ? false : true} onChange={(value) => {
                    var data = { ...filter }
                    if (data.attendance === null || data.attendance === 'inAttendace') {
                      data.attendance = value
                    } else if (data.attendance === value) {
                      data.attendance = null
                    }
                    setFilter(data)
                  }}>
                    <i className='bx bxs-hourglass' ></i> Em espera
                  </RoundedButton>
                  <RoundedButton
                    key='inAttendace'
                    value='inAttendace'
                    active={filter?.attendance === null || filter?.attendance !== 'inAttendace' ? false : true}
                    onChange={(value) => {
                      var data = { ...filter }
                      if (!data.attendance || data.attendance === 'inAwait') {
                        data.attendance = value
                      } else if (data.attendance === value) {
                        data.attendance = null
                      }
                      setFilter(data)
                    }}><i className='bx bx-message-rounded-check' ></i>Em atendimento</RoundedButton>
                  <RoundedButton
                    active={filter?.myAttendances}
                    value={user._id}
                    onChange={() => {
                      var data = { ...filter }
                      data.myAttendances = !data.myAttendances
                      setFilter(data)
                    }}><i className='bx bx-user-check' ></i>Meus Atendimentos</RoundedButton>
                </div>
              </div>
              <Space />
              {user.role.includes('admin') ? <div className="alteradoagora">
                {sectorsList?.length >= 0 && sectorsList ?
                  <div className="section">
                    <h1>Setores</h1>
                    <div className="option">
                      <RoundedButton
                        active={filter?.sectors.includes('all') ? true : false}
                        value="all"
                        onChange={(value) => {
                          var data = filter
                          var index = filter?.sectors.findIndex(sector => sector === value)
                          if (data?.sectors.length === 0 || index === -1) { data.sectors.push(value) }
                          if (index >= 0) { data.sectors = data?.sectors?.filter(sector => sector !== value) }
                          setFilter(data)
                        }}>Visível para todos</RoundedButton>
                      {
                        sectorListNoDefault?.map(sector => {
                          return <RoundedButton
                            active={filter?.sectors.includes(sector._id) ? true : false}
                            value={sector._id}
                            key={sector._id + 'sector-filter'}
                            onChange={(value) => {
                              var data = { ...filter }
                              var index = filter?.sectors.findIndex(sector => sector === value)
                              if (data.sectors.length === 0 || index === -1) { data?.sectors.push(value) }
                              if (index >= 0) { data.sectors = data?.sectors.filter(sector => sector !== value) }
                              setFilter(data)
                            }}
                          >{sector.name}</RoundedButton>
                        })
                      }
                    </div>
                  </div> :
                  <div className="section">
                    <h1>Setores</h1>
                    <div className="option">
                      <div className="text-warn-filter">Para filtrar por setores, é necessário criar antes no painel administrativo.</div>
                    </div>
                  </div>}
              </div> : null}
              <div className="section">
                <h1>Marcadores</h1>
                <div className="option" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {bookmarks?.map((bookmark) => {
                    return (
                      <BookmarkForList
                        key={bookmark._id}
                        onEdit={(value) => {
                          setStateMethodDialogNewBookmark({ action: 'update', bookmark: value })
                          setStateDialogNewBookmark(true)
                        }}
                        bookmark={bookmark}
                        mode={false}
                        onChange={(dataAndActions) => {
                          const { action, id, delete: del } = dataAndActions
                          if (!del) {
                            var index = filter.bookmarks.indexOf(dataAndActions.id)
                            var objFilter = { ...filter }
                            if (action && index === -1) { objFilter.bookmarks.push(id) }
                            if (!action && index >= 0) { objFilter.bookmarks = objFilter.bookmarks.filter(obj => obj !== id) }
                            setFilter(objFilter)
                          }
                        }} />
                    )
                  })}
                  <DialogBoxChildren open={stateDialogNewBookmark} onClose={() => { setStateDialogNewBookmark(false) }}>
                    <NewBookmark onClose={() => {
                      setStateDialogNewBookmark(false)
                    }}
                      actionAndData={stateMethodDialogNewBookmark}
                    />
                  </DialogBoxChildren>
                  <PrimaryButtonGenerics onClick={() => {
                    setStateMethodDialogNewBookmark({ action: 'new', bookmark: null })
                    setStateDialogNewBookmark(true)
                  }}>Adicionar Marcador<i className='bx bx-plus'></i></PrimaryButtonGenerics>

                </div>
              </div>
            </FloatBox>
          </div>

        </div>
        <div className="switch">
          {
            statusClientBar ?
              <Switch
                status={stateClientShow}
                textOne={`Ativos (${(chatDataBase?.filter(client => client?.data?.inLine)).length < 10 ?
                  '0' + (chatDataBase?.filter(client => client?.data?.inLine)).length :
                  (chatDataBase?.filter(client => client?.data?.inLine)).length
                  })`}
                textTwo={`Aguardando (${(chatDataBase?.filter(client => !client?.data?.inLine)).length < 10 ? '0' + (chatDataBase?.filter(client => !client?.data?.inLine)).length : (chatDataBase?.filter(client => !client?.data?.inLine)).length})`}
                onChange={(value) => { setStateClientShow(value) }} />
              : null
          }
        </div>
        <div className="service-list-middle">
          <div className='service-list-middle-content' onScroll={handleScroll}>
            {
              clientShow && clientShow.length > 0 ? clientShow?.map((chatData) => {
                const { chatId, data, messages } = chatData
                var message = messages ? messages[0] : null
                return <ContactForList
                  message={message}
                  users={usersList}
                  key={`contacforlist-` + chatId + data?.connection?.id}
                  client={data}
                  bookmarks={bookmarks}
                  state={verifyStateClient(data, user)}
                />
              })
                :
                <span>Sem atendimentos a fazer</span>
            }
            ‎

          </div>
          <span className='end-service-list-middle-content'></span>
        </div>
      </div>
    </div>
  )
}
