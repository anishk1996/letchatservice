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
            let responseData = await chats.findOne(query, '+_id  -user_ids -__v -created_on -updated_on');
            return resolve(responseData);
        } catch (err) {
            return reject(err);
        }
    })
}

module.exports = {
    saveChat,
    findChat
}