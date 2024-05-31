import './NewBookmark.css';
import React, { useContext, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';
import { ApiBack } from '../service/axios';
import PrimaryButton from './PrimaryButton';
import SecoundaryButton from './SecoundaryButton';
import InputText from './InputText';
import { AppContext } from '../contexts/userData';
import BookmarkForExample from './BookmarkForExample';
import InputRounded from './InputRounded';
import InputRoundedOptionChildren from './InputRoundedOptionChildren';
import BookmarkForChose from './BookmarkForChose';
import Bar from './Bar';
import Space from './Space';

export default function NewBookmark({ onClose, actionAndData }) {
    const { bookmarks, setBookmarks } = useContext(AppContext)
    const [name, setName] = useState(null)
    const [color, setColor] = useState(null)
    const [textColor, setTextColor] = useState(null)
    const [emoji, setEmoji] = useState(null)
    const [colors] = useState([
        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#D94F04' },
        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#8C031C' },

        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#6BBE49' },
        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#377120' },

        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#BE49B4' },
        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#711569' },

        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#056CF2' },
        { emogi: '🐱', colorText: '#FFFFFF', backgroundColor: '#4631A8' },
        
        { emogi: '🍓', colorText: '#7c0000', backgroundColor: '#ff9f9f' },
        { emogi: '🥝', colorText: '#005e0d', backgroundColor: '#94ffa6' },
        { emogi: '🫐', colorText: '#003e89', backgroundColor: '#97c1ff' },
        { emogi: '🍇', colorText: '#410575', backgroundColor: '#d599ff' },
        { emogi: '🐱', colorText: '#006d58', backgroundColor: '#99ffeb' },
        { emogi: '🌽', colorText: '#896f00', backgroundColor: '#ffefae' },
        { emogi: '🍊', colorText: '#994602', backgroundColor: '#ffc999' },
        { emogi: '🍒', colorText: '#68035a', backgroundColor: '#ff99e9' },
    ])
    useEffect(() => {
        if (actionAndData?.action === 'new') {
            setName('Nome do Marcador')
            setColor('#232740')
            setTextColor('white')
            // setEmoji('🐱')
        }
        if (actionAndData?.action === 'update') {
            setName(actionAndData?.bookmark.name)
            setColor(actionAndData?.bookmark.color)
            setTextColor(actionAndData?.bookmark.textColor)
            setEmoji(actionAndData?.bookmark.emoji)
        }
        return () => {
            setName(null)
            setTextColor(null)
            setColor(null)
            setEmoji(null)
        }
    }, [actionAndData,])
    useEffect(() => {
        if (actionAndData?.action === 'new') {
            setName('Nome do Bookmark')
            setColor('#232740')
            setTextColor('white')
            // setEmoji('🐱')
        }
        if (actionAndData?.action === 'update') {
            setName(actionAndData?.bookmark.name)
            setColor(actionAndData?.bookmark.color)
            setTextColor(actionAndData?.bookmark.textColor)
            setEmoji(actionAndData?.bookmark.emoji)
        }
    }, [actionAndData])
    function addNewBookmark() {
        var data = { name: name, color: color, textColor: textColor, emoji: emoji, controlId: uuid() }
        // var bookmarksData = bookmarks
        // bookmarksData.push(data)
        // setBookmarks(bookmarksData)
        ApiBack.post('bookmarks', data).then((response) => {
            // console.log(response.data);
            // console.log(response.data);
            // var dataBookmarks = bookmarks
            // var index2 = dataBookmarks.findIndex(bookmark => bookmark.controlId === data.controlId)
            // dataBookmarks[index2] = response.data
            setBookmarks(response.data)
        })

    }
    function updateBookmark(id) {
        var data = { name: name, color: color, textColor: textColor, emoji: emoji, controlId: uuid() }
        var bookmarksData = bookmarks
        var index = bookmarksData.findIndex(bookmark => bookmark._id === id)
        bookmarksData[index].name = data.name
        bookmarksData[index].color = data.color
        bookmarksData[index].textColor = data.textColor
        bookmarksData[index].emoji = data.emoji
        setBookmarks(bookmarksData)
        ApiBack.put(`bookmarks?id=${id}`, data)
    }
    return (
        <div className="new-bookmark-container">

            <div className="new-bookmark-content-header">
                <div className="presentation">
                    <Space />
                    <BookmarkForExample emoji={emoji} textColor={textColor} color={color} name={name} />
                    <Space />
                </div>
                <Bar />
                <Space />
                <div className="title-inputs-bookmarks">
                    Digite o nome do Marcador
                </div>
                <InputText
                    onChange={(value) => { setName(value) }}
                    id="bookmarkName"
                    placeholder="Nome do Marcador"
                />
                <Space />
                <div className="title-inputs-bookmarks">
                    Escolha uma cor
                </div>
                <InputRounded key={uuid()} row={true} maxcl={4}>
                    {colors.map((data) => {
                        function compare(data, color, textColor, emoji) {
                            if (data.emogi === emoji && data.colorText === textColor && data.backgroundColor === color) {
                                return true
                            }
                            return false
                        }
                        return (
                            <InputRoundedOptionChildren key={uuid()} checked={compare(data, color, textColor, emoji)} name={'colors'} value={data} onChange={(value) => {
                                setColor(value.backgroundColor)
                                setTextColor(value.colorText)
                                // setEmoji(value.emogi)
                            }}>
                                <BookmarkForChose key={uuid()} color={data.backgroundColor} textColor={data.colorText} text={data.emogi} />
                            </InputRoundedOptionChildren>
                        )
                    })}
                </InputRounded>

            </div>
            <Space />
            <div className="buttons">
                <SecoundaryButton onChange={() => { onClose() }}>Cancelar</SecoundaryButton>
                <PrimaryButton onChange={() => {
                    var inputText = document.getElementById('bookmarkName')
                    actionAndData?.action === 'new' ? addNewBookmark() : updateBookmark(actionAndData?.bookmark?._id)
                    inputText.value = ""
                    onClose()
                }}>{actionAndData?.action === 'new' ? "Adicionar" : "Atualizar"}
                </PrimaryButton>
            </div>
        </div>
    )
}