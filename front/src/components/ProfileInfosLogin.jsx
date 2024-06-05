import './Profile.css';
import React, { useContext, useEffect, useState } from 'react'
import { ApiBack } from '../service/axios';
import { AuthUser } from '../contexts/authentication';

export default function ProfileInfosLogin({ onState, user }) {
    const [login, setLogin] = useState(null)
    const { logout } = useContext(AuthUser)
    useEffect(() => {
        ApiBack.get(`users/login?id=${user._id}`).then((response) => {
            setLogin(response.data)
        }).catch(() => {logout()})
    }, [logout, user]);

    return (
        <div className="middle-component">
            <div className='middle-title'>
                <h1>Login</h1>
                <span onClick={() => { onState(true) }}><i className='bx bx-edit'></i></span>
            </div>
            <ul className='profile-options'>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >E-mail</span>
                    <span className='profile-options-txt'>{login}</span>
                </li>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Senha</span>
                    <span className='profile-options-txt'>•••••</span>
                </li>
            </ul>
        </div>
    )
}