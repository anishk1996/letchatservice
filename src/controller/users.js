const userService = require('../service/users');
const bcrypt = require('bcrypt');
const generateAccessToken = require('../middlewares/authentication').generateAccessToken;
const chatService = require('../service/chats');
const messageService = require('../service/message');

async function login(req, res, next) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let result = await userService.findUser(email);
        if (result.length > 0) {
            let passResult = await comparePassword(result, password);
            if (passResult) {
                console.log('Correct user found');
                //generate jwt token
                const token = await generateAccessToken({ username: email });
                console.log('Token generated', token);
                let finalResult = JSON.parse(JSON.stringify(result[0]));
                delete finalResult['password'];
                finalResult['token'] = token;
                res.json(finalResult);
            } else {
                next({ statusCode: 401, message: 'Password is incorrect'});
            }
        } else {
            next({ statusCode: 404, message: 'You are not registered'});
        }
    } catch(err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message })
    }
}

async function signup(req, res, next) {
    try {
        let data = req.body;
        let hashedPass = await passwordHashing(data.password);
        data.password = hashedPass;
        data.name = data.fname + ' ' + data.lname;
        let result = await userService.saveUser(data);
        if (result[0]) {
            console.log('User registered');
            const token = await generateAccessToken({ username: data.email });
            console.log('Token generated', token);
            let finalResult = JSON.parse(JSON.stringify(result[0]));
            delete finalResult['password'];
            delete finalResult['created_on'];
            delete finalResult['updated_on'];
            delete finalResult['__v'];
            finalResult['token'] = token;
            res.json(finalResult);
        } else {
            next({ statusCode:409 , message: "User is already registered" });
        }
    } catch(err) {
        console.log('Error', err.message);
        if (err.code == 11000) {
            next({ statusCode:409 , message: "User with this email is already registered" });
        } else {
            next({ statusCode: 500, message: err.message });
        }
    }
}

async function usersList(req, res, next) {
    try {
        let result = await userService.listAllUser();
        res.json(result);
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });
    }
}

// this function will delete user with all of its data in corresponding collections.
async function deleteUser(req, res, next) {
    try {
        const userId = req.params.userId;
        console.log('delete user', userId);
        let user = await userService.findUserfromId(userId);
        console.log('User data', user);
        if (user) {
            let userDeteleResult = await userService.deleteUser(userId);
            console.log('user deleted', userDeteleResult);
            if (userDeteleResult) {
                let userIds = [ userId ];
                let chatRoomData = await chatService.findChat({ user_ids: { $in: userIds } });
                if (chatRoomData.length > 0) {
                    console.log('Chat Room data', chatRoomData);
                    let chatIds = [];
                    chatRoomData.forEach(element => {
                        chatIds.push(element._id);
                    });
                    console.log('Chat room ids', chatIds);
                    let chatRoomDeleteResult = await chatService.deleteChat({ _id: { $in: chatIds } });
                    if (chatRoomDeleteResult) {
                        let messageData = await messageService.deleteMessages({ 'chat._id': { $in: chatIds } });
                        if (messageData) {
                            res.json({ data: user[0], message: 'User deleted' });
                        }
                    }
                }
            }
        }
        // res.json({ statusCode: 500, message: 'User was not deleted' });
    } catch (err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message });        
    }
}

const passwordHashing = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);
        console.log('Pre hash generated');
        password = hashpass;
        return password;
      } catch (error) {
        console.log('Error while hashing password', error.message);
        throw error; 
      }
}

const comparePassword = async (user, password) => {
    if (!password) throw new Error('No proper password');
    try {
      const result = await bcrypt.compare(password, user[0].password);
      return result;
    } catch (error) {
      console.log('Error while comparing password', error.message);
      throw new Error(error.message);
    }
}

module.exports = {
    login,
    signup,
    usersList,
    deleteUser
}