const users = require('../model/users');

const findUser = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = await users.find({ email: email },'+name +email +password -__v -created_on -updated_on').sort({ "_id": -1 });
            return resolve(responseData);
        } catch (error) {
            return reject(error);
        }
    });
}

const saveUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = {};
            await users.insertMany([data])
                .then(results => {
                    responseData = results
                })
            return resolve(responseData);
        } catch (error) {
            return reject(error);
        }
    });
}

const listAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = await users.find({}, '+name +email -__v -created_on -updated_on').sort({ "_id": -1 });
            return resolve(responseData)
        } catch (error) {
            return reject(error);
        }
    })
}


module.exports = {
    findUser,
    saveUser,
    listAllUser
}