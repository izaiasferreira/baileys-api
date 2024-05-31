import './Profile.css';
import React, { useEffect, useState } from 'react'
import ProfileInfos from './ProfileInfos'
import ProfileInfosEdit from './ProfileInfosEdit'
import { Ring } from '@uiball/loaders';
import { ApiBack } from '../service/axios';


export default function ProfileForNormalUser({ user, status, onUpdate }) {
    const [userData, setUserData] = useState(null)
    const [statusInfos, setStatusInfos] = useState(false)
    const [sectors, setSectors] = useState(null)
    useEffect(() => {
        setUserData(user)
        ApiBack.get(`sectors`).then((sector) => { setSectors(sector.data) })
        return () => {
            setUserData(null)
            setSectors(null)
        }
    }, [user]);
    if (userData && sectors) {
        return (
            <div className='profile-page-container'>
                <div className="profile-page-header">
                    <span className='profile-page-header-back'></span>
                    <img src={userData?.profilePic} alt='Profile' />
                </div>
                <div className="profile-page-middle">
                    {statusInfos === true ?
                        <ProfileInfosEdit
                            mode={true}
                            onUpdate={(userData) => {
                                setUserData(userData)
                                if (onUpdate) onUpdate(userData)
                            }}
                            status={status}
                            user={user}
                            sectors={sectors}
                            onState={(value) => {
                                setStatusInfos(value)
                            }} /> :
                        <ProfileInfos
                            sectors={sectors}
                            user={userData}
                            onState={(value) => { setStatusInfos(value) }}
                        />}
                </div>
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