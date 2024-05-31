
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/userData';
import { ApiBack } from '../service/axios';
import './BookmarkForList.css';
export default function BookmarkForList({ bookmark, active: status, onChange, onEdit, mode }) {

    const { setBookmarks, bookmarks } = useContext(AppContext)
    const [modeState, setModeState] = useState(false)
    const [bookmarkData, setBookmarkData] = useState(null)
    const [active, setActive] = useState(null)
    useEffect(() => {
        setBookmarkData(bookmark)
        setActive(status)
        setModeState(mode)
        return () => {
            setBookmarkData(null)
            setActive(null)
            setModeState(null)
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
            {modeState === false ? <div className="buttons">
                <i className='bx bxs-trash' onClick={() => {
                    var bookmarksData = bookmarks
                    var dataUpdated = bookmarksData.filter(bookmark => bookmark._id !== bookmarkData._id)
                    setBookmarks(dataUpdated)
                    onChange({ id: bookmarkData._id, action: !active, delete: true })
                    ApiBack.delete(`bookmarks?id=${bookmarkData._id}`)
                }}></i>
                <i className='bx bxs-pencil' onClick={() => {
                    onEdit(bookmarkData)
                }}></i>
            </div> : null}
        </div >
    )
}