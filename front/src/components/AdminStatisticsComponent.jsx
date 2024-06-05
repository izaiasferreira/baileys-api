
import './AdminStatisticsComponent.css'


export default function AdminStatisticsComponent({ classname, valueNumber, text, color }) {
    return (
        <div className='admin-statistics-content'>
            <div className='admin-statistics-header'>
                <i className={`${classname} ${color}`} ></i>
                <span className='number'>{valueNumber}</span>
            </div>
            <div className='admin-statistics-footer'>
                <span className='text'> {text}</span>
            </div>
        </div>
    )

}
