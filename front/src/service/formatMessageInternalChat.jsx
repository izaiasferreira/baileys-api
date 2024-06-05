export default function FormatMessageInternalChat({ roomId, typeMessage, response, file, text, userId, nameUser, companyId }) {
    var date = new Date();
    let utcString = date.toISOString();
    return {
        roomId: roomId,
        response: response,
        type: typeMessage,
        companyId: companyId,
        from: {
            id: userId,
            name: nameUser
        },
        to: roomId,
        file: file,
        text: text,
        read: [userId],
        date: utcString,
    }

}