
import './SectorForList.css'
import React, { useEffect, useState } from 'react'
import DialogBox from './DialogBox'
import { ApiBack } from '../service/axios'
import Bar from './Bar'
import IconButton from './IconButton'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputText from './InputText'
import PrimaryButton from './PrimaryButton'
import SecoundaryButton from './SecoundaryButton'
export default function SectorForList({ sector, onDelete }) {
    const [sectorData, setSectorData] = useState(null)
    const [deleteUserDialog, setDeleteUserDialog] = useState(false)
    const [editState, setEditState] = useState(false)
    useEffect(() => {
        setSectorData(sector)
    }, [setSectorData, sector])

    function editSectorName() {
        var name = document.getElementById(`sectorNameEdit${sectorData?._id}`).value
        var sectorToEdit = { ...sectorData }
        sectorToEdit.name = name
        setSectorData(sectorToEdit)
        ApiBack.put(`sectors?sector=${sectorData._id}`, sectorToEdit).catch(() => {
            toast.error(`Houve um erro ao atualizar o setor, atualize a página e tente novamente.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        })
    }
    if (sector.name !== "Default") {
        return (
            <div>
                <ToastContainer />
                <DialogBox
                    open={deleteUserDialog}
                    text='Deseja excluir este setor?'
                    buttonOneText='Excluir'
                    onButtonOne={() => {
                        ApiBack.delete(`/sectors?id=${sectorData._id}`).catch(() => { })
                        onDelete(sectorData)
                        setDeleteUserDialog(false)
                    }}
                    buttonTwoText='Cancelar'
                    onButtonTwo={() => { setDeleteUserDialog(false) }}
                    onClose={() => { setDeleteUserDialog(false) }}
                />
                <div className="sector-for-list-container" onClick={() => { }}>

                    {
                        !editState ?
                            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div className='sector-for-list-head'>
                                    <div className="sector-for-list-name">
                                        <p className="name">{sectorData?.name}</p>
                                    </div>
                                </div>
                                <div className="buttons">
                                    <IconButton size='small' onClick={() => { setEditState(true) }}><i className='bx bxs-pencil' ></i></IconButton>
                                    <IconButton size='small' onClick={() => { setDeleteUserDialog(true) }}><i className='bx bx-trash' ></i></IconButton>
                                </div>
                            </div> :
                            <div className="edit-container">
                                <InputText id={`sectorNameEdit${sectorData?._id}`} onFocus={true} emoji={true} value={sectorData?.name} style={'clean'} />
                                <div className="buttons">
                                    <SecoundaryButton onChange={() => {
                                        setEditState(false)
                                    }}>Cancelar</SecoundaryButton>
                                    <PrimaryButton onChange={() => {
                                        editSectorName()
                                        setEditState(false)
                                    }}>Salvar</PrimaryButton>
                                </div>
                            </div>
                    }
                </div>
                <Bar />
            </div>
        )
    } else {
        return (
            <div>
                <ToastContainer />
                <div className="sector-for-list-container disable">

                    <div className='sector-for-list-head'>
                        <div className="sector-for-list-name">
                            <p className="name">Padrão</p>
                        </div>
                    </div>
                    <IconButton size='small' onClick={() => {
                        toast.error('Não é possível excluir o setor padrão.', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        })
                    }}><i className='bx bx-block' ></i></IconButton>
                </div>

            </div>
        )
    }

}