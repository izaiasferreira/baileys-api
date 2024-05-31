import './Navbar.css';
export default function NavbarLogo({ companyData }) {
  // console.log(REACT_APP_BRAND);
  if (REACT_APP_BRAND === 'FLOWTALK') {
    return (
      <div className='logo-content-content'>
        <span className='image '>
          <img src="./img/simbol-default-flowtalk.png" className='logo-navbar' alt='' />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
          <span className='text'>Flowtalk</span>
          <span className='text'
            style={{
              fontSize: '8pt',
              fontWeight: '500',
              opacity: '.7',
              position: 'absolute',
              bottom: '-.7rem',
              left: '.1rem',
            }}>
            {companyData?.name}
          </span>
        </div>

      </div>
    )
  } else {
    return (
      <div className='logo-content-content'>
        <span className='image '>
          <img src="./img/simbol-default.png" className='logo-navbar' alt='' />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', position: 'relative' }}>
          <span className='text'>CatTalk</span>
          <span className='text'
            style={{
              fontSize: '8pt',
              fontWeight: '500',
              opacity: '.7',
              position: 'absolute',
              bottom: '-.7rem',
              left: '.1rem',
            }}>
            {companyData?.name}
          </span>
        </div>

      </div>
    )
  }
}