const mongoose = require("mongoose")

const AuthSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  keyId: { type: String, required: true },
  keyJson: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('AuthSession', AuthSessionSchema)