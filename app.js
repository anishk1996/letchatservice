const express = require('express');
const bodyParser = require('body-parser');
var cors = require("cors");
const app = express();
require("./src/middlewares/connection");

// routes configured
const loginRoute = require('./src/routes/login');
const signupRoute = require('./src/routes/signup');
const usersRoute = require('./src/routes/user');
const chatRoute = require('./src/routes/chat');
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);


// request routing
app.use('/login', loginRoute);
app.use('/signup', signupRoute);


//request to get all users
app.use('/users', usersRoute);

// request to create chat room
app.use('/chat', chatRoute);



/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ 'message': err.message });

    return;
});


module.exports = app;