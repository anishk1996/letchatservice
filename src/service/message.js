const messages = require('../model/messages');

const insertMessage = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = {};
            await messages.insertMany(data)
                .then(results => {
                    responseData = results
                })
            return resolve(responseData);
        } catch (err) {
            return reject(err);
        }
    });
}

const getMessages = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = await messages.find({ 'chat._id': data },'-__v -created_on -updated_on').sort({ "_id": 1 });
            return resolve(responseData);
        } catch (err) {
            return reject(err); 
        }
    })
}

const deleteMessages = async (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await messages.deleteMany(query);
            return resolve(result);
        } catch (err) {
            return reject(err);
        }
    })
}

module.exports = {
    insertMessage,
    getMessages,
    deleteMessages
}