import './EditCustomAssistantChat.css'
import React, { useEffect, useContext, useState, useRef } from 'react'
import { AppContext } from '../contexts/userData';
import { Ring } from '@uiball/loaders'
import MessageComponent from './MessageComponentSite';
import InputText from './InputText';
import ButtonModel from './ButtonModel';
import FormatMessage from '../service/formatMessage';
import Space from './Space';
import RoundedButton from './RoundedButton';
import { v4 as uuidv4 } from 'uuid';
import { ApiBack } from '../service/axios';
import IconButton from './IconButton';
export default function EditCustomAssistantChat({ assistantId }) {
  const { companyData } = useContext(AppContext)
  const [debounceTimeout, setDebounceTimeout] = useState(null)
  const [transferState, setTransferState] = useState(false)
  const [cancelState, setCancelState] = useState(false)
  const [endState, setEndState] = useState(false)
  const [messageText, setMessageText] = useState(null)
  const [messagesDB, setMessagesDB] = useState([])
  const messageEndRef = useRef(null)

  const [clientData, setClientData] = useState({
    id: uuidv4(),
    status: false,
    inLine: false,
    appFrom: "null",
    userName: "Cliente",
    company: {
      id: companyData?.id
    },
    stage: null,
    stage2: 0,
    data: {
      info: []
    },
    botstatus: true,
    botResponsible: assistantId,
    statusAttendance: false,
    userInAttendance: null,
    sector: null,
    bookmarks: []
  });

  useEffect(() => {

  }, []);

  const delayFunction = (action, debounceDelay) => {
    clearTimeout(debounceTimeout);

    setDebounceTimeout(
      setTimeout(() => {
        action();
        // Outras ações a serem executadas após o debounce
      }, debounceDelay)
    )
  };

  const sendMessage = async (messageResponse, messageText, messageFile, messageType) => {
    if (messageText && messageText.length > 0) {
      var newMessages = []
      var messageObj = messageResponse ?
        FormatMessage(clientData?.id, 'whatsapp', null, "response/" + messageType, null, true, clientData?.id, 'Cliente', messageFile, messageText, null)
        : FormatMessage(clientData?.id, 'whatsapp', null, messageType, messageResponse, true, clientData?.id, 'Cliente', messageFile, messageText, null)
      newMessages.push(messageObj)
      await ApiBack.post('/connection/messageWebhookAssistants', {
        client: clientData,
        message: messageObj
      }).then((response) => {
        var messages = response.data.message.map(message => {
          return FormatMessage('assistant', 'whatsapp', null, message?.typeMessage, null, false, clientData?.id, 'Cliente', message.file, message.text, null)
        })
        newMessages.push(...messages)
        setMessagesDB((prevMessages) => [...prevMessages, ...newMessages]);
        setClientData(response.data.clientData)
        if (response.data?.isEnd === true) setEndState(true)
        if (response.data?.isEnd === 'transfer') setTransferState(true)
        if (response.data?.cancel) setCancelState(true)
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
      })
      // setMessagesDB((prevMessages) => [...prevMessages, messageObj]);
    }
  }

  if (assistantId) {
    return (
      <div className='chat-assistant-container'>
        <div className="header">
          <span>Chat com o assistente</span> <IconButton onClick={() => {
            setClientData({
              id: uuidv4(),
              status: false,
              inLine: false,
              appFrom: "null",
              userName: "Cliente",
              company: {
                id: companyData?.id
              },
              stage: null,
              stage2: 0,
              data: {
                info: []
              },
              botstatus: true,
              botResponsible: assistantId,
              statusAttendance: false,
              userInAttendance: null,
              sector: null,
              bookmarks: []
            })
            setMessagesDB([])
            setEndState(false)
            setTransferState(false)
            setCancelState(false)
          }}><i className='bx bx-rotate-left' ></i></IconButton>
        </div>
        <div className="messages">
          {messagesDB?.length > 0 ? messagesDB.map((message, index) => {
            return <MessageComponent key={index + message.controlId} message={message} exampleMode />
          }) : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '30%', position: 'absolute', bottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RoundedButton onChange={() => { sendMessage(null, 'Olá!', null, 'text') }}>Olá!</RoundedButton>
              <RoundedButton onChange={() => { sendMessage(null, 'Quero ser atendido (a)!', null, 'text') }}>Quero ser atendido!</RoundedButton>
            </div>
          </div>}
          {endState && <div className="end-message-state" ><i className='bx bxs-check-circle'></i> Fim de conversa</div>}
          {transferState && <div className="end-message-state" ><i className='bx bxs-check-circle'></i>Cliente transferido</div>}
          {cancelState && <div className="end-message-state" ><i className='bx bxs-check-circle'></i>Atendimento finalizado</div>}

          <div className="end-message" ref={messageEndRef}>ㅤ</div>
          <Space />
        </div>
        <div className="footer">
          <InputText
            onChange={async (value) => {
              delayFunction(() => { setMessageText(value) }, 1000);
            }}
            emoji={true}
            onFocus={true}
            onEnter={async (messageText) => {
              sendMessage(null, messageText, null, 'text')
            }}
            id='messageTextInput'
            placeholder='Digite sua Mensagem'
            clear={true} />

          <ButtonModel
            onClick={async () => {
              var input = document.getElementById('messageTextInput')
              input.value = ''
              sendMessage(null, messageText, null, 'text')
            }}
            type='clean'
          > <i className='bx bx-send'></i>
          </ButtonModel>
        </div>
      </div>
    )
  } else {
    return (
      <div className='home-container'>
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
