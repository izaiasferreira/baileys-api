import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiBack, getLocalStorage, setLocalStorage } from "../../service/axios";
import { AppContext } from "../userData";
import { deleteDatabase } from '../../service/indexedDB'


const AuthUser = createContext({
    userId: undefined,
    token: undefined,
})

const AuthProvider = ({ children }) => {

    const { user, setUser } = useContext(AppContext)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        var user = getLocalStorage()
        setUserData(user)
    }, [])

    async function authenticate(login, password) {
        var response
        await ApiBack.post('users/login', { login: login, password: password })
            .then(async result => {
                response = { error: false, message: 'Login bem-sucedido.' }
                setUserData(result.data)
                setLocalStorage(result.data)
            })
            .catch(err => {
                if (err?.response?.status === 404) response = { error: true, message: 'Erro ao fazer login, por favor entre em contato com o suporte.' }
                else response = { error: true, message: err.response.data.message }
            })
        return response
    }

    async function logout() {
        var value = getLocalStorage('u')
        if (value?.token) {
            await ApiBack.post('users/logout', {
                headers: {
                    Authorization: value.token
                }
            }).catch(() => { console.log('Erro no logout') })
        }
        // console.log(value);
        if (user) setUser(null)
        setUserData(null)
        setLocalStorage(null)
    }

    return (
        < AuthUser.Provider value={{ userData, authenticate, logout }}>
            {children}
        </AuthUser.Provider>
    )
}

export { AuthUser, AuthProvider }
