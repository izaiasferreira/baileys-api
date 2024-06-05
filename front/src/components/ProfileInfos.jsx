import './Profile.css';
import React, { useEffect, useState } from 'react'

export default function Profile({ onState, user, sectors }) {
    const [userData, setUserData] = useState(null)
    const [sector, setSector] = useState(null)
    const [gender, setGender] = useState(null)
    useEffect(() => {
        setUserData(user)
        var sectorFiltered = sectors.filter(sector => sector._id === user.sectorId)
        setSector(sectorFiltered[0])
        setGender(getGender(user.gender))
        return () => {
            setUserData(null)
        }
    }, [user, sectors]);
    function getGender(gender) {
        if (gender === 'female') { return "Feminino" }
        if (gender === 'male') { return "Masculino" }
        if (gender === 'other') { return "Outro" }
    }

    return (
        <div className="middle-component">
            <div className='middle-title'>
                <h1>Informações</h1>
                <span onClick={() => { onState(true) }}><i className='bx bx-edit'></i></span>
            </div>
            <ul className='profile-options'>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Nome</span>
                    <span className='profile-options-txt'> {`${userData?.name} ${user.lastName}`}</span>
                </li>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Gênero</span>
                    <span className='profile-options-txt'>{gender || "Carregando..."}</span>
                </li>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Setor</span>
                    <span className='profile-options-txt'>{sector?.name !== 'Default' ? sector?.name : 'Padrão' || "Carregando..."}</span>
                </li>
                <li className='profile-options-item'>
                    <span className='profile-options-txt-title' >Cargo</span>
                    <span className='profile-options-txt'>{userData?.profession || "Administrador"}</span>
                </li>
            </ul>
        </div>
    )
}