const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let userCount = 0; // Tracks the number of connected users
const messages = []; // Stores all messages

app.use(express.static('public'));

io.on('connection', (socket) => {
    userCount++;
    const username = `User${userCount}`;
    console.log(`${username} connected`);

    // Send the existing message history to the new user
    socket.emit('messageHistory', messages);

    // Notify the client of their username
    socket.emit('setUsername', username);

    // Handle incoming messages
    socket.on('message', (data) => {
        // Add the message to the history
        messages.push(data);

        // Broadcast the message to all connected clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
