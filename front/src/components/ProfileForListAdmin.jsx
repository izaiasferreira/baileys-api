import './Profile.css';
import React, { useState } from 'react'
import ProfileInfos from './ProfileInfos'
import ProfileInfosLogin from './ProfileInfosLogin'
import ProfileInfosEdit from './ProfileInfosEdit'
import ProfileInfosLoginEdit from './ProfileInfosLoginEdit'


export default function ProfileForListAdmin({user}) {
    const [statusInfos, setStatusInfos] = useState(false)
    const [statusInfosLogin, setStatusInfosLogin] = useState(false)
    return (
        <div className='profile-page-container'>
            <div className="profile-page-header">
                <span className='icon-edit'> <i className='bx bxs-pencil'></i></span>
                <span className='profile-page-header-back'></span>
                <img src={user.profilePic} alt=""/>
            </div>
            <div className="profile-page-middle">
                {statusInfos === true ? <ProfileInfosEdit user={user} functionState={(value)=>{setStatusInfos(value)}} /> : <ProfileInfos user={user} functionState={(value)=>{setStatusInfos(value)}}/>}
                {
                    user.role.includes('admin') ? statusInfosLogin === true ? <ProfileInfosLoginEdit functionState={(value)=>{setStatusInfosLogin(value)}} /> : <ProfileInfosLogin functionState={(value)=>{setStatusInfosLogin(value)}}/>: null
                }

            </div>
        </div>
    )
}