

export default function responseSocketRequest(socket, id) {
    if(socket && id)socket.emit('responseSocketRequest', id)
}