import './ModelsMessages.css';
import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';
import { ApiBack } from '../service/axios';
import { Ring } from '@uiball/loaders';
import getGeminiResponse from '../service/getGeminiResponse';

export default function ModelsMessages() {
    // const { user, socket, assistants, setAssistants } = useContext(AppContext)
    const [tempatesWhatsappBusiness, setTempatesWhatsappBusiness] = useState(null)


    useEffect(() => {
        async function fetchData() {
            try {
                const responseAssistants = await ApiBack.get('connection/templatesMeta');
                // console.log(responseAssistants.data);
                const data = await Promise.all(responseAssistants.data.map(async (templateWhatsappBusiness) => {
                    if (templateWhatsappBusiness?.error) {
                        templateWhatsappBusiness['dataTranslated'] = await getGeminiResponse(`Traduza esse erro para o português. Deixe a tradução fácil de entender, como uma pessoa leiga no assunto pudesse entender. Deixe datas e horários em português e fáceis de ler, não utilize segundos ou milésimos ao escrever as horas. Não use siglas como PST. Me retorne apenas a tradução. ${templateWhatsappBusiness.data.error.message}`);
                    }
                    return templateWhatsappBusiness;
                }));
                setTempatesWhatsappBusiness(data);
            } catch (error) {
                if (error.response.status === 400) {
                    setTempatesWhatsappBusiness([
                        {
                            connection: {
                                name: 'Sem conexões CLOUD API',
                                id: uuid()
                            },
                            message: '0 templates',
                            dataTranslated: error.response.data.message,
                            error: true
                        }
                    ])
                }
                console.error('Error fetching data:', error.response.status);
            }
        }
        fetchData();
    }, []);
    


    if (tempatesWhatsappBusiness) {
        return (
            <div className="connections-container">
                {tempatesWhatsappBusiness ?
                    tempatesWhatsappBusiness?.map((templateWhatsappBusiness) => {

                        if (templateWhatsappBusiness?.error) {
                            // console.log(templateWhatsappBusiness);
                            return (
                                <div key={templateWhatsappBusiness?.connection?.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <span style={{ fontWeight: '600', fontSize: '15pt', marginBottom: '.2rem', marginLeft: '1rem' }} >
                                        {templateWhatsappBusiness?.connection?.name}
                                    </span>
                                    <span style={{
                                        position: 'absolute',
                                        right: '0',
                                        top: '.2rem',
                                        padding: '.2rem',
                                        backgroundColor: 'var(--danger-color)',
                                        borderRadius: '.2rem',
                                        fontSize: '8pt',
                                        color: 'var(--text-color-two)'
                                    }}>{templateWhatsappBusiness.message}</span>
                                    <span style={{
                                        padding: '.2rem',
                                        borderRadius: '.2rem',
                                        fontSize: '8pt',
                                        color: 'var(--text-color-one)',
                                        maxWidth: '20rem',
                                        marginLeft: '1rem'
                                    }}>{templateWhatsappBusiness?.dataTranslated || 'Possivelmente seu token de acesso expirou.'}</span>

                                </div>
                            )
                        }
                        return (
                            <div key={templateWhatsappBusiness?.connection?.id}>
                                <span style={{ fontWeight: '600', fontSize: '15pt', marginBottom: '1rem', marginLeft: '1rem' }} >
                                    {templateWhatsappBusiness?.connection?.name}
                                </span>
                                {templateWhatsappBusiness?.data?.map((data) => {
                                    return (
                                        <ModelWABusiness key={data.id} data={data} />
                                    )
                                })}

                            </div>
                        )
                    }) : null}
            </div>
        )
    } else {
        return (
            <div className="ring-container" style={{ minWidth: '15rem', height: '15rem', alignItems: 'center', padding: 0 }}>
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

function ModelWABusiness({ data }) {
    const status = {
        'APPROVED': { text: 'APROVADO', color: 'success' },
        'PENDING': { text: 'PENDENTE', color: 'warn' },
        'REJECTED': { text: 'REJEITADO', color: 'danger' },
    }
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--two-color)',
            margin: '.5rem',
            padding: '.5rem',
            borderRadius: '.5rem'
        }} key={data.id} >
            <span>{data.name}</span>
            <span style={{
                color: `var(--${status[data.status]?.color}-color)`,
                padding: '.6rem',
                borderRadius: '50rem',
                backgroundColor: 'var(--four-color)',
                fontFamily: 'Poppins',
                fontSize: '9pt',
                fontWeight: '600'
            }}>
                {status[data.status]?.text}
            </span>

        </div>
    )
}