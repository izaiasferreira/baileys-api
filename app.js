require('dotenv').config();
const globalVars = require('./globalVars');

var express = require('express');
var app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});
globalVars.io = io

const connectDatabase = require('./database/connection');
const db = require('./database/functions');

var logger = require('morgan');
var cors = require('cors');
const path = require('path');


const Baileys = require('./class/InstanceBaileys');

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'my-vite-app/dist')));


// Servir arquivos estáticos da pasta "public"
app.use(express.static('public'));



globalVars.io.on("connection", (socket) => {
    socket.on('startConnection', async (id) => {
        var index = findInstance(id)
        if (!index) {
            var a = new Baileys({
                id: id
            })
            globalVars.instances.push(a)
            await db.createSession(a.dataSession)
            await a.connectOnWhatsapp()
        }
    });
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-vite-app/dist', 'index.html'));
});

app.get('/message', async (req, res) => {
    var response = globalVars.instances.map((instance) => {
        return instance.message
    })
    return res.json(response);
});

app.get('/instances', (req, res) => {
    db.getSession().then((result) => {
        res.status(200).json({ memory: globalVars.instances, dataBase: result })
    })
});

app.get('/contacts', async (req, res) => {
    const { id } = req.query
    var index = findInstance(id)
    if (index >= 0 && index !== null) {
        var session = await db.getSession({ id: id })
        res.status(200).json(session[0].contacts)
    } else {
        res.status(400).json(null)
    }

});

app.get('/statusConnection', (req, res) => {
    const { id } = req.query
    var index = findInstance(id)
    if (index >= 0 && index !== null) {
        res.status(200).json(globalVars?.instances[index]?.statusConnection)
    } else {
        res.status(400).json(null)
    }
});

app.post('/startConnection', async (req, res) => {
    const { id } = req.query
    var index = findInstance(id)
    if (!index) {
        var a = new Baileys({
            id: id
        })
        globalVars.instances.push(a)
        var session = await db.createSession(a.dataSession).then(async () => {
            await a.connectOnWhatsapp()
            res.status(200).json(session)
        }).catch(() => res.status(400).end())
    } else {
        res.status(200).end()
    }
});

app.post('/disconnect', async (req, res) => {

    const { id } = req.query
    console.log('disconnect', id)
    var index = findInstance(id)
    if (index >= 0 && index !== null || index) {
        await globalVars?.instances[index]?.end(true, "xxAPP")
        console.log('desconnectado')
    }
    res.status(200).end()
});

app.post('/sendMessageText', async (req, res) => {
    const { id } = req.query
    var data = req.body
    var index = findInstance(id)
    // console.log(`MENSAGEM: ${data.text} | PARA: ${data.id}`);
    if (index >= 0 && index !== null && index !== null) {
        var response = await globalVars.instances[index].sendMessageText(data.id, data.text)
        res.status(200).json(response)
    } else {
        res.status(400).end()
    }
});

app.post('/sendMessageImage', async (req, res) => {
    const { id } = req.query
    var data = req.body
    console.log(data);
    var index = findInstance(id)
    if (index >= 0 && index !== null && index !== null) {
        var response = await globalVars.instances[index].sendMessageImage(data.id, data.text, data.url)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});

app.post('/sendMessageButtons', async (req, res) => {
    const { id: sessionId } = req.query
    var data = req.body
    const { id, buttons, title, description, footer } = data
    var index = findInstance(sessionId)
    if (index >= 0 && index !== null) {
        var response = await globalVars.instances[index].sendMessageButtons(id, buttons, title, description, footer)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});

app.post('/sendMessageList', async (req, res) => {
    const { id: sessionId } = req.query
    var data = req.body
    const { id, buttons, title, description, footer } = data
    var index = findInstance(sessionId)
    if (index >= 0 && index !== null) {
        var response = await globalVars.instances[index].sendMessageList(id, buttons, title, description, footer)
        res.status(200).json(response).end()
    } else {
        res.status(400).end()
    }
});

app.post('/deleteMessage', async (req, res) => {
    const { id: sessionId } = req.query
    const { id, msg, type } = req.body
    var index = findInstance(sessionId)
    if (index >= 0 && index !== null && msg && msg.msg && type && id) {
        var response = await globalVars.instances[index].deleteMessage(id, msg.msg, type)
        res.status(200).json(response).end()
    } else {
        res.send(null).end()
    }
});

app.post('/verifyExistsNumber', async (req, res) => {
    const { id: sessionId } = req.query
    const { id } = req.body
    console.log(id);
    var index = findInstance(sessionId)
    if (!index) {
        var status = await globalVars.instances[index].veriyExistsNumber(id)
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});

app.post('/getProfilePic', async (req, res) => {
    const { id: sessionId } = req.query
    const { id } = req.body
    var index = findInstance(sessionId)
    if (index >= 0 && index !== null && id) {
        var status = await globalVars?.instances[index]?.getProfilePic(id).catch(err => console.log('erro getProfilePic'))
        res.status(200).json(status).end()
    } else {
        res.status(204).end()
    }
});
 

connectDatabase(process.env.DATABASE_URL)

// db.getSession().then(async (result) => {
//     if (result) {
//         for (let index = 0; index < result.length; index++) {
//             var a = new Baileys(result[index].name, result[index].id)
//             globalVars.instances.push(a)
//             await a.connectOnWhatsapp()

//         }
//     }
//     console.log('iNICIANDO iNSTÂNCIAS');
// })

httpServer.listen(process.env.PORT || 3000, () => {
    console.log("\x1b[33m%s\x1b[0m", "SERVIDOR RODANDO NA PORTA", process.env.PORT || 3000);
});

function findInstance(instanceId) {
    const { instances } = globalVars
    var index = instances.findIndex(instance => instance.state.id === instanceId)
    if (index === -1) {
        return null
    } else {
        return index
    }
}
