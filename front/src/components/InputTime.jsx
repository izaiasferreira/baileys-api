import './InputTime.css';
import React, { useState } from 'react'
import { useEffect } from 'react';

export default function InputTime({ id, onChange, dataDefault, placeholder, disabled }) {
  const [idState, setIdState] = useState(null)
  // const [defaultValueState, setDefaultValueState] = useState('')
  // useEffect(() => {
  //   // console.log(dataDefault);
  //   // setIdState(id)
  //   // var date = new Date(dataDefault)
  //   // setDefaultValueState(`${date.getHours() > 9 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()}`)
  //   // return () => {
  //   //   setIdState(null)
  //   // }
  // }, [dataDefault, id])


  return (
    <div className='input-time-container'>
      {placeholder ? <label htmlFor={idState} >{placeholder}</label> : null}
      {!disabled ?
        <input
          value={dataDefault}
          type="time"
          name={idState} id={idState}
          onChange={(event) => {
            var time = event.target.value
            if (/^\d{2}:\d{2}$/.test(time)) {
              time = `${event.target.value}:00`
              var date = new Date()
              time = time.split(':')
              date.setHours(time[0])
              date.setMinutes(time[1])
              date.setSeconds(time[2])
              onChange(date.toString())
              // setDefaultValueState(date.toString())
            }
          }} /> :
        <input
          style={{ opacity: 0.5 }}
          disabled
          value={dataDefault}
          type="time"
          name={idState} id={idState}
          onChange={(event) => {
            var time = event.target.value
            if (/^\d{2}:\d{2}$/.test(time)) {
              time = `${event.target.value}:00`
              var date = new Date()
              time = time.split(':')
              date.setHours(time[0])
              date.setMinutes(time[1])
              date.setSeconds(time[2])
              onChange(date.toString())
              // setDefaultValueState(date.toString())
            }
          }} />
      }
    </div>

  );
}