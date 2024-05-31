const mongoose = require('mongoose');
const globalVars = require('../globalVars');
function connectDatabase(url) {
    mongoose.set("strictQuery", false);
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'BAILEYS'
    })

    const db = mongoose.connection;
    db.on('error', (err) => { console.log(err); })
    db.once('open', () => { console.log("Conectado ao banco!!"); })
    globalVars.database = db
}

module.exports = connectDatabase
