
import './CreateNewUser.css'
import React, { useContext, useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import InputSelect from './InputSelect'
import InputText from './InputText'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import Bar from './Bar'
import Space from './Space'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ring } from '@uiball/loaders'

export default function CreateNewUser({onEnd}) {
    const { setModal, setModalContent, setModalTitle } = useContext(AppContext)
    const [sectors, setSectors] = useState(null)
    useEffect( () => {
        async function fetchData() {
            var responseSectors = await ApiBack.get(`sectors`)
            setSectors(responseSectors.data)
        }
        fetchData()
    }, []);
    function getInformationNewuser() {
        var name = document.getElementById('nameNewUser')
        var secoundName = document.getElementById('secoundNameNewUser')
        var profession = document.getElementById('professionNewUser')
        var gender = document.getElementById('genderNewUser')
        var sector = document.getElementById('sectorNewUser')
        var role = document.getElementById('roleNewUser')
        var login = document.getElementById('loginNewUser')
        var password = document.getElementById('passwordNewUser')


        if (!name.value || !secoundName.value || !gender.value || !sector.value || !role.value || !login.value || !password.value || !profession.value) {
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
        } else {
            var obj = {
                user: {
                    name: name.value.charAt(0).toUpperCase() + name.value.slice(1), //deixa apenas a primeira letra maiúscula
                    lastName: secoundName.value.charAt(0).toUpperCase() + secoundName.value.slice(1),
                    gender: gender.value,
                    profession: profession.value.charAt(0).toUpperCase() + profession.value.slice(1),
                    sectorId: sector.value,
                    profilePic: null,
                    role: role.value
                },
                login: {
                    login: login.value,
                    password: password.value
                }
            }
            ApiBack.post('users', obj).then(() => {
                onEnd()
                setModal(false)
                setModalContent(null)
                setModalTitle(null)
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
    function generateSectorsForSelect(sectors) {
        var data = []
        for (let index = 0; index < sectors.length; index++) {
            if (sectors[index].name !== 'Default') {
                data.push({ name: sectors[index].name, value: sectors[index]._id })
            } else {
                data.push({ name: 'Padrão', value: sectors[index]._id })
            }

        }
        return data
    }
    if (sectors) {
        return (
            <div className="create-new-user-container">
                <div className="create-new-user-header">
                    Adicionar Novo Usuário
                </div>
                <div className="create-new-user-middle">
                    <div className="input-option">
                        <InputText id="nameNewUser" placeholder='Nome' />
                    </div>
                    <div className="input-option">
                        <InputText id="secoundNameNewUser" placeholder='Sobrenome' />
                    </div>
                    <div className="input-option">
                        <InputText id="professionNewUser" placeholder='Cargo' />
                    </div>
                    <div className="input-option">
                        <InputSelect placeholder='Gênero' id="genderNewUser" data={[
                            { name: 'Masculino', value: 'male' },
                            { name: 'Feminino', value: 'female' },
                            { name: 'Outro', value: 'other' }
                        ]} />
                    </div>
                    <div className="input-option">
                        <InputSelect placeholder='Setor' id="sectorNewUser" data={sectors ? generateSectorsForSelect(sectors) : null} />
                    </div>
                    <div className="input-option">
                        <InputSelect placeholder='Permissões' id="roleNewUser" data={[
                            { name: 'Normal', value: 'normal' },
                            { name: 'Administrador', value: 'admin' }
                        ]} />
                    </div>
                    <Space>
                        <Bar />
                    </Space>

                    <div className="input-option">
                        <InputText id="loginNewUser" placeholder='Login' />
                    </div>
                    <div className="input-option">
                        <InputText id="passwordNewUser" placeholder='Senha' />
                    </div>
                </div>

                <div className="create-new-user-footer">
                    <SecoundaryButton onChange={() => { setModal(false) }}>Cancelar</SecoundaryButton>
                    <PrimaryButton onChange={() => { getInformationNewuser() }}>Adicionar</PrimaryButton>
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
