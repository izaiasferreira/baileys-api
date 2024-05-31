
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const globalVars = require("../globalVars")
const { v1: uuid } = require('uuid');
const { localDateIso } = require('../utils/functionsClient');
async function find(collection, database, filter) {
    // console.log('find', collection, database.name, filter);
    if (collection && database) {
        var collection = database.collection(collection)
        var cursor = await collection.find(filter || {})
        var result = []
        await cursor.forEach(document => {
            result.push(JSON.parse(JSON.stringify(document)))
        });
        return result
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

async function update(collectionName, database, filter, obj) {
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
function verifyGender(gender) {
    if (gender === "male") {
        return "./img/profiles/default-male.png"
    }
    if (gender === "female") {
        return "./img/profiles/default-female.png"
    }
    if (gender === "other") {
        return "./img/profiles/default-other.png"
    }
}

exports.getUser = async ({ id, database }) => {
    var result = await findOne('users', database, { _id: new ObjectId(id?.toString()) })
    if (result) {
        return result
    }
    return null
}

exports.getUserFind = async ({ filter, database, getMaster }) => {
    var data = await find('users', database, filter)
    // console.log(data);
    var users = data.filter((user) => {
        if (getMaster && user.role === 'admin-master') {
            return true
        }
        return !['api'].includes(user?.role)
    })
    if (users.length > 0) {
        return users
    } else {
        return false
    }

}

exports.createUser = async ({ obj, login, password, database, company }) => {
    obj.signature = false
    obj.isPaused = false
    obj.profilePic = verifyGender(obj.gender)
    login = login.toLowerCase()
    var result = await this.verifyLogin({ filter: { login: login }, database: globalVars.databasesConnection['GENERAL'] })
    if (result) {
        var user = await create('users', database, obj)

        var objectLogin = {
            id: user._id.toString(),
            login: login,
            password: password,
            company: { id: company._id.toString(), name: company.name }
        }
        this.createLogin({ obj: objectLogin, database: globalVars.databasesConnection['GENERAL'] })
        return user
    } else {
        return false
    }

}
exports.createUserAdminFirst = async ({ obj, login, password, database, company }) => {
    obj.signature = false
    obj.isPaused = false
    obj.profilePic = verifyGender(obj.gender)
    var result = await this.verifyLogin({ filter: { login: login }, database: globalVars.databasesConnection['GENERAL'] })
    if (result) {
        var user = await create('users', database, obj)
        var objectLogin = {
            id: user._id.toString(),
            login: login,
            password: password,
            company: { id: company._id.toString(), name: company.name }
        }
        this.createLogin({ obj: objectLogin, database: globalVars.databasesConnection['GENERAL'] })
        return { user: user, login: objectLogin }
    } else {
        var user = await create('users', database, obj)
        var objectLogin = {
            id: user._id.toString(),
            login: 'admin@' + uuid().substring(0, 8),
            password: password,
            company: { id: company._id.toString(), name: company.name }
        }
        this.createLogin({ obj: objectLogin, database: globalVars.databasesConnection['GENERAL'] })
        return { user: user, login: objectLogin }
    }

}
exports.createUserAdmin = async ({ obj, login, password, database }) => {
    var result = await this.verifyLogin({ filter: { login: login }, database: database })
    if (result) {
        var user = await create('users', database, obj)
        var objectLogin = {
            id: user._id.toString(),
            login: login,
            password: password
        }
        this.createLogin({ obj: objectLogin, database: database }).catch(err => {
            console.log(err)
        })
        return user
    } else {
        return null
    }

}

exports.deleteUser = async ({ id, database }) => {
    await deleteOne('users', database, { _id: new ObjectId(id) })
    await this.deleteLogin({ filter: { id: id }, database: globalVars.databasesConnection['GENERAL'] })
}
exports.deleteUserAdmin = async ({ id, database }) => {
    await deleteOne('users', database, { _id: new ObjectId(id) })
    await this.deleteLogin({ filter: { id: id }, database: globalVars.databasesConnection['ADMIN'] })
}
exports.updateUser = async ({ id, database, obj }) => {
    await update('users', database, { _id: new ObjectId(id) }, obj)
    return await findOne('users', database, { _id: new ObjectId(id) })
}
exports.updateManyUsers = async ({ filter, database, obj }) => {
    await updateMany('users', database, filter, obj)
    return await find('users', database, filter)
}

//---------------------------------------------------------------------

exports.login = async ({ database, login, password }) => {
    var result = await findOne('logins', database, { login: login })
    if (result) {
        if (bcrypt.compareSync(password, result.password)) {
            return { id: result.id, company: result?.company?.id }
        }

    }
    return false
}
exports.createLogin = async ({ database, obj }) => {
    var login = await create('logins', database, obj)
    return login
}

exports.updateLogin = async ({ filter, obj, database }) => {
    await update('logins', database, filter, obj)
}

exports.getLogin = async ({ id, database }) => {
    var login = await findOne('logins', database, { id: id })
    if (!login) {
        return false
    }
    var loginInfo = login.login
    var partOne = loginInfo.slice(0, 2)
    var partTwo = loginInfo.slice(loginInfo.indexOf("@"), loginInfo.length)
    return `${partOne}***${partTwo}`
}
exports.getAllLogins = async (database) => {
    var login = await find('logins', database, {})
    return login
}

exports.verifyLogin = async ({ filter, database }) => {
    var login = await find('logins', database, filter)
    if (login.length > 0) {
        return false
    } else {
        return true
    }
}

exports.deleteLogin = async ({ filter, database }) => {
    await deleteOne('logins', database, filter)
}
exports.deleteLogins = async ({ filter, database }) => {
    await deleteMany('logins', database, filter)
}

//--------------------------------------------------------------

exports.createMessage = async ({ obj, database }) => {
    const message = await create('messages', database, obj)
    return message
}

exports.getMessages = async ({ filter, quantity, database }) => {
    const messages = await findForMessage(database, filter, quantity)
    return messages
}
exports.getMessage = async ({ id, database }) => {
    const messages = await find('messages', database, { _id: new ObjectId(id.toString()) })
    if (messages.length > 0) {
        return messages[0]
    } else {
        return null

    }
}

exports.deleteMessages = async ({ id, database }) => {
    await deleteOne('messages', database, { _id: new ObjectId(id.toString()) })
}
exports.deleteManyMessages = async ({ filter, database }) => {
    await deleteMany('messages', database, filter)
}
exports.updateMessageFind = async ({ filter, obj, database }) => {
}

exports.updateMessageFindMany = async ({ filter, obj, database }) => {
    await updateMany('messages', database, filter, obj)
}

exports.updateMessage = async ({ id, obj, database }) => {
    await update('messages', database, { _id: new ObjectId(id) }, obj)
    return findOne('messages', database, { _id: new ObjectId(id) })
}
//--------------------------------------------------------------

exports.createClient = async ({ obj, database }) => {
    const client = await create('clients', database, obj)
    return client
}
exports.createManyClients = async ({ clients, database }) => {
    const client = await createMany('clients', database, clients)
    return client
}
exports.getClient = async ({ filter, database }) => {
    const client = await find('clients', database, filter)/* .limit(limit || 50) */
    // console.log('client', client);
    if (client?.length > 0) {
        return client
    } else {
        return null
    }
}
exports.getOneClient = async ({ filter, database }) => {
    const client = await findOne('clients', database, filter)/* .limit(limit || 50) */
    return client
}
exports.getClientLimit = async ({ filter, database, limit, skip }) => {
    const client = await findLimit('clients', database, filter, skip, limit)
    // console.log('client', client);
    if (client?.length > 0) {
        return client
    } else {
        return null
    }
}
exports.getClientToArray = async ({ filter, database }) => {
    try {
        const client = await find(
            'clients',
            database,
            filter
        );
        if (client?.length > 0) {
            return client;
        }
        return [];
    } catch (err) {
        return []
    }
}

exports.getClientById = async ({ id, connectionId, database }) => {
    const client = await findOne('clients', database, { id: id, "connection.id": connectionId })
    if (client) {
        return client
    }
    return null
}

exports.deleteClient = async ({ filter, database }) => {
    await deleteOne('clients', database, filter)
}

exports.deleteAllClient = async ({ filter, database }) => {
    var clients = await this.getClient({ filter: filter, database: database })
    if (clients) {
        await deleteMany('clients', database, filter)
        var clientsIds = clients?.map((client) => {
            return { idConversation: client.id, connectionId: client.connection.id }
        })
        return clientsIds
    }
    return []
}
exports.deleteManyClients = async ({ ids, database }) => {
    var clients = await this.getClient({ filter: { id: { $in: ids } }, database: database })
    if (clients) {
        await deleteMany('clients', database, { id: { $in: ids } })
        var clientsIds = clients?.map((client) => {
            return { idConversation: client.id, connectionId: client.connection.id }
        })
        return clientsIds
    }
    return []
}
exports.updateClient = async ({ filter, database, obj }) => {
    await update('clients', database, filter, obj)
    var response = await this.getClient({ filter: filter, database: database })
    if (!response) {
        return null
    }

    return response[0]
}

exports.updateManyClient = async ({ filter, database, obj }) => {

    // console.log('updateClient', filter, obj);
    await updateMany('clients', database, filter, obj)
    var response = await this.getClient({ filter: filter, database: database })
    if (response && response.length <= 0) {
        return null
    }

    return response
}

exports.verifyExistsClient = async ({ id, database }) => {
    var client = await find('clients', database, { id: id })
    if (client.length > 0) {
        return true
    } else {
        return false
    }
}
//----------------------------------------------------------------------



exports.createSector = async ({ database, obj }) => {
    var sector = await create('sectors', database, obj)
    return sector
}

exports.getSector = async ({ filter, database }) => {
    var sector = await find('sectors', database, filter)
    return sector;
}
exports.getSectorById = async ({ id, database }) => {
    var sector = await find('sectors', database, { _id: new ObjectId(id.toString()) })
    if (sector && sector.length > 0) {
        return sector[0]
    } else {
        return false
    }
}
exports.getSectorDefault = async (database) => {
    var sector = await findOne('sectors', database, { name: 'Default' })
    return sector;
}

exports.getSectorNoDefault = async ({ database }) => {
    var sector = await find('sectors', database)
    sector.splice(sector.findIndex(result => result.name === 'Default'), 1)
    return sector;
}

exports.updateSector = async ({ id, obj, database }) => {
    await update('sectors', database, { _id: new ObjectId(id.toString()) }, obj)
}

exports.deleteSector = async ({ id, database }) => {
    await deleteOne('sectors', database, { _id: new ObjectId(id.toString()) })
}

//--------------------------------------------------------------------

exports.createInformations = async ({ obj, database }) => {
    var informations = await create('informations', database, obj)
    return informations
}

exports.getInformations = async (database) => {
    var informations = await find('informations', database, {})
    if (informations?.length > 0) {
        return informations[0]
    } else {
        return false
    }
}

exports.updateInformations = async ({ database, obj }) => {
    var informations = await this.getInformations(database)
    await update('informations', database, { _id: new ObjectId(informations._id.toString()) }, obj)
    return await this.getInformations(database)
}

//------------------------------------------------------------------------

/**
 * Creates a new company with the given parameters.
 *
 * @param {Object} obj - The object containing company details. {name, description, data}
 * @param {string} nameFirstUser - The name of the first user.
 * @param {number} numberOfUsers - The number of users.
 * @param {number} numberOfAssistants - The number of assistants.
 * @param {number} numberOfConnections - The number of connections.
 * @param {Object} database - The database object.
 * @return {Promise<Object>} The created company.
 */
exports.createCompany = async ({ obj, database }) => {
    var company = await create('companies', database, obj)
    return company
}
exports.createCompanyInfos = async ({ companyInfos, informations, database }) => {
    var objectInformations = {
        status: true,
        funcStatus: true,
        maxUsers: parseInt(informations?.maxUsers) || 5,
        maxAssistants: parseInt(informations?.maxAssistants) || 3,
        maxConnections: parseInt(informations?.maxConnections) || 3,
        absenceMessage: {
            status: true,
            assistantId: null
        },
        endMessage: {
            status: true,
            assistantId: null
        },
        finishedAutomaticAttendanceMessage: {
            status: false,
            assistantId: null,
            minutes: 15,
            inAttendance: false,
        },
        updateState: true,
        timezone: 'America/Sao_Paulo',
        sectorAutomaticTransfer: null,
        openingHours: [
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: false,
                dayName: 'Domingo',
                allHour: false,
                dayNumber: 1
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: true,
                dayName: 'Segunda',
                allHour: false,
                dayNumber: 2
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: true,
                dayName: 'Terça',
                allHour: false,
                dayNumber: 3
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: true,
                dayName: 'Quarta',
                allHour: false,
                dayNumber: 4
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: true,
                dayName: 'Quinta',
                allHour: false,
                dayNumber: 5
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: true,
                dayName: 'Sexta',
                allHour: false,
                dayNumber: 6
            },
            {
                initialHour: 'Thu Apr 25 2024 08:00:00 GMT-0300',
                finalHour: 'Thu Apr 25 2024 17:00:00 GMT-0300',
                status: false,
                dayName: 'Sábado',
                allHour: false,
                dayNumber: 7
            }
        ],
        assistantState: true,
        customersServed: 0,
        customersInLine: 0,
        onlineUsers: 0,
        serviceTime: 0,
        typeFindClients: true
    }
    const { nodes } = require('../utils/assistants');
    for (const key of Object.keys(nodes)) {
        const propriets = {
            "absence": 'absenceMessage',
            "finalization": 'endMessage',
            "inactivity": 'finishedAutomaticAttendanceMessage'
        }
        var node = nodes[key].nodes;
        const name = nodes[key].name;
        var assistant = await this.createAssistant({
            obj: {
                name: name,
                status: true
            },
            database: database
        });
        node['id'] = key;
        node.data.assistantId = assistant._id.toString();
        node.data.sections = node.data.sections.map((section) => {
            section.section = key
            return section
        })
        await this.createNode({ obj: node, database: database });
        if (key !== 'welcome') {
            console.log(propriets[key], assistant._id.toString());
            objectInformations[propriets[key]]['assistantId'] = assistant._id.toString();
            console.log(objectInformations[propriets[key]]);
        }
    }

    // objectInformations = await Promise.all(objectInformations)

    const sector = await this.createSector({ database: database, obj: { name: "Default" } })
    objectInformations['sectorAutomaticTransfer'] = sector._id

    var informationsData = await this.createInformations({ // Criando as informations
        obj: objectInformations, database: database
    })

    const salt = bcrypt.genSaltSync(10);
    var companyName = companyInfos.name.replace(/\s/g, '')
    companyName = companyName.toLowerCase()
    var password = uuid()
    const adminPassword = bcrypt.hashSync(password, salt);

    var userAdmin = await this.createUserAdminFirst({
        obj: {
            name: 'Administrador',
            lastName: "Master",
            gender: "other",
            profession: "Administrador Master",
            sectorId: sector._id,
            profilePic: null,
            role: "admin-master"
        },
        login: 'admin@' + companyName,
        password: adminPassword,
        database: database,
        company: companyInfos
    })


    await this.createBookmark({
        obj: {
            name: 'Primeiro de Marcador',
            color: '#232740',
            textColor: 'white',
            emoji: '🐱'
        },
        database: database
    })

    var allUsers = (await this.getUserFind({ database: database, getMaster: true }))
    // console.log(allUsers, 'allUsers');
    await this.createRoom({
        obj: {
            name: 'Todos',
            description: 'Sala de todos os usuários',
            participants: allUsers?.map((user) => {
                return { userId: user._id.toString(), name: user.name }
            }),
            data: null
        },
        database: database
    })
    userAdmin.login.password = password
    return { infos: informationsData, userAdmin: userAdmin }
}
exports.createCompanyUpdate = async ({ obj, database }) => {
    var company = await create('companies', database, obj)
    return company
}

exports.getCompany = async ({ database, id }) => {
    // console.log(id, 'getCompanyy');
    var result = await findOne('companies', database, { _id: new ObjectId(id) })
    // console.log(result, 'getCompanyyy'); 
    if (!result) result = await findOne('companies', database, { _id: id })
    // console.log(result, 'getCompanyyiy');
    return result || null
}
exports.getCompanyUpdate = async (database) => {
    var result = await find('companies', database, {})
    return result[0] || null
}
exports.getCompanies = async ({ database, filter }) => {
    var result = await find('companies', database, filter)
    return result
}


exports.updateCompany = async ({ id, obj, database }) => {
    await update('companies', database, { _id: new ObjectId(id) }, obj)
    await update('companies', database, { _id: id }, obj)
    var result = await find('companies', database, { _id: new ObjectId(id) })[0]
    if (!result) {
        result = await find('companies', database, { _id: id })

    }
    if (result.length > 0) {
        return result[0]
    } else {
        return result

    }
}

exports.deleteCompany = async ({ id, database }) => {
    await deleteOne('companies', database, { _id: new ObjectId(id) })
    await deleteOne('companies', database, { _id: id })
    return
}
//----------------------------------------------------------------------------------
exports.includeTokenToBlacklist = async ({ token, database }) => {
    var tokenInclued = await create('blacklisttokens', database, { token: token })
    return tokenInclued
}

exports.verifyInBlackListToken = async ({ token, database }) => {
    var getToken = await find('blacklisttokens', database, { token: token })
    if (getToken.length > 0) {
        return true
    } else {

        return false
    }
}

exports.getToken = async ({ token, database }) => {
    var token = await findOne('tokens', database, { token: token })
    if (token) return token
    return null
}
exports.getTokenById = async ({ id, database }) => {
    var token = await findOne('tokens', database, { id: id })
    if (token) return token.token
    return null
}
exports.getTokens = async ({ filter, database }) => {
    var token = await find('tokens', database, filter)
    if (token) return token
    return null
}
exports.createToken = async ({ database, obj }) => {
    var token = await createWithExpire('tokens', database, obj, (60 * 60 * 24))
    return token
}

exports.deleteTokenById = async ({ id, database }) => {
    await deleteMany('tokens', database, { id: id })
}
exports.deleteTokens = async ({ filter, database }) => {
    return await deleteMany('tokens', database, filter)
}


//-------------------------------------------------------------------
exports.verifyExistsBookmark = async ({ id, database }) => {
    var bookmark = await find('bookmarks', database, { _id: new ObjectId(id.toString()) })
    if (bookmark.length >= 1) {
        return true
    } else {
        return false
    }
}
exports.getBookmark = async ({ filter, database }) => {
    return await find('bookmarks', database, filter)
}

exports.createBookmark = async ({ obj, database }) => {
    return await create('bookmarks', database, obj)
}
exports.getAllBookmarks = async (database) => {
    var bookmark = await find('bookmarks', database)
    if (bookmark.length > 0) {
        return bookmark;
    } else {
        return []
    }
}

exports.updateBookmark = async ({ id, obj, database }) => {

    await update('bookmarks', database, { _id: new ObjectId(id) }, obj)
}

exports.deleteBookmark = async ({ id, database }) => {
    await deleteOne('bookmarks', database, { _id: new ObjectId(id) })
    var clients = await this.getClient({ database: database })
    if (clients?.length > 0) {
        for (let index = 0; index < clients.length; index++) {
            const { _id, bookmarks } = clients[index]
            if (bookmarks) {
                var filter = bookmarks.filter(bookmark => { if (bookmark !== id) return bookmark })
                await this.updateClient({ filter: { _id: _id }, obj: { bookmarks: filter }, database: database })
            }
        }
    }
}

//-------------------------------------------------------------------
exports.createConnection = async ({ obj, database }) => {
    var connection = await create('connections', database, obj)
    return connection
}
exports.getAllConnections = async ({ database, companyId }) => {
    var connections = await find('connections', database, { 'company.id': companyId })
    if (connections.length > 0) {
        return connections;
    } else {
        return []
    }
}
exports.getConnectionsIds = async ({ database, companyId }) => {
    var connections = await find('connections', database, { 'company.id': companyId })
    // console.log(connections, companyId, 'connectionsssad');
    if (connections.length > 0) {
        return connections.map(connection => {
            return connection.id
        });
    } else {
        return []
    }
}
exports.getConnection = async ({ id, database }) => {
    var connection = await find('connections', database, { id: id })
    if (connection && connection.length > 0) {
        return connection[0];
    }
    return null
}
exports.getConnectionFind = async ({ filter, database }) => {
    var connection = await find('connections', database, filter)
    if (connection) {
        return connection;
    }
    return null
}
exports.getConnectionByToken = async ({ token, database }) => {
    var connection = await findOne('connections', database, { 'data.token': token })
    if (connection) {
        return connection;
    }
    return null
}
exports.updateConnection = async ({ id, obj, database }) => {
    await update('connections', database, { id: id }, obj)
    var connection = await this.getConnection({ id: id, database: database })
    return connection
}
exports.deleteConnection = async ({ id, database }) => {
    await deleteOne('connections', database, { id: id })
}
//--------------------------------------------------------------------------------
exports.createNode = async ({ obj, database }) => {
    var node = await create('nodes', database, obj)
    return node
}
exports.createManyNodes = async ({ arr, database }) => {
    await createMany('nodes', database, arr)
    return await this.getAllNodes(database)
}

exports.getAllNodes = async (database) => {
    var nodes = await find('nodes', database)
    if (nodes.length > 0) {
        return nodes;
    } else {
        return []
    }
}
exports.getAllNodesById = async ({ id, database }) => {

    const nodes = await find('nodes', database)
    var filter = nodes.filter(node => node?.data?.assistantId === id)
    if (filter.length > 0) {
        return filter;
    } else {
        return []
    }
}
exports.updateNodes = async ({ arr, assistantId, database }) => {
    await deleteMany('nodes', database, { 'data.assistantId': assistantId })
    await createMany('nodes', database, arr)
    return await this.getAllNodes(database)
}
exports.deleteNodes = async ({ assistantId, database }) => {
    await deleteMany('nodes', database, { 'data.assistantId': assistantId })
    return await this.getAllNodes(database)
}
//--------------------------------------------------------------------------------
exports.createEdge = async ({ obj, database }) => {
    var edge = await create('edges', database, obj)
    return edge
}
exports.createManyEdge = async ({ arr, database }) => {
    await createMany('edges', database, arr)
    return this.getAllEdges(database)
}
exports.getAllEdges = async (database) => {
    var edges = await find('edges', database)
    if (edges.length > 0) {
        return edges;
    } else {
        return []
    }
}
exports.getAllEdgesById = async ({ id, database }) => {
    var edges = await find('edges', database, { assistantId: id })
    if (edges.length > 0) {
        return edges;
    } else {
        return []
    }
}
exports.updateEdges = async ({ arr, assistantId, database }) => {
    await deleteMany('edges', database, { assistantId: assistantId })
    await createMany('edges', database, arr)
    // }
    return await this.getAllEdges(database)
}
exports.deleteEdges = async ({ id, database }) => {
    await deleteMany('edges', database, { assistantId: id })
    return await this.getAllEdges(database)
}
//--------------------------------------------------------------------------------
exports.getAssistant = async ({ id, database }) => {
    var assistant = await find('assistants', database, { _id: new ObjectId(id) })
    return assistant[0]
}
exports.getAssistantFind = async ({ filter, database }) => {
    var assistant = await find('assistants', database, filter)
    if (assistant.length > 0) {
        return assistant;
    } else {
        return null

    }
}
exports.createAssistant = async ({ obj, database }) => {
    return await create('assistants', database, obj)
}

exports.getAllAssistants = async (database) => {
    var assistants = await find('assistants', database, {})
    if (assistants.length > 0) {
        return assistants;
    } else {
        return []
    }
}

exports.updateAssistant = async ({ obj, database }) => {
    var value = { ...obj }
    await update('assistants', database, { _id: new ObjectId(obj._id.toString()) }, obj)
    return (await this.getAssistant({ id: value._id.toString(), database: database }))
}
exports.deleteAssistant = async ({ id, database }) => {
    await deleteOne('assistants', database, { _id: new ObjectId(id) })
    await this.deleteNodes({ assistantId: id, database: database })
    await this.deleteEdges({ assistantId: id, database: database })
    return await this.getAllAssistants(database)
}

//------------------------------------------------
exports.getNewClientPreset = async ({ id, database }) => {
    var preset = await find('newclientpresets', database, { _id: new ObjectId(id) })
    return preset[0]
}
exports.getNewClientPresetFind = async ({ filter, database }) => {
    var preset = await find('newclientpresets', database, filter)
    if (preset.length > 0) {
        return preset;
    } else {
        return null

    }
}
exports.createNewClientPreset = async ({ obj, database }) => {
    delete obj._id
    return await create('newclientpresets', database, obj)
}

exports.getAllNewClientPresets = async (database) => {
    var presets = await find('newclientpresets', database, {})
    if (presets.length > 0) {
        return presets;
    } else {
        return []
    }
}

exports.updateNewClientPreset = async ({ id, obj, database }) => {
    delete obj._id
    await update('newclientpresets', database, { _id: new ObjectId(id) }, obj)
    return (await this.getNewClientPreset({ id: id, database: database }))
}
exports.deleteNewClientPreset = async ({ id, database }) => {
    await deleteOne('newclientpresets', database, { _id: new ObjectId(id) })
    return await this.getAllNewClientPresets(database)
}
//------------------------------------------------
exports.createSurvey = async ({ obj, database }) => {
    var survey = await create('surveys', database, obj)
    return survey
}

exports.getAllSurveys = async (database) => {
    var surveys = await find('surveys', database, {})
    if (surveys.length > 0) {
        return surveys;
    } else {
        return []
    }
}
exports.getSurveyById = async ({ id, database }) => {
    var survey = await find('surveys', database, { _id: new ObjectId(id.toString()) })
    if (survey.length > 0) {
        return survey
    } else {
        return null
    }
}
exports.updateSurvey = async ({ obj, database }) => {
    // console.log(obj, 'objsurvey');
    await update('surveys', database, { _id: new ObjectId(obj._id) }, obj)
    return await find('surveys', database, { _id: obj._id })
}
exports.deleteSurvey = async ({ id, database }) => {
    await deleteOne('surveys', database, { _id: new ObjectId(id) })
    return await this.getAllSurveys(database)
}

// -------------------------------------------------------------------
exports.createQuickMessage = async ({ obj, database }) => {
    var quickMessage = await create('quickmessages', database, obj)
    return quickMessage
}
exports.getQuickMessage = async ({ filter, database }) => {
    var quickMessage = await find('quickmessages', database, filter)
    if (quickMessage.length > 0) {
        return quickMessage;
    }
    return null
}
exports.getQuickMessageById = async ({ database, id }) => {
    var quickMessages = await find('quickmessages', database, {})
    var quickMessage = quickMessages.find(quickMessage => quickMessage._id.toString() == id)
    return quickMessage
}

exports.updateQuickMessage = async ({ database, id, obj }) => {
    return await update('quickmessages', database, { _id: new ObjectId(id) }, obj)
}

exports.deleteQuickMessage = async ({ id, database }) => {
    return await deleteOne('quickmessages', database, { _id: new ObjectId(id) })

}

// -------------------------------------------------------------------
exports.createHistoryClientAttendance = async ({ obj, database }) => {
    var history = await create('historyclients', database, obj)
    return history
}
exports.getHistoryClientAttendance = async ({ filter, database }) => {
    var history = await find('historyclients', database, filter)
    if (history.length > 0) {
        return history[0];
    }
    return null
}
exports.getHistoryClientAttendanceFindArray = async ({ filter, database }) => {

    try {
        const history = await find(
            'historyclients',
            database,
            filter
        );
        if (history?.length > 0) {
            return history;
        }
        return [];
    } catch (err) {
        return []
    }
}

exports.getHistoryClientAttendanceById = async ({ id, database }) => {
    var history = await find('historyclients', database, { _id: new ObjectId(id?.toString()) })
    if (history?.length > 0) {
        return history[0];
    }
    return null
}
exports.updateHistoryClientAttendance = async ({ id, obj, database }) => {
    await update('historyclients', database, { _id: new ObjectId(id.toString()) }, { ...obj, updatedAt: await localDateIso(database) })
}
exports.deleteHistoryClientAttendance = async ({ id, database }) => {
    await deleteOne('historyclients', database, { _id: new ObjectId(id.toString()) })

}

// -------------------------------------------------------------------


exports.createHistoryUser = async ({ database, obj }) => {
    var history = await create('historyusers', database, obj)

    return history
}
exports.getHistoryUser = async ({ filter, database }) => {
    var history = await find('historyusers', database, filter)
    if (history.length > 0) {
        return history;
    }
    return null
}
exports.updateHistoryUser = async ({ filter, obj, database }) => {
    return await update('historyusers', database, filter, obj)
}

exports.deleteHistoryUser = async ({ id, database }) => {
    return await deleteOne('historyusers', database, { _id: new ObjectId(id.toString()) })

}

// -------------------------------------------------------------------
exports.createMessageInternalChat = async ({ obj, database }) => {
    const message = await create('messageinternalchat', database, obj)
    return message
}

exports.getMessagesInternalChat = async ({ filter, quantity, database }) => {
    const messages = await findForMessage(database, filter, quantity, true)
    return messages
}
exports.getMessageInternalChat = async ({ id, database }) => {
    const messages = await find('messageinternalchat', database, { _id: new ObjectId(id.toString()) })
    if (messages.length > 0) {
        return messages
    }
    return null

}
exports.deleteMessagesInternalChat = async ({ id, database }) => {
    await deleteOne('messageinternalchat', database, { _id: new ObjectId(id.toString()) })
}

exports.readMessagesInternalChat = async ({ userId, database }) => {
    var collection = database.collection('messageinternalchat')
    var cursor = await collection.find({
        'read': { $ne: userId }
    }).toArray()
    // console.log(cursor);
    for (let index = 0; index < cursor.length; index++) {
        // cursor[index].read.push(userId)
        var response = await this.updateMessageInternalChat({ id: cursor[index]._id, obj: { read: [...cursor[index].read, userId] }, database: database })
        // console.log(response, 'updateMessageInternalChatssasdasdas');
        cursor[index] = response
    }
    return cursor
}
exports.deleteManyMessagesInternalChat = async ({ filter, database }) => {
    await deleteMany('messageinternalchat', database, filter)
}
exports.updateMessageFindInternalChat = async ({ filter, obj, database }) => {
    await update('messageinternalchat', database, filter, obj)

}

exports.updateMessageFindManyInternalChat = async ({ filter, obj, database }) => {
    await updateMany('messageinternalchat', database, filter, obj)
}

exports.updateMessageInternalChat = async ({ id, obj, database }) => {
    await update('messageinternalchat', database, { _id: new ObjectId(id.toString()) }, obj)
    var response = await find('messageinternalchat', database, { _id: new ObjectId(id.toString()) })
    return response[0]
}

// -------------------------------------------------------------------
exports.getRoom = async ({ id, database }) => {
    var room = await find('roominternalchats', database, { _id: new ObjectId(id.toString()) })
    if (room.length > 0) {
        return room[0]
    }
    return null
}
exports.getRooms = async ({ database, filter }) => {
    var room = await find('roominternalchats', database, filter)
    return room
}
exports.createRoom = async ({ obj, database }) => {
    var room = await create('roominternalchats', database, obj)
    return room
}

exports.deleteRoom = async ({ id, database }) => {
    await deleteOne('roominternalchats', database, { _id: new ObjectId(id.toString()) })
}

exports.updateRoom = async ({ id, obj, database }) => {
    await update('roominternalchats', database, { _id: new ObjectId(id.toString()) }, obj)
}