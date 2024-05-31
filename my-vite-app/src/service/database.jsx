

var teste = [
    {
        type: 'start',
        section: 'main',
        parent: null,
        step: 1,
        indexS: 1,
        index: 1,
        beforeStep: null,
        beforeStepWasOptions: null,
        message: null,
        options: {
            nextStep: 2,
            response: {
                idConversation: null,
                controlId: null,
                fromApp: null,

                msg: null,
                type: {
                    typeMessage: 'image',
                    toShow: false
                },
                response: null,
                from: {
                    client: 'client',
                    name: 'nameClient',
                    connection: 'connection',
                },
                to: 'id',
                file: { url: 'http://127.0.0.1:9000/filesusers/Catbot/fdfaf5d1cb126b284ce4e2344b7077c0-Logo_anima%C3%83%C2%A7%C3%83%C2%A3o_AdobeExpress.gif' },
                text: 'Olá, seja bem-vindo ao nosso atendimento. Me chamo catbot e vou te auxiliar no seu atendimento.',
                read: true,
                hour: '00:00',
                date: 'kjkjkjk'
            }

        }
    },
    {
        type: 'simpleMessage',
        section: 'main',
        parent: null,
        step: 2,
        index: 2,
        beforeStep: 1,
        beforeStepWasOptions: null,
        message: {
            idConversation: null,
            controlId: null,
            fromApp: null,

            msg: null,
            type: {
                typeMessage: 'text',
                toShow: false
            },
            response: null,
            from: {
                client: 'client',
                name: 'nameClient',
                connection: 'connection',
            },
            to: "id",
            file: null,
            text: 'Assim que eu pegar algumas informações vou direcionar você para um atendente.',
            read: true,
            hour: '00:00',
            date: 'kjkjkjk'
        },
        options: {
            nextStep: 3,
        }
    },
    {
        type: 'options',
        section: 'main',
        parent: null,
        step: 3,
        index: 3,
        beforeStep: 2,
        beforeStepWasOptions: null,
        message: {
            idConversation: null,
            controlId: null,
            fromApp: null,

            msg: null,
            type: {
                typeMessage: 'text',
                toShow: false
            },
            response: null,
            from: {
                client: 'client',
                name: 'nameClient',
                connection: 'connection',
            },
            to: "id",
            file: null,
            text: 'Me informa sobre o que você quer falar:',
            read: true,
            hour: '00:00',
            date: 'kjkjkjk'
        },
        negativeMessage: {
            idConversation: null,
            controlId: null,
            fromApp: null,

            msg: null,
            type: {
                typeMessage: 'text',
                toShow: false
            },
            response: null,
            from: {
                client: 'client',
                name: 'nameClient',
                connection: 'connection',
            },
            to: "id",
            file: null,
            text: 'Não entendi sua escolha, por favor escolha apenas uma das opções mostradas.',
            read: true,
            hour: '00:00',
            date: 'kjkjkjk'
        },
        options: [
            {
                name: 'Setor:',
                value: 'Vacinas',
                options: ['vacina', 1],
                nextStep: 4
            },
            {
                name: 'Setor:',
                value: 'Exame Toxicológico',
                options: ['toxicologico', 'exame toxicologico', 'toxicológico', 'exame toxicológico', 2],
                nextStep: 5
            },
            {
                name: 'Setor:',
                value: 'Espermograma',
                options: ['esperma', 'espermograma', 'toxicológico', 'espermo', 3],
                nextStep: 8
            },
        ],
        children: [

            [
                {
                    type: 'options',
                    section: 'xa',
                    parent: 3,
                    step: 4,
                    index: 1,
                    beforeStep: 3,
                    beforeStepWasOptions: {
                        name: 'Setor:',
                        value: 'Vacinas'
                    },
                    message: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Me informa sobre o que você quer falar:',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    negativeMessage: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Qual vacina você deseja aplicar?.',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    options: [
                        {
                            name: 'Vacina:',
                            value: 'COVID-19',
                            options: ['covid', 'covid-19', 'corona', 'corona virus', 'coronavirus', 1],
                            nextStep: 11
                        },
                        {
                            name: 'Vacina:',
                            value: 'Malária',
                            options: ['malaria', 'malária', 2],
                            nextStep: 21
                        }
                    ],
                    children: [

                        [
                            {
                                type: 'input',
                                section: 'xd',
                                parent: 4,
                                step: 11,
                                index: 1,
                                beforeStep: 4,
                                beforeStepWasOptions: {
                                    name: 'Vacina:',
                                    value: 'COVID-19',
                                },
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Maravilha, me informa o seu nome por gentileza?',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Nome',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xd',
                                parent: 4,
                                step: 12,
                                index: 2,
                                beforeStep: 11,
                                beforeStepWasOptions: null,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Agora me informa o sua data de nascimento.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Data de Nascimento',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xd',
                                parent: 4,
                                step: 13,
                                index: 3,
                                beforeStep: 4,
                                beforeStepWasOptions: null,
                                isEnd: true,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    sectorId: 'sd980as9d8a0sd8',
                                    nextStep: null
                                }
                            },
                        ],
                        [
                            {
                                type: 'input',
                                section: 'xe',
                                parent: 4,
                                step: 21,
                                index: 1,
                                beforeStep: 4,
                                beforeStepWasOptions: {
                                    name: 'Vacina:',
                                    value: 'Malária',
                                },
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Maravilha, me informa o seu nome por gentileza?',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Nome',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xe',
                                parent: 4,
                                step: 22,
                                index: 2,
                                beforeStep: 21,
                                beforeStepWasOptions: null,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Agora me informa o sua data de nascimento.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Data de Nascimento',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xe',
                                parent: 4,
                                step: 23,
                                index: 3,
                                beforeStep: 22,
                                beforeStepWasOptions: null,
                                isEnd: true,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    sectorId: 'sd980as9d8a0sd8',
                                    nextStep: null
                                }
                            },
                        ],
                    ]
                }
            ],
            [
                {
                    type: 'input',
                    section: 'xb',
                    parent: 3,
                    step: 5,
                    index: 1,
                    beforeStep: 3,
                    beforeStepWasOptions: {
                        name: 'Setor:',
                        value: 'Exame Toxicológico'
                    },
                    message: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Maravilha, me informa o seu nome por gentileza?',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    options: {
                        name: 'Nome',
                        value: null,
                        nextStep: 3
                    }
                },
                {
                    type: 'input',
                    section: 'xb',
                    parent: 3,
                    step: 6,
                    index: 2,
                    beforeStep: 5,
                    beforeStepWasOptions: null,
                    message: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Agora me informa o sua data de nascimento.',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    options: {
                        name: 'Data de Nascimento',
                        value: null,
                        nextStep: 3
                    }
                },
                {
                    type: 'transfer',
                    section: 'xb',
                    parent: 3,
                    step: 7,
                    index: 3,
                    beforeStep: 6,
                    beforeStepWasOptions: null,
                    isEnd: true,
                    message: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    options: {
                        sectorId: 'sd980as9d8a0sd8',
                        nextStep: null
                    }
                },
            ],
            [
                {
                    type: 'options',
                    section: 'xc',
                    parent: 3,
                    step: 8,
                    index: 1,
                    beforeStep: 3,
                    beforeStepWasOptions: {
                        name: 'Setor:',
                        value: 'Espermograma'
                    },
                    message: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Por qual médico você deseja ser atendido?',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    negativeMessage: {
                        idConversation: null,
                        controlId: null,
                        fromApp: null,

                        msg: null,
                        type: {
                            typeMessage: 'text',
                            toShow: false
                        },
                        response: null,
                        from: {
                            client: 'client',
                            name: 'nameClient',
                            connection: 'connection',
                        },
                        to: "id",
                        file: null,
                        text: 'Não entendi sua escolha, por favor escolha apenas uma das opções mostradas.',
                        read: true,
                        hour: '00:00',
                        date: 'kjkjkjk'
                    },
                    options: [
                        {
                            name: 'Medico:',
                            value: 'Dr. Júlio',
                            options: ['julio', 'júlio', 'julho', 1],
                            nextStep: 41
                        },
                        {
                            name: 'Medico:',
                            value: 'Dra. Laura',
                            options: ['laura', 'laurinha', 2],
                            nextStep: 51
                        },
                        {
                            name: 'Medico:',
                            value: 'Dr. João',
                            options: ['joao', 'joão', 3],
                            nextStep: 61
                        },
                    ],
                    children: [

                        [
                            {
                                type: 'input',
                                section: 'xf',
                                parent: 8,
                                step: 41,
                                index: 1,
                                beforeStep: 8,
                                beforeStepWasOptions: {
                                    name: 'Medico:',
                                    value: 'Dr. Júlio',
                                },
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Maravilha, me informa o seu nome por gentileza?',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Nome',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xf',
                                parent: 8,
                                step: 42,
                                index: 2,
                                beforeStep: 41,
                                beforeStepWasOptions: null,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Agora me informa o sua data de nascimento.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Data de Nascimento',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xf',
                                parent: 8,
                                step: 43,
                                index: 3,
                                beforeStep: 42,
                                beforeStepWasOptions: null,
                                isEnd: true,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    sectorId: 'sd980as9d8a0sd8',
                                    nextStep: null
                                }
                            },
                        ],
                        [
                            {
                                type: 'input',
                                section: 'xg',
                                parent: 8,
                                step: 51,
                                index: 1,
                                beforeStep: 8,
                                beforeStepWasOptions: {
                                    name: 'Medico:',
                                    value: 'Dra. Laura',
                                },
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Maravilha, me informa o seu nome por gentileza?',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Nome',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xg',
                                parent: 8,
                                step: 52,
                                index: 2,
                                beforeStep: 51,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Agora me informa o sua data de nascimento.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Data de Nascimento',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xg',
                                parent: 8,
                                step: 53,
                                index: 3,
                                beforeStep: 52,
                                beforeStepWasOptions: null,
                                isEnd: true,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    sectorId: 'sd980as9d8a0sd8',
                                    nextStep: null
                                }
                            },
                        ],
                        [
                            {
                                type: 'input',
                                section: 'xh',
                                parent: 8,
                                step: 61,
                                index: 1,
                                beforeStep: 8,
                                beforeStepWasOptions: {
                                    name: 'Medico:',
                                    value: 'Dr. João',
                                },
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Maravilha, me informa o seu nome por gentileza?',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Nome',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xh',
                                parent: 8,
                                step: 62,
                                index: 2,
                                beforeStep: 61,
                                beforeStepWasOptions: null,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Agora me informa o sua data de nascimento.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    name: 'Data de Nascimento',
                                    value: null,
                                    nextStep: 3
                                }
                            },
                            {
                                type: 'input',
                                section: 'xh',
                                parent: 8,
                                step: 63,
                                index: 3,
                                beforeStep: 62,
                                beforeStepWasOptions: null,
                                isEnd: true,
                                message: {
                                    idConversation: null,
                                    controlId: null,
                                    fromApp: null,

                                    msg: null,
                                    type: {
                                        typeMessage: 'text',
                                        toShow: false
                                    },
                                    response: null,
                                    from: {
                                        client: 'client',
                                        name: 'nameClient',
                                        connection: 'connection',
                                    },
                                    to: "id",
                                    file: null,
                                    text: 'Vou estar te tranferindo para o setor de Exames Toxicológicos.',
                                    read: true,
                                    hour: '00:00',
                                    date: 'kjkjkjk'
                                },
                                options: {
                                    sectorId: 'sd980as9d8a0sd8',
                                    nextStep: null
                                }
                            },
                        ],
                    ]
                }
            ]
        ]
    }

]

var database = [
    { type: 'message', section: 'xbh', parent: 3, step: 14, indexS: 2, index: 1 },
    { type: 'options', section: 'xbj', parent: 15, step: 8, indexS: 3, index: 1, },
    { type: 'input', section: 'xbb', parent: 3, step: 4, indexS: 1, index: 1 },
    { type: 'message', section: 'xbl', parent: 8, step: 10, indexS: 2, index: 1 },
    { type: 'start', section: 'main', parent: 'main', step: 1, indexS: 1, index: 1 },
    { type: 'transfer', section: 'xbi', parent: 15, step: 7, indexS: 2, index: 1 },
    { type: 'options', section: 'xbh', parent: 3, step: 15, index: 2, },
    { type: 'message', section: 'main', parent: 'main', step: 2, index: 2 },
    { type: 'transfer', section: 'xbk', parent: 8, step: 9, indexS: 1, index: 1 },
    { type: 'message', section: 'xbc', parent: 15, step: 6, indexS: 1, index: 1 },
    { type: 'transfer', section: 'xbb', parent: 3, step: 5, index: 2 },
    { type: 'transfer', section: 'xbm', parent: 8, step: 36, indexS: 1, index: 1 },
    { type: 'options', section: 'main', parent: 'main', step: 3, index: 3, },
    { type: 'transfer', section: 'xbl', parent: 8, step: 31, index: 2 },
]


export default database
