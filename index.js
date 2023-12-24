const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const moment = require('moment');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { newUser, getIndividualRoomUsers, formatMessage, getActiveUser, exitRoom } = require('./helper/helper');

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);
        socket.join(user.room);

        socket.broadcast.to(user.room).emit('message', formatMessage("Aitribe", `${user.username} has joined the room`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
    });

    socket.on('chatMessage', (msg) => {
        const user = getActiveUser(socket.id);

        if (msg.startsWith('/pm')) {
            const messageArray = msg.split(' ');
            const recipientUsername = messageArray[1];
            const privateMessage = messageArray.slice(2).join(' ');

            const recipient = getIndividualRoomUsers(user.room).find((user) => user.username === recipientUsername);

            if (recipient && recipient.id !== user.id) {
                io.to(recipient.id).emit('message', formatMessage(`(Private from ${user.username})`, privateMessage));
                socket.emit('message', formatMessage(`(Private to ${recipient.username})`, privateMessage));
            } else {
                socket.emit('message', formatMessage('Aitribe', 'User not found or cannot send private message to yourself.'));
            }
        } else {
            io.to(user.room).emit('message', formatMessage(user.username, msg));
        }
    });

    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage("Aitribe", `${user.username} has left the room`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
