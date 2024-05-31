
import './CreateNewUserAdmin.css'
import React, { useContext, useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import InputSelect from './InputSelect'
import InputText from './InputText'
import { ApiBackAdmin } from '../service/axios'
import Bar from './Bar'
import Space from './Space'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ring } from '@uiball/loaders'
import { AdminContext } from '../contexts/userData/admin'

export default function CreateNewUserAdmin({ onClose, edit, userData }) {
    const { setUsersList, user } = useContext(AdminContext)
    const [newUser, setNewUser] = useState(null)
    useEffect(() => {
        if (edit) {
            setNewUser({
                name: userData?.name,
                lastName: userData?.lastName,
                profession: userData?.profession,
                gender: userData?.gender,
                role: userData?.role,
                login: null,
                password: null
            })
        } else {
            setNewUser({
                name: null,
                lastName: null,
                profession: null,
                gender: 'male',
                role: 'moderator',
                login: null,
                password: null
            })
        }
    }, []);

    function createNewUser() {
        const { name, lastName, profession, gender, role, login, password } = newUser
        if (
            [name, lastName, profession, gender, role, login, password].includes(null) ||
            [name, lastName, profession, gender, role, login, password].includes('')
        ) {
            toast.warn('Por favor, preencha todos os campos!', {
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
        else {
            var obj = {
                user: {
                    name: name.charAt(0).toUpperCase() + name.slice(1), //deixa apenas a primeira letra maiúscula
                    lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
                    gender: gender,
                    profession: profession.charAt(0).toUpperCase() + profession.slice(1),
                    profilePic: null,
                    role: role
                },
                login: {
                    login: login,
                    password: password
                }
            }
            ApiBackAdmin.post('admin', obj).then((response) => {
                setUsersList(users => [...users, response.data])
                onClose()
            }).catch((err) => {
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })


        }

    }
    function updateUser() {
        const { name, lastName, profession, gender, role, login, password } = newUser
        if (
            [name, lastName, profession, gender, role].includes(null) ||
            [name, lastName, profession, gender, role].includes('')
        ) {
            toast.warn('Por favor, preencha todos os campos!', {
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
        else {
            var obj = login && password ? {
                user: {
                    name: name.charAt(0).toUpperCase() + name.slice(1), //deixa apenas a primeira letra maiúscula
                    lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
                    gender: gender,
                    profession: profession.charAt(0).toUpperCase() + profession.slice(1),
                    profilePic: null,
                    role: role
                },
                login: {
                    login: login,
                    password: password
                }
            } : {
                user: {
                    name: name.charAt(0).toUpperCase() + name.slice(1), //deixa apenas a primeira letra maiúscula
                    lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
                    gender: gender,
                    profession: profession.charAt(0).toUpperCase() + profession.slice(1),
                    profilePic: null,
                    role: role
                }
            }
            if (user?.role === 'superadmin') {
                ApiBackAdmin.put(`admin?id=${userData?._id}`, obj).then(async () => {
                    var responseConnections = await ApiBackAdmin.get('admin/users')
                    setUsersList(responseConnections?.data)
                    onClose()
                }).catch((err) => {
                    toast.error(err.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                })
            }
            if (user?.role === 'moderator') {
                ApiBackAdmin.put(`admin/editModerator?id=${userData?._id}`, obj).then(async () => {
                    onClose()
                }).catch((err) => {
                    toast.error(err.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                })

            }


        }

    }
    if (newUser) {
        return (
            <div className="create-new-user-container">
                <div className="create-new-user-header">
                    {edit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
                </div>
                <div className="create-new-user-middle">
                    <div className="input-option">
                        <InputText id="nameNewUser" placeholder='Nome' value={newUser?.name} onChange={(value) => { setNewUser({ ...newUser, name: value }) }} />
                    </div>
                    <div className="input-option">
                        <InputText id="secoundNameNewUser" placeholder='Sobrenome' value={newUser?.lastName} onChange={(value) => { setNewUser({ ...newUser, lastName: value }) }} />
                    </div>
                    {
                        user?.role === 'superadmin' ?
                            <div className="input-option">
                                <InputText id="professionNewUser" placeholder='Cargo' value={newUser?.profession} onChange={(value) => { setNewUser({ ...newUser, profession: value }) }} />
                            </div> : null
                    }
                    <div className="input-option">
                        <InputSelect placeholder='Gênero' id="genderNewUser" data={[
                            { name: 'Masculino', value: 'male', selected: newUser?.gender === 'male' },
                            { name: 'Feminino', value: 'female', selected: newUser?.gender === 'female' },
                            { name: 'Outro', value: 'other', selected: newUser?.gender === 'other' }
                        ]} onChange={(value) => { setNewUser({ ...newUser, gender: value }) }} />
                    </div>
                    {user?.role === 'superadmin' ?
                        <div className="input-option">
                            <InputSelect placeholder='Permissões' id="roleNewUser" data={[
                                { name: 'Moderador', value: 'moderator', selected: newUser?.role === 'moderator' },
                                { name: 'Super Admin', value: 'superadmin', selected: newUser?.role === 'superadmin' }
                            ]} onChange={(value) => { setNewUser({ ...newUser, role: value }) }} />
                        </div> : null
                    }
                    <Space>
                        <Bar />
                    </Space>

                    <div className="input-option">
                        <InputText id="loginNewUser" placeholder='Login' onChange={(value) => { setNewUser({ ...newUser, login: value.toLowerCase() }) }} />
                    </div>
                    <div className="input-option">
                        <InputText id="passwordNewUser" placeholder='Senha' onChange={(value) => { setNewUser({ ...newUser, password: value }) }} />
                    </div>
                </div>

                <div className="create-new-user-footer">
                    <SecoundaryButton onChange={() => { onClose() }}>Cancelar</SecoundaryButton>
                    <PrimaryButton onChange={() => { edit ? updateUser() : createNewUser() }}>{edit ? 'Editar' : 'Adicionar'}</PrimaryButton>
                </div>
                <ToastContainer />
            </div>
        )
    } else {
        return (
            <div className="ring-container" style={{ minWidth: '15rem', height: '35rem', alignItems: 'center', padding: 0 }}>
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
