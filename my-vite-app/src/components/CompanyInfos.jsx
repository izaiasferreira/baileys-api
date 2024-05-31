import './CompanyInfos.css';
import React, { useContext, useEffect, useState } from 'react'
import ProfileInfos from './ProfileInfos'
import ProfileInfosLogin from './ProfileInfosLogin'
import ProfileInfosEdit from './ProfileInfosEdit'
import ProfileInfosLoginEdit from './ProfileInfosLoginEdit'
import { Ring } from '@uiball/loaders';
import { ApiBack, ApiBackAdmin } from '../service/axios';
import InputText from './InputText';
import InputTextArea from './InputTextArea';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import InputRounded from './InputRounded';
import Button from './Button';
import InputNumber from './InputNumber';
import ButtonModel from './ButtonModel';
import { AdminContext } from '../contexts/userData/admin';
import DialogBox from './DialogBox';
import Space from './Space';


export default function CompanyInfos({ companyData, onClose, create }) {
    const [companyInfos, setCompanyInfos] = useState(create ? { maxConnections: 1, maxAssistants: 1, maxUsers: 3 } : null)
    const [companyDataState, setCompanyDataState] = useState(create ? { name: '', description: '', cnpj: '', mailOfPersonResponsible: '', plan: 'basic' } : null)
    const [dialogDelete, setDialogDelete] = useState(false)
    const {
        user,
        companies,
        setCompanies,

    } = useContext(AdminContext)

    useEffect(() => {
        if (!create) {
            setCompanyDataState(companyData)
            ApiBackAdmin.get(`admin/informations?id=${companyData?._id}`).then((sector) => { setCompanyInfos(sector.data) })
        }
        return () => {
            setCompanyInfos(null)
            setCompanyDataState(null)
        }
    }, [companyData]);

    const stylePlans = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '.5rem',
        minWidth: '4rem',
        height: '2rem',
    }
    const styleOptions = {
        display: 'flex',
        alignItems: 'center',
        padding: '.5rem',
    }
    const styleTitles = {
        fontSize: '14pt',
        fontWeight: '700',
        padding: '.5rem'
    }
    function saveInfos() {
        ApiBackAdmin.put(`admin/company?id=${companyData?._id}`, { company: companyDataState, infos: companyInfos }).then((response) => {
            var companyResponse = response.data.company
            var companiesCopy = JSON.parse(JSON.stringify(companies))
            var index = companiesCopy.findIndex(company => company._id === companyResponse?._id)
            companiesCopy[index] = companyResponse
            setCompanies(companiesCopy)
            if (onClose) onClose()
        })
    }
    function createCompany() {
        ApiBackAdmin.post(`admin/company`, { company: companyDataState, infos: companyInfos }).then((response) => {
            // console.log(response.data);
            if (onClose) onClose(response.data)
        })
    }

    function deleteCompany() {
        ApiBackAdmin.delete(`admin/company?id=${companyDataState?._id}`).then(() => {
            var companiesCopy = JSON.parse(JSON.stringify(companies))
            var filter = companiesCopy.filter(company => company._id !== companyDataState?._id)
            setCompanies(filter)
            if (onClose) onClose()
        })
    }

    function setPlanInfos(plan) {
        if (plan === 'basic') {
            setCompanyInfos({ ...companyInfos, maxConnections: 1, maxAssistants: 4, maxUsers: 3 })
        }
        if (plan === 'essentials') {
            setCompanyInfos({ ...companyInfos, maxConnections: 2, maxAssistants: 6, maxUsers: 5 })
        }
        if (plan === 'pro') {
            setCompanyInfos({ ...companyInfos, maxConnections: 3, maxAssistants: 8, maxUsers: 10 })
        }
        
    }

    return (
        <div className='company-infos-container'>
            <Space />
            <DialogBox
                open={dialogDelete}
                text='Tem certeza que deseja excluir esta empresa? Todos os dados desta empresa serão excluídos permanentemente.'
                onClose={() => { setDialogDelete(false) }}
                buttonOneText={'Excluir'}
                buttonTwoText={'Cancelar'}
                onButtonOne={() => { deleteCompany() }}
                onButtonTwo={() => { setDialogDelete(false) }}
            ></DialogBox>
            <div className="title" style={styleTitles}>Informações gerais</div>
            {!create ? <Button status={companyInfos?.status} placeholder={'Status da empresa'} /> : null}
            <InputText value={companyDataState?.name} placeholder='Nome da empresa' onChange={(value) => { setCompanyDataState({ ...companyDataState, name: value }) }}></InputText>
            <InputText value={companyDataState?.cnpj} placeholder='CNPJ da empresa' onChange={(value) => { setCompanyDataState({ ...companyDataState, cnpj: value }) }}></InputText>
            <InputText value={companyDataState?.mailOfPersonResponsible} placeholder='E-mail' onChange={(value) => { setCompanyDataState({ ...companyDataState, mailOfPersonResponsible: value }) }}></InputText>
            <InputTextArea value={companyDataState?.description} placeholder='Descricão da empresa' onChange={(value) => { setCompanyDataState({ ...companyDataState, description: value }) }}></InputTextArea>
            <div className="title" style={styleTitles}>Plano</div>
            <InputRounded style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--two-color)',
                borderRadius: '.3rem',
                height: '3rem'
            }}>
                <InputRoundedOptionChildren name='companyplan' balls={false} value={'basic'} checked={companyDataState?.plan === 'basic'}
                    onChange={(value) => {
                        setCompanyDataState({ ...companyDataState, plan: value });
                        setPlanInfos(value)
                    }}>
                    <div style={stylePlans} >
                        Basic
                    </div>
                </InputRoundedOptionChildren>
                <InputRoundedOptionChildren name='companyplan' balls={false} value={'essentials'} checked={companyDataState?.plan === 'essentials'}
                    onChange={(value) => {
                        setCompanyDataState({ ...companyDataState, plan: value });
                        setPlanInfos(value)
                    }}>
                    <div style={stylePlans} >
                        Essentials
                    </div>
                </InputRoundedOptionChildren>
                <InputRoundedOptionChildren name='companyplan' balls={false} value={'pro'} checked={companyDataState?.plan === 'pro'}
                    onChange={(value) => {
                        setCompanyDataState({ ...companyDataState, plan: value });
                        setPlanInfos(value)
                    }}>
                    <div style={stylePlans} >
                        Pro
                    </div>
                </InputRoundedOptionChildren>
                <InputRoundedOptionChildren name='companyplan' balls={false} value={'custom'} checked={companyDataState?.plan === 'custom'}
                    onChange={(value) => {
                        setCompanyDataState({ ...companyDataState, plan: value });
                        setPlanInfos(value)
                    }}>
                    <div style={stylePlans} >
                        Personalizado
                    </div>
                </InputRoundedOptionChildren>
            </InputRounded>
            {/* Infos */}
            <div className="title" style={styleTitles}>Informações</div>
            <div style={styleOptions}>
                Quantidade de Usuários  <InputNumber disabled={companyDataState?.plan !== 'custom'} dataDefault={companyInfos?.maxUsers} onChange={(value) => { setCompanyInfos({ ...companyInfos, maxUsers: parseInt(value) }) }} min={0} />
            </div>
            <div style={styleOptions}>
                Quantidade de Assistentes  <InputNumber disabled={companyDataState?.plan !== 'custom'} dataDefault={companyInfos?.maxAssistants} onChange={(value) => { setCompanyInfos({ ...companyInfos, maxAssistants: parseInt(value) }) }} min={0} />
            </div>
            <div style={styleOptions}>
                Quantidade de Conexões  <InputNumber disabled={companyDataState?.plan !== 'custom'} dataDefault={companyInfos?.maxConnections} onChange={(value) => { setCompanyInfos({ ...companyInfos, maxConnections: parseInt(value) }) }} min={0} />
            </div>
            <ButtonModel onClick={() => {
                !create ? saveInfos() : createCompany()

            }}>{!create ? 'Salvar' : 'Criar'}</ButtonModel>
            {!create && user?.role === 'superadmin' ? <ButtonModel type='clean-danger' onClick={() => {
                setDialogDelete(true)
            }}>Excluir Empresa</ButtonModel> : null}
        </div>
    )
}