const users = require('../model/users');

const findAndUpdateUser = async (id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('Status for user', id, ' ' , status);
            let responseData = await users.findOneAndUpdate({ _id: id }, { isOnline: status } , { new: true }).sort({ "_id": -1 });
            return resolve(responseData);
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = {
    findAndUpdateUser
}