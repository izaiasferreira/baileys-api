
import axios from "axios";
import { getHeaders, getHeadersAdmin } from "./axios-headers";
import { backUrl } from "./backUrl";
export const ApiBack = axios.create({
    baseURL: backUrl
})
export const ApiBackAdmin = axios.create({
    baseURL: backUrl
})

ApiBack.interceptors.request.use(async function (request) {
    const headers = getHeaders()
    if (headers) {
        request.headers['Authorization'] = headers.Authorization
    }
    return request
}, (error) => {
    return Promise.reject(error);
});

ApiBackAdmin.interceptors.request.use(async function (request) {
    const headers = getHeadersAdmin()
    if (headers) {
        request.headers['Authorization'] = headers.Authorization
    }
    return request
}, (error) => {
    return Promise.reject(error);
});

export function setLocalStorage(data, local) {
    localStorage.setItem(local || 'u', JSON.stringify(data))
}

export function getLocalStorage(local) {
    const json = localStorage.getItem(local || 'u')
    if (!json) {
        return null
    }
    const data = JSON.parse(json)
    return data ?? null
}