import './Navbar.css';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../contexts/userData';
import { AuthUser } from '../contexts/authentication';
import Profile from '../components/Profile';
import ProfileForNormalUser from '../components/ProfileForNormalUser';
import ButtonTheme from '../components/ButtonTheme'
import { ApiBack, getLocalStorage, setLocalStorage } from '../service/axios';
import Config from './Config';
import Connections from './Connections';
import AssistantsList from './AssistantsList';
import EmBreve from './EmBreve';
import DisplayInfoIdContent from './DisplayInfoIdContent';
import ButtonModel from './ButtonModel';
import DialogBoxChildren from './DialogBoxChildren';
import InputText from './InputText';
import InputRounded from './InputRounded';
import InputRoundedOption from './InputRoundedOption';
import SecoundaryButton from './SecoundaryButton';
import PrimaryButton from './PrimaryButton';
import InputTextAreaDInamicWidth from './InputTextAreaDInamicWidth';
import { toast } from 'react-toastify';
import IconButton from './IconButton';
import LateralBar from './LateralBar';
import MessageAreaInternalChat from './MessageAreaInternalChat';
import NavbarLogo from './NavbarLogo';
import setTitleAndFavicon from '../service/setTitleAndFavicon';
import setTheme from '../service/setTheme';
import ModelsMessages from './ModelsMessages';
import Contacts from './Contacts';
import getParam from '../service/getParamUrl';
import addParam from '../service/addParamUrl';
import deleteParam from '../service/deleteParamUrl';
export default function Navbar() {
  const { user, setUser, setModal, setModalContent, setModalTitle, quickMessages, setQuickMessages, socket, socketStatus, internalChatRooms, companyData, buttonTheme, setButtonTheme, setConnectionsList } = useContext(AppContext)
  const { logout } = useContext(AuthUser)
  const [dialogNewQuickMessage, setDialogNewQuickMessage] = useState(false)
  const [dialogQuickMessage, setDialogQuickMessage] = useState(false)
  const [newQuickMessageInfos, setNewQuickMessageInfos] = useState({ name: null, message: null, from: 'all' })
  const [internalChatState, setInternalChatState] = useState(false)
  const [readMessages, setReadMessages] = useState(false)
  const [quantityMessages, setQuantityMessages] = useState(0)
  var titleStyle = { fontSize: '15pt', fontWeight: '500', marginTop: '.5rem', marginBottom: '.5rem' }
  useEffect(() => {
    async function fetchData() {
      setTitleAndFavicon((value) => {
        setButtonTheme(value)
      })
      handleUrlChange()
    }
    fetchData()
    if (user?.isPaused === null || user?.isPaused === undefined) {
      pauseUser()
    }
  }, [user]);

  function handleUrlChange() {
    var window = getParam('window')
    if (window === 'config') {
      setModalTitle('Configurações'); setModalContent(<Config />); setModal(true)
    }
    if (window === 'connections') {
      setModalTitle('Conexões'); setModalContent(<Connections />); setModal(true)
    }
    if (window === 'assistants') {
      setModalTitle('Assistentes'); setModalContent(<AssistantsList />); setModal(true)
    }
    if (window === 'internalChat') {
      setInternalChatState(true)
      setReadMessages(true)
    }
    if (window === 'contacts') {
      setModalTitle('Contatos'); setModalContent(<Contacts />); setModal(true)
    }
    if (window === 'quickMessages') {
      setDialogQuickMessage(true)
    }
  }
  useEffect(() => {
    if (dialogQuickMessage) getQuickMessages()
  }, [dialogQuickMessage]);

  function openCloseMenu() {
    var navbar = document.getElementById('navBarContainer')
    var back = document.getElementById('backNavMobile')
    navbar.className = navbar.className === 'navbarContainer' ? 'navbarContainer closeNavbar' : 'navbarContainer'
    back.className = back.className === 'back-nav' ? 'back-nav-close' : 'back-nav'
  }

  function verifyIfThisUrl(namePath) {
    var url = window.location.pathname.replace('/', "")
    if (namePath === url) { return true }
    else { return false }
  }

  async function getQuickMessages() {
    var responseQuickMessages = await ApiBack.get(`users/allQuickMessagesByUser`)
    setQuickMessages(responseQuickMessages?.data)
  }
  function newQuickMessage() {
    var inputName = document.getElementById('messageName')
    var inputMessage = document.getElementById('messageQuickMessage')
    inputName.value = ''
    inputMessage.value = ''
    ApiBack.post('users/quickMessages', newQuickMessageInfos).then((response) => {
      setQuickMessages(response.data)
      setNewQuickMessageInfos(JSON.parse(JSON.stringify({ name: null, message: null, from: 'all' })))
    }).catch(() => {
      toast.error('Talvez já exista uma mensagem com esta palavra-chave.', {
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


  function deleteQuickMessage(id) {
    ApiBack.delete(`users/quickMessages?id=${id}`).then((response) => {
      setQuickMessages(response.data)
    }).catch(() => {
      toast.error('Erro ao deletar a mensagem.', {
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


  socket.on('updateConnections', (connections) => {
    setConnectionsList(JSON.parse(JSON.stringify(connections)))
  })
  socket.off('updateConnection').on('updateConnection', (connection) => {
    console.log(connection);
    if (connection) {
      setConnectionsList((prevConnections) => {
        var connectionsCopy = JSON.parse(JSON.stringify(prevConnections));
        const index = connectionsCopy?.findIndex((item) => item.id === connection.id);
        if (index >= 0) {
          connectionsCopy[index] = connection
        }

        return connectionsCopy;
      });
    }

  })
  return (
    <>
      {verifyIfThisUrl()}

      <DialogBoxChildren open={dialogNewQuickMessage} onClose={() => { setDialogNewQuickMessage(false) }}>
        <div style={{ minWidth: '25rem', minHeight: '20rem', padding: '1rem' }}>
          <div className="header">Digite as informações abaixo para criar uma mensagem rápida.</div>
          <div className="body">
            <div style={titleStyle}>Palavra Chave</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>/</span>
              <InputText
                id='messageName'
                value={newQuickMessageInfos?.name}
                style={'clean'}
                onfocus
                onEnter={() => {
                  setDialogNewQuickMessage(false)
                }}
                placeholder='Palavra chave'
                onChange={(value) => {
                  const name = value.replace(/\s/g, "")
                  var newQuickMessageInfosCopy = { ...newQuickMessageInfos, name: name }
                  setNewQuickMessageInfos(newQuickMessageInfosCopy)
                }}
              /></div>
            <div style={titleStyle}>Sua mensagem</div>
            <InputTextAreaDInamicWidth id='messageQuickMessage' value={newQuickMessageInfos?.message} placeholder={'Escreva sua mensagem aqui...'} onChange={(value) => {
              var newQuickMessageInfosCopy = { ...newQuickMessageInfos, message: value }
              setNewQuickMessageInfos(newQuickMessageInfosCopy)
            }} />
            <div style={titleStyle}>Tipo de Mensagem</div>
            <InputRounded>
              <InputRoundedOption checked={newQuickMessageInfos?.from === 'all'} key={'all'} name='typeQuickMessage' label={'Para todos'} value={'all'} onChange={() => {
                var newQuickMessageInfosCopy = { ...newQuickMessageInfos, from: 'all' }
                setNewQuickMessageInfos(newQuickMessageInfosCopy)
              }} />
              <InputRoundedOption checked={newQuickMessageInfos?.from === user?._id} key={'user'} name='typeQuickMessage' label={'Apenas para mim'} value={user?._id} onChange={() => {
                var newQuickMessageInfosCopy = { ...newQuickMessageInfos, from: user?._id }
                setNewQuickMessageInfos(newQuickMessageInfosCopy)
              }} />
            </InputRounded>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
            <SecoundaryButton onChange={() => {
              setDialogNewQuickMessage(false);
              setDialogQuickMessage(true)
              setNewQuickMessageInfos({ name: null, message: null, from: 'all' })
            }}>
              Cancelar
            </SecoundaryButton>
            <PrimaryButton onChange={() => {
              setDialogNewQuickMessage(false)
              setDialogQuickMessage(true)
              newQuickMessage()
            }}>
              Criar
            </PrimaryButton>
          </div>
        </div>
      </DialogBoxChildren>

      {dialogQuickMessage &&
        <DialogBoxChildren
          style={{ width: '80vw' }}
          open={dialogQuickMessage}
          onClose={() => {
            setDialogQuickMessage(false);
            deleteParam('window')
          }}>
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}><IconButton onClick={getQuickMessages}><i className='bx bx-rotate-left'></i></IconButton></div>
          <div style={{ height: '60vh', padding: '1.5rem', overflowY: 'auto' }}>
            {quickMessages?.length > 0 ? quickMessages?.map((message) => {
              return <div key={message._id + "parent"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <DisplayInfoIdContent key={message._id} id={`/${message.name}`} content={message.message} onClick={() => { }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    margin: 0,
                    padding: '0 .5rem 0 .5rem',
                    borderRadius: '50rem',
                    marginLeft: '.5rem',
                    color: message.from === user?._id ? 'var(--success-color-text)' : 'var(--warn-color-text)',
                    backgroundColor: message.from === user?._id ? 'var(--success-color)' : 'var(--warn-color)',
                    fontSize: '9pt',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'baseline',
                  }}>
                    {message.from === user?._id ? 'Minha' : 'Todos'}
                  </span>
                  <IconButton onClick={() => { deleteQuickMessage(message._id) }}><i className='bx bx-trash'></i></IconButton>
                </div>

              </div>
            }) : <div style={{ minWidth: '100%', display: 'flex', justifyContent: 'center', }}>
              Você ainda não tem mensagens rápidas
            </div>}

          </div>
          <ButtonModel onClick={() => {
            setDialogQuickMessage(false)
            setDialogNewQuickMessage(true)
          }}>Adicionar Mensagem</ButtonModel>
        </DialogBoxChildren>
      }

      {/* ------------------------------------------------------- */}
      <div className='mobile-menu'>
        <span onClick={() => {
          openCloseMenu()
        }}><i className='bx bx-menu'></i></span>
        <span className='logo-span'><img src="./img/simbol-default.png" className='logo-navbar' alt='' /></span>
      </div>
      <div className="navbarContainer closeNavbar" id='navBarContainer'>
        <div className="options">
          <div className='navbar-top'>
            <div className="logo-content">
              <a href="/">
                <NavbarLogo companyData={companyData} />
              </a>
              <ButtonTheme status={buttonTheme} onChange={() => { setTheme() }} />
            </div>
          </div>
          <div className='profile-container'>
            <span className='profile-img' style={{ position: 'relative', }} onClick={() => {
              setModal(true)
              setModalTitle('Perfil')
              setModalContent(user?.role?.includes('admin') ?
                <Profile status={true} user={user} onUpdate={(userData) => { setUser(userData) }} /> :
                <ProfileForNormalUser status={false} user={user} onUpdate={(userData) => { setUser(userData) }} />
              )
            }}>
              <i className='bx bxs-circle' style={{
                color: socketStatus ? 'var(--success-color)' : 'var(--danger-color)',
                fontSize: '10pt',
                position: 'absolute',
                bottom: '.35rem',
                left: '.2rem'
              }}></i>
              <img src={user?.profilePic} alt='' />
            </span>
            <span className='profile-name-profession'>
              <span className='profile-name-profession-content'>
                <div className='name'>
                  <span className='nameName'> {user?.name?.length > 12 ? user?.name?.slice(0, 12) + '...' : user?.name} </span>
                  <p className='profession'>{user?.profession}</p>
                </div>
                <span className='more-profile-arrow' onClick={() => logout()}><i className='bx bx-exit'></i></span>
              </span>

            </span>
          </div>
          <div className='navbar-middle'>
            <ul className='navbar-links'>


              {user?.role?.includes('admin') ?
                <>
                  <div className="category">Páginas</div>
                  <li className={verifyIfThisUrl('') ? 'link-navbar selected-navbar' : 'link-navbar'}>
                    <a href='/' className='buttonNav'>
                      <i className='bx bx-message-alt-detail' ></i>
                      <span className='text'>Mensagens</span>
                    </a>
                  </li>

                  <li className={verifyIfThisUrl('admin') ? 'link-navbar selected-navbar' : 'link-navbar'}>
                    <a href='/admin' className='buttonNav'>
                      <i className='bx bx-shield-quarter'></i>
                      <span className='text'>Administração</span>
                    </a>
                  </li>
                </>
                : null}
              <div className="category">Ferramentas</div>
              {user?.role?.includes('admin') ?
                <>
                  <li className='link-navbar'
                    onClick={() => {
                      setModalTitle('Assistentes');
                      setModalContent(<AssistantsList />);
                      setModal(true)
                      addParam('window', 'assistants')
                    }}
                  >
                    <div className='buttonNav'>
                      <i className='bx bx-bot'></i>
                      <span className='text'>Assistentes</span>
                    </div>
                  </li>

                  <li className='link-navbar'
                    onClick={() => {
                      setModalTitle('Conexões');
                      setModalContent(<Connections />);
                      setModal(true)
                      addParam('window', 'connections')
                    }}>
                    <div className='buttonNav'>
                      <i className='bx bx-qr-scan' ></i>
                      <span className='text'>Conexões</span>
                    </div>
                  </li>

                  <li className='link-navbar' onClick={() => {
                    setModalTitle('Configurações');
                    setModalContent(<Config />);
                    setModal(true)
                    addParam('window', 'config')
                  }}>
                    <div className='buttonNav'>
                      <i className='bx bx-cog'></i>
                      <span className='text'>Configurações</span>
                    </div>
                  </li>
                </>
                : null}
              <li className='link-navbar' onClick={() => {
                !internalChatState ? addParam('window', 'internalChat') : deleteParam('window')
                setInternalChatState(state => !state);
                setReadMessages(true)

              }}>
                <div className='buttonNav'>
                  <i className='bx bx-conversation'></i>
                  <span className='text' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Chat Interno {quantityMessages > 0 ?
                      <div style={{
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '50rem',
                        padding: '0.1rem',
                        fontSize: '10pt',
                        width: '1.3rem',
                        height: '1.3rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '1rem'
                      }}>
                        {quantityMessages}
                      </div> : null
                    }</span>
                </div>
              </li>

              <li className='link-navbar'
                onClick={() => {
                  setModalTitle('Modelos de Mensagens');
                  setModalContent(<ModelsMessages />);
                  setModal(true)
                  addParam('window', 'modelsMessages')
                }}>
                <div className='buttonNav'>
                  <i className='bx bx-message-alt-edit'></i>
                  <span className='text'>Modelos</span>
                </div>
              </li>
              <li className='link-navbar'
                onClick={() => {
                  setModalTitle('Contatos');
                  setModalContent(<Contacts />);
                  setModal(true)
                  addParam('window', 'contacts')
                }}>
                <div className='buttonNav'>
                  <i className='bx bx-id-card'></i>
                  <span className='text'>Contatos</span>
                </div>
              </li>
              <li className='link-navbar' onClick={() => {
                setDialogQuickMessage(true)
                addParam('window', 'quickMessages')
              }}>
                <div className='buttonNav'>
                  <i className='bx bxs-bolt'></i>
                  <span className='text'>Msgs. Rápidas</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {<LateralBar open={internalChatState} onClose={() => { setInternalChatState(false); setReadMessages(false); deleteParam('window') }} closeRelative>
          <MessageAreaInternalChat readAllMessages={readMessages} roomData={internalChatRooms ? internalChatRooms[0] : null} onMessagesUnread={(value) => {
            setQuantityMessages(value)
          }} />
        </LateralBar>}
        <div className="navbar-footer"> © Catbot - Todos os direitos reservados </div>
      </div>
      <div className="back-nav-close" id='backNavMobile' onClick={() => { openCloseMenu() }}></div>
    </>)
}


