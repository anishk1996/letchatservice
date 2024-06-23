const users = require('../model/users');

const findUser = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let responseData = await users.find({ email: email },{'name':1, 'email':1, 'password':1, 'isOnline':1, 'dob':1, 'gender':1}).sort({ "_id": -1 });
            return resolve(responseData);
        } catch (error) {
            return reject(error);
        }
    });
}

const findUserfromId = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await users.find({ _id: id }, {'name':1, 'email':1, 'password':0, 'isOnline':0, 'dob':0, 'gender':0}).sort({ "_id": -1 });
            return resolve(response);
        } catch (error) {
            return reject(error);
        }
    })
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
            let responseData = await users.find({}, {'name':1, 'email':1, 'isOnline':1, 'dob':1, 'gender':1}).sort({ "_id": -1 });
            return resolve(responseData)
        } catch (error) {
            return reject(error);
        }
    })
}

const deleteUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await users.deleteOne({ _id: id });
            return resolve(response);
        } catch (error) {
            return reject(error);
        }
    })
}


module.exports = {
    findUser,
    saveUser,
    listAllUser,
    findUserfromId,
    deleteUser
}
