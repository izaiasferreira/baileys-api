import React, { useContext } from 'react'
import { AuthUser } from "../contexts/authentication/index";
import Login from '../pages/Login';
import { ApiBack } from '../service/axios';

export default function Protectedlayout({ children }) {
    const { userData } = useContext(AuthUser)

    
    if (!userData) {
        return <Login />
    }

    return children
}