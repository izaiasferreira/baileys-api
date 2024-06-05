import './CompanyOption.css';
import React, { useState, useEffect, useContext } from 'react'
import Bar from './Space';
import DialogBox from './DialogBox';
import { ApiBack } from '../service/axios';
import PrimaryButtonGenerics from './PrimaryButtonGenerics';
import { AppContext } from '../contexts/userData';
import DialogBoxChildren from './DialogBoxChildren';
import QRcode from './QRCode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from './IconButton';
import TypeAssistant from './TypeAssistant';
import { Ring } from '@uiball/loaders';
import { Waveform } from '@uiball/loaders'
import { deleteDatabase } from '../service/indexedDB';
import { backUrl } from '../service/backUrl';
import InputText from './InputText';
import OutputCopyText from './OutputCopyText';
import CompanyInfos from './CompanyInfos';


export default function CompanyOption({ company }) {
    const [dialogInfosState, setDialogInfosState] = useState(false)

    return (
        <div className="company-option-container" >
            <ToastContainer />
            <DialogBoxChildren open={dialogInfosState} onClose={() => { setDialogInfosState(false); }}>
                <CompanyInfos companyData={company} onClose={() => { setDialogInfosState(false); }} />
            </DialogBoxChildren>
            <div className="button-edit" style={{ display: 'flex', alignItems: 'center' }} >
                <IconButton onClick={() => { setDialogInfosState(true); }}>
                    <i className='bx bxs-cog'></i>
                </IconButton>


            </div>

            <div className="header">
                <div className="icon" style={true ? { color: 'var(--tree-color)' } : { color: 'var(--five-color)' }}><i className='bx bxs-business'></i></div>
            </div>
            <Bar />
            <div className="body">
                <div className="name" >{company?.name} </div>
                <div className="info" >{company?._id} </div>
                <div className="info" >{company?.plan || 'Sem plano definido'} </div>
            </div>
            <div className="footer">

            </div>
        </div >
    )
}
