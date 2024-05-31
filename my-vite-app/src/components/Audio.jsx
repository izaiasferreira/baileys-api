import React, { useEffect, useState } from 'react'
import './Audio.css'
import Slider from '@mui/material/Slider';
export default function FilesForMessages({ url, id }) {
    const [progress, setProgress] = useState(0)
    const [audio, setAudio] = useState(null)
    const [duration, setDuration] = useState('00:00')
    const [playbackRate, setPlaybackRate] = useState(1)

    useEffect(() => {
        var newAudio = new Audio(url)
        setAudio(newAudio)
        return () => {
            setAudio(null)
            setDuration(null)

        }
    }, [url]);
    audio?.addEventListener('loadedmetadata', (e) => {
       
        if (e.target.duration !== Infinity) {
            setDuration(formatSecondsAsTime(e.target.duration))
        }else{
            setDuration('00:00')
        }
    });
    audio?.addEventListener('ended', (e) => {
        resetControls()
    });
    function controls(audio) {
        var icon = document.getElementById(`${id}audio-icon-play`)
        var time = document.getElementById(`${id}-text`)
        audio.ontimeupdate = () => {
            time.innerText = formatSecondsAsTime(audio.currentTime)
            setProgress((audio.currentTime + .25) / audio.duration * 100)
        }
        if (audio.paused) {
            audio.play()
            icon.className = 'bx bx-pause'
        } else {
            audio.pause()
            icon.className = 'bx bx-play'
        }
    }

    const currentTimeFromPercentage = (audio, percentage) => {
        // console.log(percentage, audio);
        audio.pause()
        const progress = percentage / 100;
        const currentTime = progress * audio.duration;
        audio.currentTime = currentTime
        // return currentTime;
    };

    function togglePlaybackSpeed(audio) {
        if (audio.playbackRate === 1) {
            audio.playbackRate = 1.5;
        } else if (audio.playbackRate === 1.5) {
            audio.playbackRate = 2;
        } else {
            audio.playbackRate = 1;
        }
    }

    function formatSecondsAsTime(secs) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));

        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }

        return min + ':' + sec;
    }
    function resetControls() {
        var icon = document.getElementById(`${id}audio-icon-play`);
        var time = document.getElementById(`${id}-text`)
        if (icon) icon.className = 'bx bx-play'
        setProgress(0)
        if (time) time.innerText = duration
    }
    return (
        <div className='content-audio'>
            <div className='audio-icon-play' onClick={() => { controls(audio) }}> <i id={`${id}audio-icon-play`} className='bx bx-play'></i></div>
            <div className='audio-progressbar' id={`${id}-audio-progressbar`}>
                <Slider
                    size="small"
                    defaultValue={0}
                    value={progress}
                    aria-label="Small"
                    onChange={(data) => {
                        currentTimeFromPercentage(audio, data?.target?.value)
                    }}
                />
            </div>
            <div className='time-audio'>
                <span className='text' id={`${id}-text`}> {duration} </span>
            </div>
            {!audio?.paused ? <div className='audio-playbackrate' onClick={() => { togglePlaybackSpeed(audio) }}>
                {audio?.playbackRate}x
            </div> : null

            }
        </div>
    )

}