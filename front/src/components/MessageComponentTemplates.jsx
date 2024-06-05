import React, { useContext, useEffect, useState } from 'react'
import './MessageComponent.css'
import FilesForMessagesExample from './FilesForMessagesExample';
import 'react-toastify/dist/ReactToastify.css';
import parse from 'html-react-parser';
export default function MessageComponentTemplate({ buttons, bodyText, body, header, headerText }) {

    function replaceVariables(str, data) {
        const matches = [...str?.matchAll(/{{(\d+)}}/g)];
        matches?.forEach(match => {
            const val = data[parseInt(match[1]) - 1];
            str = str?.replace(match[0], val !== undefined && val !== null && val !== '' ? val : match[0]);
        });
        return str;
    }
    function formatText(text) {
        var string = text
        if (string && typeof string === 'string') {
            string = string?.replace(/\_(.*?)\_/g, '<i>$1</i>');
            string = string?.replace(/\*(.*?)\*/g, '<b>$1</b>');
            string = string?.replace(/\-(.*?)\-/g, '<u>$1</u>');
            string = string?.replace(/\~(.*?)\~/g, '<s>$1</s>');
            return parse(string)
        }
        return toString(text)
    }
    return (
        <div className="message message-container-attendance"        >
            <div className="message-header">
                <span className='arrow'></span>
            </div>
            <div className="message-middle">
                <div className="message-middle-content">
                    <div className='content'>
                        {header ? <FilesForMessagesExample type={
                            header?.parameters[0]?.type} data={header?.parameters[0]?.type === 'text' ?
                                formatText(replaceVariables(headerText, header?.parameters?.map(param => param?.text))) :
                                header?.parameters[0][header?.parameters[0]?.type].link} />
                            : null
                        }
                        <span className='text-message' style={{ padding: '.2rem' }}>
                            {formatText(replaceVariables(bodyText, body?.parameters?.map(param => param?.text)))}
                        </span>

                    </div>
                </div>
            </div>
        </div >
    )
}