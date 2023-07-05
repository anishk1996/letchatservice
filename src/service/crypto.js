const CryptoJS = require('crypto-js');
const encryptionKey = process.env.ENCRYPTIONKEY || 'myEncryptionKey';

const encrypt = async(text) => {
    return new Promise((resolve, reject) => {
        try {
          const encrypted = CryptoJS.AES.encrypt(text, encryptionKey).toString();
          resolve(encrypted);
        } catch (error) {
          reject(error);
        }
    });
}

const decrypt = async (encryptedText) => {
    return new Promise((resolve, reject) => {
        try {
          const decrypted = CryptoJS.AES.decrypt(encryptedText, encryptionKey).toString(CryptoJS.enc.Utf8);
          resolve(decrypted);
        } catch (error) {
          reject(error);
        }
    });
}

const decryptAllValues = async (data) => {
    try {
        let result = [];
        await Promise.all(data.map(async (item) => {
            let val = await decrypt(item.msg);
            item.msg = val;
            result.push(item);
        }));
        return result;
    } catch (error) {
        return(error.message);
    }
}

module.exports = {
    encrypt,
    decrypt,
    decryptAllValues
}