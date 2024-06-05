
import './UserListAdmin.css'
import React, { useContext, useEffect, useState } from 'react'
import UserForList from './UserForList'
import SectorList from './SectorList'
import CreateNewUser from './CreateNewUser'
import { AppContext } from '../contexts/userData'
import { ApiBack, ApiBackAdmin } from '../service/axios'
import { Ring } from '@uiball/loaders'
import IconButton from './IconButton'
import { AdminContext } from '../contexts/userData/admin'
import Modal from './Modal'
import CreateNewUserAdmin from './CreateNewUserAdmin'
import UserAdminForList from './UserAdminForList'
export default function UserListAdmin() {
    const {
        user,
        setUser,
        usersList, setUsersList

    } = useContext(AdminContext)
    const [modal, setModal] = useState(false)


    if (usersList) {
        return (
            <div className="useradmin-list-container">
                <Modal status={modal} title={'Novo Usuário'} onClose={() => { setModal(false) }}>
                    {modal ? <CreateNewUserAdmin onClose={() => { setModal(false) }} /> : null}
                </Modal>
                <div className="useradmin-list-header">
                    <span className='title-users'>
                        Usuários
                    </span>
                    <span className='options-header'>
                        <IconButton onClick={() => { setModal(true) }}>
                            <i className='bx bx-user-plus' ></i>
                        </IconButton>
                        <IconButton onClick={async () => { 
                             var responseConnections = await ApiBackAdmin.get('admin/users')
                             setUsersList(responseConnections?.data)
                        }}>
                            <i className='bx bx-rotate-left' ></i>
                        </IconButton>
                    </span>
                </div>
                <div className="useradmin-list-body">
                    {
                        usersList?.length > 0 ?
                            usersList?.map((userResult) => {
                                if (userResult._id !== user._id) {
                                    return <UserAdminForList
                                        onDelete={(user) => {
                                            var dataUsers = usersList
                                            var filter = dataUsers.filter(userData => userData._id !== user._id)
                                            setUsersList(filter)
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