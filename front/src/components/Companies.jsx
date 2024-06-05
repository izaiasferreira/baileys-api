import React, { useContext, useState } from 'react'
import './Companies.css'
import { AdminContext } from '../contexts/userData/admin'
import CompanyOption from './CompanyOption'
import IconButton from './IconButton'
import DialogBoxChildren from './DialogBoxChildren'
import CompanyInfos from './CompanyInfos'
import { ApiBackAdmin } from '../service/axios'
import DialogBox from './DialogBox'
import Space from './Space'

export default function Companies() {
    const {
        companies,
        setCompanies,
        user

    } = useContext(AdminContext)
    const [dialogInfosState, setDialogInfosState] = useState(false)
    const [dialogDataLogin, setDialogDataLogin] = useState(null)
    return (
        <div className="companies-container" >
            <DialogBoxChildren open={dialogInfosState} onClose={() => { setDialogInfosState(false); }}>
                <CompanyInfos create onClose={(response) => {
                    setCompanies(companies => [...companies, response.company])
                    setDialogDataLogin(response)
                    setDialogInfosState(false)
                }} />
            </DialogBoxChildren>
            <DialogBoxChildren
                open={dialogDataLogin !== null ? true : false}
                onClose={() => {
                    setDialogDataLogin(null);
                }}>
                <div style={{ maxWidth: '23rem' }}>

                    Empresa criada com sucesso, anote os dados de acesso do administrador: <p />
                    <Space />
                    <div style={{width:'91%',borderRadius:'.5rem', backgroundColor: 'var(--four-color', padding: '1rem', fontSize: '10pt'}}>
                        <b>Login:</b> {dialogDataLogin?.infos?.userAdmin.login.login}<p />
                        <b>Senha:</b> {dialogDataLogin?.infos?.userAdmin.login.password}
                    </div>
                    <Space />
                    <Space />
                    <p /> <i style={{ fontSize: '10pt' }}>• Copie e salve essas informações, você não poderá mais recupera-las. <p/>• Para sair desta janela, basta clicar fora da mesma.</i>
                </div>
            </DialogBoxChildren>
            <div className="companies-header">
                <span className='title'>Empresas</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => { setDialogInfosState(true); }}><i className='bx bx-plus' ></i></IconButton>
                    <IconButton onClick={async () => {
                        var responseConnections = await ApiBackAdmin.get('admin/companies')
                        setCompanies(responseConnections?.data)
                    }}><i className='bx bx-rotate-left' ></i></IconButton>
                </div>

            </div>
            <div className="companies-content">
                {
                    companies?.map((company) => {
                        return (
                            <CompanyOption key={company._id} company={company} />
                        )
                    })
                }
            </div>
        </div>
    )
}