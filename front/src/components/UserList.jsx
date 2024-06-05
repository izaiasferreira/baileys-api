
import './UserList.css'
import React, { useContext, useEffect, useState } from 'react'
import UserForList from './UserForList'
import SectorList from './SectorList'
import CreateNewUser from './CreateNewUser'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import { Ring } from '@uiball/loaders'
import IconButton from './IconButton'
export default function UserList() {
    const { user, socket, setModal, setModalContent, setModalTitle } = useContext(AppContext)
    const [users, setUsers] = useState(null)

    useEffect(() => {
        getUsers()
        return () => { //executa essa função quando o componente é desmontado
            setUsers(null)
        }
    }, []);
    function getUsers() {
        ApiBack.get(`users/more`).then((response) => {
            if (users) setUsers(null)
            setUsers(response.data)
        })
    }
    socket.on('usersUpdate', (users) => {
        setUsers(users)
    })
    if (users) {
        return (
            <div className="user-list-container">
                <div className="user-list-header">
                    <span className='title-users'>
                        Usuários
                    </span>
                    <span className='options-header'>
                        <IconButton onClick={() => { setModalTitle(''); setModalContent(<CreateNewUser onEnd={(value) => { getUsers() }} />); setModal(true) }}>
                            <i className='bx bx-user-plus' ></i>
                        </IconButton>
                        <IconButton onClick={() => { getUsers() }}>
                            <i className='bx bx-sync' ></i>
                        </IconButton>
                    </span>
                </div>
                <div className="user-for-list-body">
                    {
                        users?.length > 1 ?
                            users?.map((userResult) => {
                                if (userResult._id !== user._id) {
                                    return <UserForList
                                        onDelete={(user) => {
                                            var dataUsers = users
                                            var filter = dataUsers.filter(userData => userData._id !== user._id)
                                            setUsers(filter)
                                        }}
                                        key={userResult._id}
                                        user={userResult} />
                                } else {
                                    return null
                                }
                            }) : <span className='noUsers'>Sua empresa ainda não possui outros usuários</span>
                    }
                </div>
            </div>
        )
    } else {
        return (
            <div className="ring-container">
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