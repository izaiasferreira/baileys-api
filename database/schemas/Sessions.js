const mongoose = require("mongoose")

const SessionSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: String,
    phoneNumber: String,
    statusConnection: Boolean,
    nameFileAuth: Object,
    authDataSession: Object,
    contacts: Array
})

module.exports = mongoose.model('Session', SessionSchema)