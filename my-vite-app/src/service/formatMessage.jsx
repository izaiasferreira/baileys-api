import { v4 as uuidv4 } from 'uuid';

export default function FormatMessage(id, fromApp, msg, typeMessage, response, toShow, client, nameClient, file, text, connection) {
    var date = new Date();
    let utcString = date.toISOString();
    return {
        idConversation: id,
        controlId: uuidv4(),
        fromApp: fromApp,
        msg: msg,
        type: {
            typeMessage: typeMessage || 'text',
            toShow: toShow
        },
        response: response || null,
        from: {
            client: client,
            name: nameClient,
            connection: connection,
        },
        to: id,
        file: file || null,
        text: text || null,
        read: true,
        date: utcString
    }

}