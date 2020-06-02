/* Variables/Modules for creating HTTP server on port (3000) and listening */
const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 3000;
const http = require('http').Server(app)
const io = require("socket.io")(http)
let rooms = []

/* Directory page files */
const homePage = __dirname+ '/public/index.html'
const gamePage = __dirname+ '/public/game.html'

app.use(express.static(path.join(__dirname, 'public')))
/* GET handlers --> take in the client's request (req) and respond (res) with a file or message*/
/* Home page --> Give client homepage */
app.get('/', (req, res) => {
    res.sendFile(homePage)
})

// When a user connects, logs them as a connection. io.on acts as a handler.
// The socket arrow function is representative of a connected web socket to the user.
io.on('connection', (socket) => {
    console.log('A new user has connected.')
    socket.emit('message', 'Welcome to Codenames!')
    // And for disconnects, do the same thing.
    socket.on("disconnect", () => {
        io.emit('message', 'A user has left the server.')
    })

    socket.on('joinRoom', ({user, id, pass}) => {
        console.log(`User ${user} wants to join room ${id} with password ${pass}`)
        let roomToJoin = rooms.find(createdRoom => createdRoom.id == room)
        if((user === '') || (id === '') || (pass === '')) {
            socket.emit('error-message', 'You left something empty.')
        }
        else if(roomToJoin === undefined) {
                socket.emit('error-message', 'Room not found.')
        }
        else if(roomToJoin.pass !== pass) {
            socket.emit('error-message', 'Password incorrect.')
        }
        else {
            socket.join(id);
            socket.to(id).emit('message', 'A user has joined the server.')
            console.log(id);
            console.log(`User ${user} has joined room ${id} with password ${pass}`)
            roomToJoin.sockets.push(user)
            console.log(roomToJoin.sockets)
            console.log(roomToJoin);
        }
    })

    socket.on('createRoom', ({user, id, pass}) => {
        if((user === '') || (id === '') || (pass === '')) {
            socket.emit('error-message', 'You have left something empty')
        }
        else {
            let newRoom = {
                id,
                pass,
                sockets: []
            }
            rooms[newRoom.id] = newRoom;
            console.log(`Client ${user} wants to create ${id} with password ${pass}`)
            socket.join(newRoom)
            newRoom.sockets.push(user);
            console.log(newRoom.sockets)
            //socket.emit('putInGame')
        }    
    })
})

/* http.listen() -> tells server to listen at a port (3000) */
http.listen(port, function() {
    console.log("Server is listening on port: ", port)
})
