import './ProfileInfosEdit.css';
import React, { useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton';
import { ApiBack } from '../service/axios';
import SecoundaryButton from './SecoundaryButton';
import InputText from './InputText';
import InputSelect from './InputSelect';
import { Ring } from '@uiball/loaders';

export default function ProfileInfosEdit({ onState, user, sectors, status, onUpdate, mode }) {
    const [userState, setUserState] = useState(null)
    const [sectorsState, setSectors] = useState(null)
    const [modeState, setModeState] = useState(false)
    useEffect(() => {
        setUserState(user)
        setModeState(mode || false)
        setSectors(generateSectorsForSelect(sectors, user.sectorId))
        return () => {
            setSectors(null)
            setUserState(null)
        }
    }, [mode, sectors, user]);

    function updateData() {
        var userData = {...userState}
        var name = document.getElementById('nameUserForUpdate')
        var lastName = document.getElementById('lastNameUserForUpdate')
        var sectorId = document.getElementById('sectorNewUser')
        var profession = document.getElementById('professionUserForUpdate')
        var gender = document.getElementById('genderUserForUpdate')
        var type = document.getElementById('typeUserForUpdate')
        userData.name = name.value.charAt(0).toUpperCase() + name.value.slice(1)
        userData.lastName = lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1)
        userData.sectorId = sectorId.value
        userData.profession = profession?.value.charAt(0).toUpperCase() + profession?.value.slice(1)
        userData.gender = gender?.value
        userData.role = type?.value
        ApiBack.put(`users`, userData)
        onUpdate(userData)
    }
    function updateDataForNormalUser() {
        var userData = userState
        var name = document.getElementById('nameUserForUpdate')
        var lastName = document.getElementById('lastNameUserForUpdate')
        var gender = document.getElementById('genderUserForUpdate')
        userData.name = name.value.charAt(0).toUpperCase() + name.value.slice(1)
        userData.lastName = lastName.value.charAt(0).toUpperCase() + lastName.value.slice(1)
        userData.gender = gender?.value
        ApiBack.put(`users/editProfileNormalUser`, { _id: userData._id, name: userData.name, lastName: userData.lastName, gender: userData.gender })
        onUpdate(userData)
    }
    function generateSectorsForSelect(sectors, sectorDefault) {
        var data = []
        for (let index = 0; index < sectors.length; index++) {
            if (sectors[index].name !== 'Default') {
                data.push({ name: sectors[index].name, value: sectors[index]._id, selected: sectors[index]._id === sectorDefault ? true : false })
            } else {
                data.push({ name: 'Padrão', value: sectors[index]._id, selected: sectors[index]._id === sectorDefault ? true : false })
            }
        }
        return data
    }
    if (sectorsState && userState) {
        return (
            <div className="middle-component">
                <div className='middle-title'>
                    <h1>Informações</h1>
                </div>
                <ul className='profile-options'>
                    <li className='profile-options-item'>

                        <span className='profile-options-txt-title' >Nome</span>
                        <InputText id="nameUserForUpdate" value={userState?.name} />

                    </li>
                    <li className='profile-options-item'>
                        <span className='profile-options-txt-title' >Sobrenome</span>
                        <InputText id="lastNameUserForUpdate" value={userState?.lastName} />
                    </li>
                    <li className='profile-options-item'>
                        <span className='profile-options-txt-title' >Gênero</span>
                        <InputSelect
                            id="genderUserForUpdate"
                            data={[
                                { name: 'Masculino', value: 'male', selected: user.gender === 'male' ? true : false },
                                { name: 'Feminino', value: 'female', selected: user.gender === 'female' ? true : false },
                                { name: 'Prefiro não dizer', value: 'other', selected: user.gender === 'other' ? true : false },
                            ]} />
                    </li>

                    {status === true ? (
                        <>
                            <li className='profile-options-item'>
                                <span className='profile-options-txt-title' >Permissões</span>
                                <InputSelect
                                    id="typeUserForUpdate"
                                    data={[
                                        { name: 'Administrador', value: 'admin', selected: user.role.includes('admin') ? true : false },
                                        { name: 'Normal', value: 'normal', selected: user.role === 'normal' ? true : false }
                                    ]} />
                            </li>
                            <div>
                                <li className='profile-options-item'>
                                    <span className='profile-options-txt-title' >Setor</span>
                                    <InputSelect
                                        placeholder='Setor'
                                        id="sectorNewUser"
                                        data={sectorsState} />
                                </li>
                                <li className='profile-options-item'>
                                    <span className='profile-options-txt-title' >Cargo</span>
                                    <InputText id="professionUserForUpdate" value={userState?.profession} />
                                </li>

                            </div>
                        </>
                    ) : null}
                    <div className='buttons'>
                        <SecoundaryButton onChange={() => {
                            onState(false)
                        }}>Cancelar</SecoundaryButton>
                        <PrimaryButton onChange={(value) => {
                            !modeState ? updateData() : updateDataForNormalUser()
                            onState(value);
                        }}>Salvar</PrimaryButton>
                    </div>
                </ul>
            </div>
        )
    } else {
        return (
            <div
                className="ring-container"
                style={{ minWidth: '15rem', height: '35rem', alignItems: 'center', padding: 0 }}>
                <Ring
                    size={60}
                    lineWeight={5}
                    speed={2}
                    color="blue"
                />
            </div>
        )
    }
}