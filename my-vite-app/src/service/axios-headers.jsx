import { getLocalStorage } from "./axios"

export function getHeaders() {
    const headers = getLocalStorage('u')
    if (headers) {
        return {
            'Authorization': headers.token
        }
    } else {
        return headers
    }


}
export function getHeadersAdmin() {
    const headers = getLocalStorage('admin')
    if (headers) {
        return {
            'Authorization': headers.token,
        }
    } else {
        return headers
    }


}