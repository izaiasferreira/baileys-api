import './InputRounded.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRounded({ children, row, minWidth, style }) {
  const [idGroup, setId] = useState(null)


  useEffect(() => {
    setId(uuid())
    return () => {
      setId(null)
    }
  }, [])

  function styleCondition(style, minWidth) {
    if (style) {
      return style

    }
    return !row ?
      { display: 'flex', flexDirection: 'column' }
      :
      { display: 'flex', alignItems: 'flex-end', flexDirection: 'row', flexWrap: 'wrap', height: 'auto', maxWidth: minWidth ? (minWidth * 20) + 'rem' : '20rem' }
  }

  return (
    <div className='input-rounded-container' id={idGroup} style={
      style ?
        style :
        { display: 'flex', alignItems: 'flex-end', flexDirection: 'row', flexWrap: 'wrap', height: 'auto', maxWidth: minWidth ? (minWidth * 20) + 'rem' : '20rem' }
    }>
      {children}
    </div>

  );
}