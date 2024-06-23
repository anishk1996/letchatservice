const chats = require('../model/chats');

const saveChat = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = {};
            await chats.insertMany([data])
                .then(results => {
                    responseData = results
                })
            return resolve(responseData);
        } catch (err) {
            return reject(err);
        }
    });
}

const findChat = async (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = await chats.find(query, '+_id -__v -created_on -updated_on');
            return resolve(responseData);
        } catch (err) {
            return reject(err);
        }
    })
}

const deleteChat = async (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await chats.deleteMany(query);
            return resolve(response);
        } catch (err) {
            return reject(err);
        }
    })
}

module.exports = {
    saveChat,
    findChat,
    deleteChat
}