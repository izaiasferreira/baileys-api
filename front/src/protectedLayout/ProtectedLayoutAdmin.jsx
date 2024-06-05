import React, { useContext } from 'react'
import { AuthUser } from "../contexts/authenticationadmin/index";
import { ApiBack } from '../service/axios';
import LoginAdmin from '../pages/LoginAdmin';

export default function Protectedlayout({ children }) {
    const { userData } = useContext(AuthUser)

    if (!userData) {
        return <LoginAdmin />
    }

    return children
}