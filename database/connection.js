const mongoose = require('mongoose');
const globalVars = require('../globalVars');
async function connectDatabase(url, callback) {
     mongoose.set("strictQuery", false);
     mongoose.connect(url, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'BAILEYS'
     })
 
     const db2 = mongoose.connection;
     db2.on('error', (err) => { console.log(err); })
     db2.once('open', () => { console.log("Conectado ao banco!!"); })

    mongoose.set("strictQuery", false);
    const db = mongoose.createConnection(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'BAILEYS' 
    });

    db.once('open', async () => {
        try {
            console.log(`Conectado ao banco`);
            globalVars.database = db
            callback(db)
        } catch (error) {
            console.log(error);
        }
    });

    db.once('close', async () => {
        console.log(`Desconectado do banco`);
    });
}

module.exports = connectDatabase
