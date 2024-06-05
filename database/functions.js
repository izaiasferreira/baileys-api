
const Session = require("./schemas/Sessions")
const globalVars = require("../globalVars");
const { ObjectId } = require('mongodb');

//---------------------------------------------------------------
async function find(collectionName, database, filter = {}) {
    if (database && collectionName) {
        const collection = database.collection(collectionName);
        const cursor = collection.find(filter);
        const result = await cursor.toArray();
        return result;
    } else {
        throw new Error('Database and collection must be provided');
    }
}


async function findLimit(collection, database, filter, skip, limit) {
    // console.log('find', collection, database.name, filter);
    if (collection && database) {
        var collection = database.collection(collection)
        var cursor = await collection.find(filter || {}).skip(skip || 0).limit(limit || 10)
        var result = []
        await cursor.forEach(document => {
            result.push(JSON.parse(JSON.stringify(document)))
        });
        return result
    }
}
async function findOne(collection, database, filter) {
    if (database && collection) {
        var collection = database.collection(collection)
        var cursor = await collection.findOne(filter)
        return cursor
    }

}
async function findForMessage(database, filter, quantity, internalChat) {
    var collection = database?.collection(internalChat ? 'messageinternalchat' : 'messages')
    var cursor = await collection?.find(filter).sort({ $natural: -1 }).limit(quantity ? quantity * 10 * 3 : 10)
    var result = []
    await cursor?.forEach(document => {
        result.push(JSON.parse(JSON.stringify(document)))
    });
    return result
}
async function create(collectionString, database, obj) {
    var collection = database.collection(collectionString)
    var cursor = await collection.insertOne(obj)
    if (cursor.insertedId) {
        return await findOne(collectionString, database, { _id: new ObjectId(cursor.insertedId.toString()) })
    }
    return cursor
}
async function createMany(collectionString, database, arr) {
    var collection = database.collection(collectionString)
    try {
        if (!arr || arr?.length === 0) return
        return await collection.insertMany(arr)
    } catch (err) {
        console.error('Erro ao atualizar documento:', err);
    }
}
async function createWithExpire(collectionString, database, obj, secondsToExpire) {
    var collection = database.collection(collectionString);
    console.log("Segundos para expirar:", secondsToExpire);
    // Convertendo segundos para milissegundos
    const millisecondsToExpire = secondsToExpire * 1000;

    // Criando a data de expiração
    const expireAt = new Date();
    console.log("Data de expiração:", expireAt);
    expireAt.setMilliseconds(expireAt.getMilliseconds() + millisecondsToExpire);
    console.log("Data de expiração depois de adicionar o tempo:", expireAt);
    // Inserindo o documento com a data de expiração
    var cursor = await collection.insertOne({ ...obj, createdAt: new Date(), expireAt: expireAt });

    if (cursor.insertedId) {
        return await findOne(collectionString, database, { _id: new ObjectId(cursor.insertedId.toString()) });
    }

    return cursor;
}

async function updateOne(collectionName, database, filter, obj) {
    if (collectionName && database) {
        if (obj && obj._id) {
            delete obj._id;
        }
        const collection = database.collection(collectionName);
        try {
            const result = await collection.updateOne(filter, { $set: obj });
            return result
        } catch (err) {
            console.error('Erro ao atualizar documento:', err);
        }
    }
}
async function updateMany(collection, database, filter, obj) {
    if (obj && obj._id) {
        delete obj._id;
    }
    var collection = database.collection(collection)
    await collection.updateMany(filter, { $set: obj })
}

async function deleteOne(collection, database, filter) {
    var collection = database.collection(collection)
    try {
        await collection.deleteOne(filter)
    } catch (err) {
        console.error('Erro ao deletae documento:', err);
    }
}

async function deleteMany(collectionString, database, filter) {
    var collection = database.collection(collectionString)
    try {
        return await collection.deleteMany(filter)
    } catch (err) {
        console.error('Erro ao atualizar documento:', err);
    }

}


exports.createSession = async (obj) => {
    var session = await create('sessions', globalVars.database, obj)
    return session
}

exports.updateSession = async (filter, update) => {
    await updateOne('sessions', globalVars.database, filter, update)
    return await this.getSession(filter)
}


exports.getSession = async (filter) => {
    var session = await await findOne('sessions', globalVars.database, filter)
    if (session) {
        return session
    }
    return false


}

exports.getSessions = async (filter) => {
    var session = await find('sessions', globalVars.database, filter || {})
    if (session) {
        return session
    }
    return false


}

exports.getSessionById = async (id) => {
    var session = await Session.findOne({ id: id })
    if (session) {
        return session
    } else {
        return null
    }

}

exports.deleteSession = async (id) => {
    await deleteOne('sessions', globalVars.database, { id: id })
}

//------------------------------------------------------------------------


exports.deleteAuthSession = async (sessionId) => {
    await deleteMany('authsessions', globalVars.database, { sessionId: sessionId })
    console.log('Keys da sessão deletada do banco');
}




