const jwt = require('jsonwebtoken')
const db = require('../database/functions')

exports.verifyJWT = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    var exists = await db.getSession({ token: token })
    if (!exists) return res.status(401).json({ message: 'Unauthorized' })
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err || !decoded) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.instance = decoded.id
        return next()  // Continue to route
    })
}


exports.generateToken = ({ time, data }) => { //gera um novo token
    return jwt.sign(data || {}, process.env.SECRET, { expiresIn: time || '1d' })
}

exports.next = async (req, res, next) => { next() };