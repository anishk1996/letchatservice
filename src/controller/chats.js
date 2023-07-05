const chatService = require('../service/chats');
const messageService = require('../service/message');
const encrypt = require('../service/crypto').encrypt;
const decryptAllValues = require('../service/crypto').decryptAllValues;

async function insertChat(req, res, next) {
    try {
        let data = req.body;
        let result = await chatService.saveChat(data);
        console.log('Chat ID generated');
        res.json(result);
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });
    }
}

async function findChat(req, res, next) {
    try {
        let data = req.body;
        let query = {
            $and: [
                {
                    user_ids: {
                        $all: data.user_ids
                    }
                },
                {
                    chat_type: data.chat_type
                }
            ]
        }
        let result = await chatService.findChat(query);
        res.json(result);
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });
    }
}

async function saveChat(req, res, next) {
    try {
        let data = req.body;
        let message = await encrypt(data[0].msg);
        data[0].msg = message;
        let result = await messageService.insertMessage(data);
        res.json(result);
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });
    }
}

async function getMessages(req, res, next) {
    try {
        let data = req.query.id ? req.query.id : null;
        if (data == null) {
            next({ statusCode: 500, message: 'No data passed in the query' });    
        } else {
            let result = await messageService.getMessages(data);
            let finalResult = await decryptAllValues(result);
            res.json(finalResult);
        }
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });
    }
}


module.exports = {
    insertChat,
    findChat,
    saveChat,
    getMessages
}