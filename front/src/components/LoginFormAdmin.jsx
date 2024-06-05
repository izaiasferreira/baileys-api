import React, { useState, useContext, useEffect } from 'react'
import { AuthUser } from '../contexts/authenticationadmin';
import { Navigate } from 'react-router-dom';
import './LoginFormAdmin.css'
import InputText from './InputText';
import InputPassword from './InputPassword';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import setTitleAndFavicon from '../service/setTitleAndFavicon';
export default function LoginFormAdmin() {
    const { authenticate } = useContext(AuthUser)
    const [isLogged, setIsLogged] = useState(false);
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);

    useEffect(() => {
        setTitleAndFavicon()
        return () => { //executa essa função quando o componente é desmontado
            setIsLogged(null)
            setLogin(null)
            setPassword(null)
        }
    }, []);

    async function loginForm(login, password) {

        if (login && password) {
            authenticate(login, password).then((response) => {
                if (!response?.error) {
                    setIsLogged(true)
                } else {
                    toast.error(response.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        if (!login || !password) {
            toast.error('Campo de login ou senha vazio', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    if (isLogged) {
        return <Navigate to='/homeadmin' />
        // alert('Login efetuado com sucesso!')
    }

    return (

        <div className="loginadmin-form-container">
            {REACT_APP_BRAND === 'FLOWTALK' ? <img src="/img/logo-horizontal-flowtalk.png" alt="" /> : <img src="/img/logo-horizontal.png" alt="" />}
            <div className="loginadmin-form-header">
                <h1>Seja Bem-vindo(a)</h1>
                <h3>Faça seu login para acessar o sistema de gerenciamento.</h3>
            </div>
            <div className="loginadmin-form-middle">
                <InputText
                    onEnter={() => {
                        loginForm(login, password)
                    }}
                    size="large"
                    id="login"
                    placeholder='Login'
                    onChange={(value) => { setLogin(value); }}
                />
                <InputPassword
                    onEnter={(e) => {
                        loginForm(login, password)
                    }}
                    size="large"
                    id="password"
                    placeholder='Senha'
                    onChange={(value) => { setPassword(value); }}
                />
            </div>
            <div className="loginadmin-form-footer">
                <PrimaryButtonGenerics onClick={() => loginForm(login, password)}>Entrar</PrimaryButtonGenerics>
            </div>
            <ToastContainer />
        </div>
    )
}