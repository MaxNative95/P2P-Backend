require('dotenv').config()
const express = require('express');
const http = require('http');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, 
    {useNewUrlParser:true},
     (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});
//port
const port = 3006;
//routes imported
const routes = require('./routes/index');
app.use(routes);

const server = http.createServer(app);

//socket required
const socket = require('socket.io');
const io = socket(server);

const rooms = {};

var STATIC_CHANNELS = [{
    name: 'Global chat',
    participants: 0,
    id: 1,
    sockets: []
},];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// io.on('connection', socket => {
//     /*
//         If a peer is initiator, he will create a new room
//         otherwise if peer is receiver he will join the room
//     */
//     socket.on('join room', roomID => {

//         if(rooms[roomID]){
//             // Receiving peer joins the room
//             rooms[roomID].push(socket.id)
//         }
//         else{
//             // Initiating peer create a new room
//             rooms[roomID] = [socket.id];
//         }

//         /*
//             If both initiating and receiving peer joins the room,
//             we will get the other user details.
//             For initiating peer it would be receiving peer and vice versa.
//         */
//         const otherUser = rooms[roomID].find(id => id !== socket.id);
//         if(otherUser){
//             socket.emit("other user", otherUser);
//             socket.to(otherUser).emit("user joined", socket.id);
//         }
//     });

//     /*
//         The initiating peer offers a connection
//     */
//     socket.on('offer', payload => {
//         io.to(payload.target).emit('offer', payload);
//     });

//     /*
//         The receiving peer answers (accepts) the offer
//     */
//     socket.on('answer', payload => {
//         io.to(payload.target).emit('answer', payload);
//     });

//     socket.on('ice-candidate', incoming => {
//         io.to(incoming.target).emit('ice-candidate', incoming.candidate);
//     })
// });

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    console.log('new client connected');
    socket.emit('connection', null);
    socket.on('channel-join', id => {
        console.log('channel join', id);
        STATIC_CHANNELS.forEach(c => {
            if (c.id === id) {
                if (c.sockets.indexOf(socket.id) == (-1)) {
                    c.sockets.push(socket.id);
                    c.participants++;
                    io.emit('channel', c);
                }
            } else {
                let index = c.sockets.indexOf(socket.id);
                if (index != (-1)) {
                    c.sockets.splice(index, 1);
                    c.participants--;
                    io.emit('channel', c);
                }
            }
        });

        return id;
    });
    socket.on('send-message', message => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        STATIC_CHANNELS.forEach(c => {
            let index = c.sockets.indexOf(socket.id);
            if (index != (-1)) {
                c.sockets.splice(index, 1);
                c.participants--;
                io.emit('channel', c);
            }
        });
    });

});



/**
 * @description This methos retirves the static channels
 */
app.get('/getChannels', (req, res) => {
    res.json({
        channels: STATIC_CHANNELS
    })
});

server.listen(port, () => console.log(`Server is up and running on Port ${port}`));

// var app = require('express')();
// var http = require('http').createServer(app);
// const PORT = 8080;
// var io = require('socket.io')(http);
// const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

// app.get('/', (req,res, next) => {
//     return res.json({ ok : true})
// })

// http.listen(PORT, () => {
//     console.log(`listening on *:${PORT}`);
// });


// io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
//     console.log('new client connected');
//     socket.emit('connection', null);
// });
