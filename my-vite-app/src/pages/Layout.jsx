import './home.css'
import { io } from "socket.io-client";
import React, { useEffect, useContext } from 'react'
import { AppContext } from '../contexts/userData';
import { toast } from 'react-toastify';
import notification from '../service/notificationsBack';
import playAudio from '../service/playAudio';

import PrimaryButtonGenerics from '../components/PrimaryButtonGenerics'

export default function Home() {
  const {
    socket,
    setSocket

  } = useContext(AppContext)



  useEffect(() => {
    setSocket(io(`http://localhost:3001`, {
      reconnection: true,        // Habilita reconexão automática
      reconnectionAttempts: Infinity,   // Número máximo de tentativas de reconexão
      reconnectionDelay: 1000,   // Atraso entre as tentativas de reconexão (em milissegundos)
      reconnectionDelayMax: 2000,// Atraso máximo entre as tentativas de reconexão (em milissegundos)
      timeout: 2000,             // Tempo limite para reconexão (em milissegundos)
    }
    ))
  }, []);


  socket?.off('connect').on("connect", () => {
    console.log('conectado ao socket');
  });

  socket?.off('events').on("events", (data) => {
    console.log(data);
  });

  // Evento de desconexão
  socket?.on('disconnect', (reason) => {
    console.log('Desconectado. Motivo:', reason);
  });

  socket?.off("notificationBack").on('notificationBack', (data) => {
    if (data.type === 'error') {
      toast.error(data.message, {
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
    if (data.type === 'success') {
      toast.done(data.message, {
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
    if (data.type === 'warning') {
      toast.warning(data.message, {
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
    notification('CatTalk', data.message)
    playAudio('./audio/notification.mp3')
  })

  return (
    <div className='home-container'>
      <PrimaryButtonGenerics onClick={() => {
        socket.emit('startConnection', 'teste')
      }}>teste</PrimaryButtonGenerics>
    </div>
  )


}