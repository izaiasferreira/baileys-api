import './ProfileInfosLoginEdit.css';
import React, { useContext, useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton';
import { ApiBack } from '../service/axios';
import { AuthUser } from '../contexts/authentication';
import SecoundaryButton from './SecoundaryButton';
import InputPassword from './InputPassword';
import InputText from './InputText';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../contexts/userData';
export default function ProfileInfosLoginEdit({ onState, user }) {
    const { companyData } = useContext(AppContext)
    const [loginData, setLoginData] = useState({
        login: null,
        passwordOne: null,
        passwordTwo: null
    })
    useEffect(() => {
        return () => {
            setLoginData(null)
        }
    }, []);

    const { logout } = useContext(AuthUser)
    function verifyLogin(login) {
        var index = login.indexOf('@')
        if (index === -1) {
            return login + '@' + (companyData.name?.replace(/\s/g, '')).toLowerCase()
        } else {
            return login.substring(0, index) + '@' + (companyData.name?.replace(/\s/g, '')).toLowerCase()
        }
    }
    async function updateLogin() {
        if (loginData.passwordOne === loginData.passwordTwo) {
            var obj = { login: loginData.login/* verifyLogin(loginData.login) */ || null, password: loginData.passwordOne || null }
            Object.keys(obj).forEach(key => { //remove valores nulos
                if (obj[key] === null) {
                    delete obj[key];
                }
            });
            ApiBack.put(`users/updateLogin?id=${user?._id}`, obj)
                .then(() => {
                    onState(false)
                    // document.location.reload(true);
                }).catch(() => { logout() })

        } else {
            toast.error('As senhas não são iguais.', {
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

    }
    return (
        <div className="middle-component">
            <ToastContainer />
            <div className='middle-title'>
                <h1>Login</h1>
            </div>
            <form className='profile-options' autoComplete="off">
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Login</span>
                    <InputText id="loginUserUpdate" onChange={(value) => {
                        var loginDataOld = { ...loginData, login: value }
                        setLoginData(loginDataOld)
                    }} />
                </li>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title'>Nova senha</span>
                    <InputPassword id="passwordUserUpdate" onChange={(value) => {
                        var loginDataOld = { ...loginData, passwordOne: value }
                        setLoginData(loginDataOld)
                    }} />
                </li>
                <span className='message-erro-text' id='messageErrorTextPassword'></span>

                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Repita a nova senha</span>
                    <InputPassword id="passwordUserUpdate2" onChange={(value) => {
                        var loginDataOld = { ...loginData, passwordTwo: value }
                        setLoginData(loginDataOld)
                    }} />
                </li>
            </form>
            <div className='buttons'>
                <SecoundaryButton onChange={() => {
                    onState(false)
                }}>Cancelar</SecoundaryButton>
                <PrimaryButton onChange={() => {
                    updateLogin()
                }}>Salvar</PrimaryButton>
            </div>
        </div>
    )
}