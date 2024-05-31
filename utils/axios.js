require('dotenv').config()
const globalVars = require('../globalVars')
const axios = require('axios')
const api = axios.create({
    baseURL: `${process.env.BACK_URL}`
})

api.interceptors.request.use(async function (request) {
    const {headers} = globalVars
    if (headers) {
        request.headers['Authorization'] = process.env.API_TOKEN
    }
    return request
}, (error) => {
    return Promise.reject(error);
});


module.exports = api