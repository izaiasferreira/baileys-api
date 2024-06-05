import './home.css'
import { io } from "socket.io-client";
import React, { useEffect, useContext, useState } from 'react'
import { AppContext } from '../contexts/userData';
import { toast } from 'react-toastify';
import notification from '../service/notificationsBack';
import playAudio from '../service/playAudio';

import PrimaryButtonGenerics from '../components/PrimaryButtonGenerics'
import { v4 as uuidV4 } from 'uuid'
import InstancesForList from '../components/InstancesForList';
import IconButton from '../components/IconButton';
export default function Home() {
  const {
    socket,
    setSocket

  } = useContext(AppContext)
  const [instances, setInstances] = useState([])
  const url = window.location.href
  // const url = `http://localhost:3001`
  useEffect(() => {
    setSocket(io(url, {
      reconnection: true,        // Habilita reconexão automática
      reconnectionAttempts: Infinity,   // Número máximo de tentativas de reconexão
      reconnectionDelay: 1000,   // Atraso entre as tentativas de reconexão (em milissegundos)
      reconnectionDelayMax: 2000,// Atraso máximo entre as tentativas de reconexão (em milissegundos)
      timeout: 2000,             // Tempo limite para reconexão (em milissegundos)
    }
    ))
  }, []);


  socket?.off('connect').on("connect", () => {
    socket.emit('getInstances', (data) => {
      setInstances(data)
    })
  });

  socket?.off('events').on("events", (data) => {
    if (data.event === 'connection.update' || data.event === 'qrcode.update') {
      var instancesCopy = [...instances]
      const index = instances.findIndex(i => i.id === data.data.id)
      instancesCopy[index] = data.data
      setInstances(instancesCopy)
    }
  });

  socket?.off('updateInstances').on("updateInstances", (data) => {
    setInstances(data)
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
      <div className="header">
        <h2>Conexões</h2>
        <IconButton
          onClick={() => {
            socket.emit('createInstance', uuidV4(), (instances) => {
              setInstances(instances)
            })
          }}>
          <i className='bx bx-plus'></i>
        </IconButton>
      </div>
      <div className="body">
        {instances?.map((instance) => {
          return <InstancesForList
            key={instance.id}
            instance={instance}
            setInstances={(data) => {
              setInstances(data)
            }}
          />
        })}
      </div>
    </div>
  )


}