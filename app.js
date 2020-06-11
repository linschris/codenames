/* Variables/Modules for creating HTTP server on port (3000) and listening */
const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 3000;
const http = require('http').Server(app)
const io = require("socket.io")(http)
let rooms = {}
let gameMap = {}
let userMap = undefined;

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
        let roomToJoin = rooms[id];
        if((user === '') || (id === '') || (pass === '')) {
            socket.emit('error-message', 'You left something empty.')
        }
        else if(roomToJoin === undefined) {
                socket.emit('error-message', 'Room not found.')
        }
        else if(roomToJoin.pass !== pass) {
            socket.emit('error-message', 'Password incorrect.')
        }
        else if(roomToJoin.sockets.find(userName => user == userName) !== undefined) {
            socket.emit('error-message', 'Username taken.')
        }
        else {
            socket.join(id);
            socket.to(id).emit('message', 'A user has joined the server.')
            console.log(id);
            console.log(`User ${user} has joined room ${id} with password ${pass}`)
            roomToJoin.sockets.push(user)
            console.log(roomToJoin.sockets)
            console.log(roomToJoin);
            console.log("gameMap: ", gameMap[id])
            socket.emit('joinGame', id, gameMap[id])
            socket.emit('updateUsers', rooms[id].sockets)
            socket.to(id).emit('updateUsers', rooms[id].sockets)
            socket.emit('createUserMap', socket.id, user)
        }
    })

    socket.on('createRoom', ({user, id, pass}) => {
        if((user === '') || (id === '') || (pass === '')) {
            socket.emit('error-message', 'You have left something empty.')
        }
        else if(rooms[id] !== undefined) {
            socket.emit('error-message', 'This room already exists.')
        }
        else {
            let newRoom = {
                id,
                pass,
                sockets: [],
            }
            rooms[newRoom.id] = newRoom;
            console.log(`Client ${user} wants to create ${id} with password ${pass}`)
            socket.join(id)
            newRoom.sockets.push(user);
            socket.emit('putInGame', id)
            socket.emit('updateUsers', rooms[id].sockets)
            socket.emit('createUserMap', socket.id, user)
        }    
    })

    socket.on('game', (currentGame, roomID) => {
        gameMap[roomID] = currentGame;
        //socket.emit('addData', currentGame)
        socket.broadcast.to(roomID).emit('addData', currentGame)
    })


    socket.on('gamePieceClick', (gamePieceID, gameRoom, userID) => { 
        socket.emit('clickGamePiece', gamePieceID, userID)
        socket.to(gameRoom).emit('clickGamePiece', gamePieceID, userID)
    })


    socket.on('userMap', (roomID, userIDs) => {
        console.log('USERID: ', userIDs)
        console.log('ROOMID: ', roomID)
        if(userMap !== undefined) {
            let newUserMap = { ...userMap, ...userIDs }
            userMap = newUserMap 
        }
        else {
            userMap = userIDs
        }
        console.log('userMap: ', userMap)
        socket.emit('updateUserMap', userMap)
        socket.to(roomID).emit('updateUserMap', userMap)
    })

    socket.on('userJoinTeam', (team, userID, roomID) => {
        socket.emit('userJoinTeam', team, userID)
        socket.to(roomID).emit('userJoinTeam', team, userID)
    })

    socket.on('new-game', function() {
        socket.emit('new-game')
    })

})

/* http.listen() -> tells server to listen at a port (3000) */
http.listen(port, function() {
    console.log("Server is listening on port: ", port)
})
