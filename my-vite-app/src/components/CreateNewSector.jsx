
import './CreateNewSector.css'
import React, { useContext, useEffect, useState } from 'react'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
import { AppContext } from '../contexts/userData'
import { ApiBack } from '../service/axios'
import { AuthUser } from '../contexts/authentication'
import SectorList from './SectorList'
import InputText from './InputText'
import { ToastContainer, toast } from 'react-toastify'
export default function CreateNewSector({ onClose }) {
    const [sectorState, setSectorState] = useState(null)
    const { setModal, setModalContent } = useContext(AppContext)
    const { logout } = useContext(AuthUser)

    useEffect(() => {
        return () => {
            setSectorState(null)
        }
    }, [])
    async function newSector() {
        if (sectorState) {
            await ApiBack.post('sectors', { name: sectorState }).catch(() => { logout() })
            onClose()
        } else {
            toast.error("Por favor digite o nome do setor.", {
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
        <div className="create-new-sector-container">
            <ToastContainer />
            <div className="create-new-sector-header">
                Adicionar Novo Setor
            </div>
            <div className="create-new-sector-middle">
                <InputText
                    onFocus={true}
                    id="nameNewSector"
                    placeholder='Nome do Setor'
                    onChange={(e) => { setSectorState(e) }}
                    onEnter={newSector}
                />
            </div>
            <div className="create-new-sector-footer">
                <SecoundaryButton onChange={onClose}>Cancelar</SecoundaryButton>
                <PrimaryButton onChange={newSector}>Adicionar</PrimaryButton>
            </div>
        </div>
    )
}
