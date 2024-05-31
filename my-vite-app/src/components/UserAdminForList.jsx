
import './UserAdminForList.css'
import React, { useContext, useEffect, useState } from 'react'
import DialogBox from './DialogBox'
import Profile from './Profile'
import Bar from './Bar'
import { AdminContext } from '../contexts/userData/admin'
import { ApiBackAdmin } from '../service/axios'
import { AuthUser } from '../contexts/authenticationadmin'
import Modal from './Modal'
import CreateNewUserAdmin from './CreateNewUserAdmin'

export default function UserAdminForList({ user: data, onDelete }) {
    const [userData, setUserData] = useState(null)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [modal, setModal] = useState(false)
    const { logout } = useContext(AuthUser)
    const { setUsersList } = useContext(AdminContext)
    useEffect(() => {
        setUserData(data)
    }, [data]);

    function deleteUser(id) {
        ApiBackAdmin.delete(`admin?id=${id}`).then(async (response) => {
            var responseConnections = await ApiBackAdmin.get('admin/users')
            setUsersList(responseConnections?.data)
        })

    }
    return (
        <div>
            <div className="useradmin-for-list-container" onClick={() => { }}>
                <DialogBox open={deleteUserDialog} text='Deseja excluir este usuário?' buttonOneText='Excluir' onButtonOne={() => {
                    setDeleteUserDialog(false)
                    deleteUser(userData._id)
                }}
                    buttonTwoText='Cancelar' onButtonTwo={() => { setDeleteUserDialog(false) }} onClose={() => { setDeleteUserDialog(false) }} />
                <Modal status={modal} title={'Novo Usuário'} onClose={() => { setModal(false) }}>
                    {modal ? <CreateNewUserAdmin userData={data} edit onClose={() => { setModal(false) }} /> : null}
                </Modal>
                <div className='useradmin-for-list-head'>
                    <div className="img-useradmin-for-list">
                        <img src={userData?.profilePic || './img/profiles/default-other.png'} alt='' />
                    </div>
                    <div className="useradmin-for-list-name-profession">
                        <p className="name">{`${userData?.name} ${userData?.lastName}`}</p>
                        <p className="profession">{userData?.profession} | {userData?.role}</p>
                    </div>
                </div>
                <div className="useradmin-for-list-options">
                    <i onClick={() => {
                        setModal(true)
                    }} className='bx bx-edit'></i>
                    <i onClick={() => { setDeleteUserDialog(true) }} className='bx bx-trash' ></i>
                </div>

            </div>
            <Bar />
        </div>
    )
}