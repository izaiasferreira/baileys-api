import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiBack, getLocalStorage, setLocalStorage } from "../../service/axios";
import { AdminContext } from "../userData/admin";


const AuthUser = createContext({
    token: undefined,
    user: undefined
})

const AuthProvider = ({ children }) => {

    const { user, setUser } = useContext(AdminContext)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        var user = getLocalStorage('admin')
        setUserData(user)
    }, [])

    async function authenticate(login, password) {
        var response
        await ApiBack.post('admin/login', { login: login, password: password })
            .then(async result => {
                setUserData(result.data)
                setLocalStorage(result.data, 'admin')
            })
            .catch(err => {
                if (err?.response?.status === 404) response = { error: true, message: 'Erro ao fazer login, por favor entre em contato com o suporte.' }
                else response = err.response.data
            })
        return response
    }

    async function logout() {

        if (userData) {
            ApiBack.post(`admin/logout?token=${userData.token}`).catch(() => { console.log('Erro no logout') })
        }

        if (user) setUser(null)
        setUserData(null)
        setLocalStorage(null, 'admin')
    }

    return (
        < AuthUser.Provider value={{ userData, authenticate, logout }}>
            {children}
        </AuthUser.Provider>
    )
}

export { AuthUser, AuthProvider }