import './NavbarAdmin.css';
import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../contexts/userData/admin';
import { AuthUser } from '../contexts/authenticationadmin';
import ButtonTheme from './ButtonTheme'
import { ApiBackAdmin, getLocalStorage, setLocalStorage } from '../service/axios';
import IconButton from './IconButton';
import Modal from './Modal';
import CreateNewUserAdmin from './CreateNewUserAdmin';
import setTitleAndFavicon from '../service/setTitleAndFavicon';
import setTheme from '../service/setTheme';
export default function NavbarAdmin() {
  const {
    user,
    setUser

  } = useContext(AdminContext)
  const { logout, userData } = useContext(AuthUser)
  const [buttonTheme, setButtonTheme] = useState(true)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setTitleAndFavicon()
      var headers = {
        Authorization: userData.token
      }
      var responseUser = await ApiBackAdmin.get('admin', { headers: headers }).catch(() => { logout() })
      // console.log(responseUser.data);
      setUser(responseUser?.data)
    }
    fetchData()

  }, []);



  function verifyIfThisUrl(namePath) {
    var url = window.location.pathname.replace('/', "")
    if (namePath === url) { return true }
    else { return false }
  }






  return (

    <div className="navbarContainerAdmin" id='navbarContainerAdmin'>
      <div className='navbar-top'>
        <div className="logo-content">
          <a href="/homeadmin">
            <div className='logo-content-content'>
              <span className='image '>

                {REACT_APP_BRAND === 'FLOWTALK' ?
                  <img src="./img/simbol-outline-flowtalk.png" className='logo-navbar' alt='' /> :
                  <img src="./img/simbol-outline.png" className='logo-navbar' alt='' />}
              </span>

            </div>

          </a>
        </div>
        <ButtonTheme status={buttonTheme} onChange={() => {
          setTheme(buttonTheme, (value) => {
            setButtonTheme(value)
          })
        }} />
      </div>

      <div className='navbar-middle'>
        <ul className='navbar-links'>

          <li className={verifyIfThisUrl('homeadmin') ? 'link-navbaradmin-selected' : 'link-navbaradmin'} onClick={() => { }}>
            <a href='/homeadmin' className='buttonNav'><i className='bx bxs-business' ></i></a>
          </li>
          {
            user?.role === 'superadmin' ?
              <div className="alteradoagora">
                <li className={verifyIfThisUrl('usersadmin') ? 'link-navbaradmin-selected' : 'link-navbaradmin'} onClick={() => { }}>
                  <a href='/usersadmin' className='buttonNav'><i className='bx bxs-user'></i></a>
                </li>

                <li className={verifyIfThisUrl('infosadmin') ? 'link-navbaradmin-selected' : 'link-navbaradmin'} onClick={() => { }}>
                  <a href='/infosadmin' className='buttonNav'>
                    <i className='bx bxs-info-circle' ></i>
                  </a>
                </li>
              </div> : null
          }
        </ul>
      </div>

      <div className="navbar-bottom " style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '6rem', justifyContent: 'space-between' }}>
        <Modal status={modal} title={'Novo Usuário'} onClose={() => { setModal(false) }}>
          {modal ? <CreateNewUserAdmin userData={user} edit onClose={async () => {
            await ApiBackAdmin.get('admin').then((response) => { setUser(response.data) }).catch(() => { logout() })
            setModal(false)
          }} /> : null}
        </Modal>
        <div className='profile-container' onClick={() => setModal(!modal)}>
          <img src="img/profiles/default-other.png" alt='' />
        </div>
        <IconButton size={'small'} onClick={() => logout()}><i className='bx bx-exit'></i></IconButton>
      </div>
    </div>
  )
}