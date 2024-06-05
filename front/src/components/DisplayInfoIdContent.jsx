
import './DisplayInfoIdContent.css'
import React from 'react'

export default function DisplayInfoIdContent({ id, content, onClick }) {


    return (
        <div className='display-info-id-content-container' onClick={onClick}>
            <div className="content" >
                <div className="display-info-id-content-id">{id} </div>
                <div className="display-info-id-content-content">{content?.length > 35 ? content.substring(0, 80) + '...' : content}</div>
            </div>
        </div>
    )
}