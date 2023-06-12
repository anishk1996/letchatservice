const userService = require('../service/users');
const generateAccessToken = require('../middlewares/authentication').generateAccessToken;

async function login(req, res, next) {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let result = await userService.findUser(email);
        if (result[0].password == password) {
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
    } catch(err) {
        console.log('Error', err.message);
        next({ statusCode: 500, message: err.message })
    }
}

async function signup(req, res, next) {
    try {
        let data = req.body;
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

module.exports = {
    login,
    signup,
    usersList
}