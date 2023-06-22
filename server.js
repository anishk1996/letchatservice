const http = require('http');
const port = process.env.PORT || 3000;
const originEndpoint = process.env.ENDPOINT || null;
const app = require('./app');

const server = http.createServer(app);
server.listen(port, () => {
    console.log('Letschat service is running on port ' + port);
})

const option1 = {
    pingTimeout: 60000,
    cors: {
        origin: originEndpoint
    }
}

const option2 = {
    pingTimeout: 60000,
    cors: {}
}

const io = require('socket.io')(server, originEndpoint != null ? option1: option2);

io.on("connection", (socket) => {
    console.log('Connected to socket io.........');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined room', room);
    });

    socket.on('new message', (newMessageReceived) => {
        console.log('New message received', newMessageReceived);
        let chat = newMessageReceived.chat;
        if (!chat.users) {
            return console.log('Chat.users not defined');
        }
        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit('message received', newMessageReceived);
        });
    })
    
    socket.on('send read', (newMessageReceived) => {
        console.log('send read received', newMessageReceived);
        socket.in(newMessageReceived.sender._id).emit('read received', newMessageReceived);
    });

    socket.off('setup', () => {
        console.log('User disconnected');
        socket.leave(userData._id);
    });
    
});