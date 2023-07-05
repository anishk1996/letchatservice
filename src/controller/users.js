const userService = require('../service/users');
const bcrypt = require('bcrypt');
const generateAccessToken = require('../middlewares/authentication').generateAccessToken;

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
    forgotPassword
}