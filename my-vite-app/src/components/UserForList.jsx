
import './UserForList.css'
import React, { useContext, useEffect, useState } from 'react'
import DialogBox from './DialogBox'
import Profile from './Profile'
import Bar from './Bar'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import { AuthUser } from '../contexts/authentication'

export default function UserForList({ user, onDelete }) {
    const [userData, setUserData] = useState(null)
    const { logout } = useContext(AuthUser)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const { setModal, setModalContent, setModalTitle } = useContext(AppContext)
    const [sector, setSector] = useState(null)
    useEffect(() => {
        setUserData(user)
        ApiBack.get(`sectors?_id=${user?.sectorId}`)
            .then((sector) => {
                var sectorData = sector.data
                var sectorFiltered = sectorData[sectorData.findIndex(sector => sector._id === user?.sectorId)]
                setSector(sectorFiltered)
            }).catch(() => { logout() })

        return () => { //executa essa função quando o componente é desmontado
            setUserData(null)
            setDeleteUserDialog(null)
            setSector(null)
        }

    }, [logout, user]);
    return (
        <div>
            <div className="user-for-list-container" onClick={() => { }}>
                <DialogBox open={deleteUserDialog} text='Deseja excluir este usuário?' buttonOneText='Excluir' onButtonOne={() => {
                    ApiBack.delete(`users?id=${userData._id}`).catch(() => { })
                    onDelete(userData)
                    setDeleteUserDialog(false)
                }}
                    buttonTwoText='Cancelar' onButtonTwo={() => { setDeleteUserDialog(false) }} onClose={() => { setDeleteUserDialog(false) }} />
                <div className='user-for-list-head'>
                    <div className="img-user-for-list">
                        <img src={userData?.profilePic || './img/profiles/default-other.png'} alt='' />
                    </div>
                    <div className="user-for-list-name-profession">
                        <p className="name">{`${userData?.name} ${userData?.lastName}`}</p>
                        <p className="profession">{userData?.profession} | Setor {sector?.name !== 'Default' ? sector?.name : 'Padrão'}</p>
                    </div>
                </div>
                <div className="user-for-list-options">
                    <i onClick={() => {
                        setModalTitle('Editar usuário');
                        setModalContent(
                            <Profile
                                status={true}
                                user={userData}
                                onUpdate={(userDataUpdate) => {
                                    setUserData(userDataUpdate)
                                }}
                            />
                        ); setModal(true)
                    }} className='bx bx-edit'></i>
                    <i onClick={() => { setDeleteUserDialog(true) }} className='bx bx-trash' ></i>
                </div>

            </div>
            <Bar />
        </div>
    )
}