import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server';
import IconButton from './IconButton'
import './EmBreve.css'

export default function EmBreve() {
    return (
        <div className='em-breve-container'>
            <div className="text-breve"> Em breve uma nova funcionalidade</div>
           <img src="./img/cat.gif" alt="cat-animated" />
        </div>
    )
}