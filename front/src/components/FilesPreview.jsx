import './FilesPreview.css';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Ring } from '@uiball/loaders';
import FilesForMessagesExample from './FilesForMessagesExample';
import FilesForMessages from './FilesForMessages';
export default function FilesPreview({ file, onlyShow }) {
    const [fileState, setFile] = useState(null)
    const [filecomp, setFilecomp] = useState(null)
    useEffect(() => {
        setFile(file || null)
    }, [file])

    useEffect(() => {
        if (fileState?.blob) {
            configureContentBlob(fileState?.blob)
        }
        else if (onlyShow && fileState?.file && fileState?.file?.url) {
            configureContentShow(fileState)
        }
        else if (!onlyShow && fileState?.file && !fileState?.url) {
            // console.log('fileState', fileState);
            configureContent({ element: fileState })
        }

    }, [fileState, onlyShow])

    function configureContentShow(file) {
        var url = file?.file?.url
        var type = file?.file?.type
        setFilecomp(<FilesForMessagesExample data={url} type={type} />)
    }
    function configureContent({ element, file }) {
        if (!file && element) file = element?.file?.target?.files[0]
        // console.log('file', file);
        if (file) {
            var index = file?.type?.indexOf('/')
            var type = (file?.type).substring(0, index)
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.addEventListener('load', async (e) => {
                const objectTarget = e.target
                setFilecomp(<FilesForMessagesExample data={objectTarget.result} type={type} />)
            })
        }
    }
    function configureContentBlob(blob) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file'
        const file = new File([blob], 'file', { type: blob.type });
        configureContent({ file: file })
    }
    if (fileState?.file || fileState?.url || fileState?.blob) {
        return (
            <div className="file-preview-container" >
                <div className='content' id='contentFiles'>
                    {filecomp}
                </div>
            </div>
        )
    } else {
        return (
            <div className="ring-container" style={{ minWidth: '15rem', height: '10rem', alignItems: 'center', padding: 0 }}>
                <Ring
                    size={60}
                    lineWeight={5}
                    speed={2}
                    color="blue"
                />
            </div>
        )
    }
}