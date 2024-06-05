
import React, { useEffect, useState } from 'react';
import './BookmarkForListMessageArea.css';
export default function BookmarkForListMessageArea({ bookmark, active: status, onChange, onEdit, mode }) {
    const [bookmarkData, setBookmarkData] = useState(null)
    const [active, setActive] = useState(null)
    useEffect(() => {
        setBookmarkData(bookmark)
        setActive(status)
        return () => {
            setBookmarkData(null)
            setActive(null)
        }
    }, [bookmark, status, mode, setBookmarkData])




    return (
        <div className="bookmark-container"
            style={{ backgroundColor: bookmarkData?.color, color: bookmarkData?.textColor }}
        >
            <div className='body' onClick={() => {
                setActive(!active)
                onChange({ id: bookmarkData._id, action: !active, delete: false })

            }}>
                {
                    active ?
                        <div className="icon" > <i className='bx bx-check' ></i></div>
                        :
                        <i className='bx bxs-tag'></i>
                }
                <div className="name">{bookmark?.name}</div>
            </div>
        </div >
    )
}