import React, { useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server';
import IconButton from './IconButton'
import './Video.css'

export default function Video({ url, id }) {
    const [urlState, setUrl] = useState(null)
    useEffect((() => {
        setUrl(url)
    }), [url])
    function controlsVideo() {
        var video = document.getElementById(id)
        if (video?.paused) {
            video.play()
            video.setAttribute('controls', true)
            var icon = document.getElementById(`${id}_id`)
            icon.className = 'display-none'
        }
    }

    function controlsVideoDefault() {
        document.getElementById(id).removeAttribute('controls')
        var play = document.getElementById(`${id}_id`);
        play.className = 'icon-play-video'
    }
    if (urlState) {

        return (
            <div className='files-content-video' onClick={() => { controlsVideo() }}>
                <span className='icon-play-video' id={`${id}_id`}> <IconButton  color='white' size={'large'}> <i className='bx bx-play'></i></IconButton></span>

                <video className='video-file-message' id={id} onPause={() => { controlsVideoDefault() }} onEnded={() => { controlsVideoDefault() }} onError={(event) => {
                    event.target.poster = '/img/video-error.png'
                    var teste = document.getElementById(`${id}_id`)
                    teste.innerHTML = ReactDOMServer.renderToString(<img className='img' src='/img/video-error.png' alt='' />)

                }}>
                    <source src={urlState} type="video/mp4" />
                </video>
            </div>
        )
    } else {
        return null
    }

}