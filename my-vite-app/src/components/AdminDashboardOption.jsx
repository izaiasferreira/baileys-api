
import './AdminDashboardOption.css'

export default function AdminDashboardOption({ children, style, title }) {
    return (
        <div className="admin-dashboar-option" >
            {
                title ?
                    <span className='title'>
                        {title}
                    </span> :
                    null
            }
            <div className="content-option" style={style ? style : {}}>
                {children}
            </div>
        </div >
    )
}