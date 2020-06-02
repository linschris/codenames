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

    socket.on('joinRoom', ({user, room, pass}) => {
        //const player = userJoin(socket.id, username, room);
        socket.join(room);
        socket.to(room).emit('message', 'A user has joined the server.')
        console.log(room);

        console.log(`User ${user} has joined ${room} with password ${pass}`)
    })

    socket.on('createRoom', ({user, id, pass}) => {
        console.log(`User ${user} has created room ${id} with password ${pass}`)
        const newRoom = { 
            id,
            pass,
            sockets: []
        }
        rooms[newRoom.id] = newRoom;
        console.log(newRoom)
        socket.join(newRoom);
        console.log(newRoom.sockets);
        //callback();
    })
})

/* http.listen() -> tells server to listen at a port (3000) */
http.listen(port, function() {
    console.log("Server is listening on port: ", port)
})
