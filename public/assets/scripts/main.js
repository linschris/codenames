const socket = io("http://localhost:3000");
let createButton = document.getElementById('create-room-button')
let joinButton = document.getElementById('join-room-button')
let newGameButton = document.getElementById('new-game-button')
let guesserButton = document.getElementById('guesser-button')
let spymasterButton = document.getElementById('spymaster-button')
let endTurnButton = document.getElementById('end-turn-button')
let joinRedButton = document.getElementById('join-red-team')
let joinBlueButton = document.getElementById('join-blue-team')
let currentGame = new Game();
let roomID;
let users = [];
let redTeam = [];
let blueTeam = [];
let userIDs = {}; //maps ids to usernames

createButton.addEventListener("click", () => {
    createRoom();
})
joinButton.addEventListener("click", () => {
    joinRoom();
})
newGameButton.addEventListener("click", () => {
    makeNewGame()
})
guesserButton.addEventListener("click", () => {
    currentGame.makeAllInvisibleButClicked();
    let user = userIDs[socket.id]
    socket.emit('userChangeRole', user, 'guesser', roomID)
    socket.emit('game', currentGame)
})
spymasterButton.addEventListener("click", () => {
    currentGame.makeAllVisible();
    let user = userIDs[socket.id]
    socket.emit('userChangeRole', user, 'spymaster', roomID)
})
joinRedButton.addEventListener("click", () => {
    socket.emit('userJoinTeam', 'red-team', socket.id, roomID)
})
joinBlueButton.addEventListener("click", () => {
    socket.emit('userJoinTeam', 'blue-team', socket.id, roomID)
})
endTurnButton.addEventListener("click", () => {
    let user = userIDs[socket.id]
    if((currentGame.redTurn && currentGame.redTeam.includes(user)) || (currentGame.blueTurn && currentGame.blueTeam.includes(user))) {
        socket.emit('endTurn', roomID)
        currentGame.endTurn()
    }
})

// Handles any messages emited by the server and client
socket.on('message', message => {
    console.log(message)
})

socket.on('error-message', errorMessage => {
    let errorDiv = document.getElementById('error-div')
    errorDiv.innerHTML = errorMessage;
})

socket.on('putInGame', function(id) {
    putInGame(id);
    roomID = id;
})

socket.on('joinGame', function(id, gameData) {
    joinGame(id, gameData);
    roomID = id;
})

socket.on('clickGamePiece', (gamePieceID, userID) => {
    console.log("HIT HERE")
    console.log("CLICKED ON: ", gamePieceID)
    let gamePiece = document.getElementById(gamePieceID)
    let user = userIDs[userID]
    console.log(userIDs)
    console.log(userID)
    console.log(user)
    console.log(redTeam)
    console.log(blueTeam)
    console.log(redTeam.includes(user))
    console.log(blueTeam.includes(user))
    if(redTeam.includes(user) && currentGame.redTurn || blueTeam.includes(user) && currentGame.blueTurn) {
        currentGame.showGamePiece(gamePieceID);
    }
})

socket.on('userJoinTeam', (team, userID) => {
    let user = userIDs[userID]
    if(team == 'red-team') {
        let userIndex = blueTeam.indexOf(user)
        if(userIndex != undefined && userIndex > -1) {
            blueTeam.splice(userIndex, 1)
            redTeam.push(user)
        }
    }
    else {
        let userIndex = redTeam.indexOf(user)
        if(userIndex != undefined && userIndex > -1) {
            redTeam.splice(userIndex, 1)
            blueTeam.push(user)
        }
    }
    currentGame.updateTeams(redTeam, blueTeam)
})


socket.on('addData', game => {
    console.log( 'adding in data for new Game'
    )
    currentGame = new Game();
    currentGame.makeNewGame(game)
})

socket.on('updateUsers', roomSockets => {
    users = roomSockets
    console.log('Users in lobby are: ' + users)
    currentGame.updateUsers(users)
    redTeam = currentGame.redTeam;
    blueTeam = currentGame.blueTeam;
})

socket.on('createUserMap', (user, userID) => {
    userIDs[user] = userID;
    console.log('dab', userIDs)
    console.log(roomID)
    socket.emit('userMap', roomID, userIDs)
})

socket.on('updateUserMap', (userMap) => {
    let newUserMap = {...userIDs, ...userMap}
    userIDs = newUserMap
})

socket.on('userRoleChange', (user, role) => {
    currentGame.updateRole(user, role)
})

socket.on('endTurn', function() {
    currentGame.endTurn()
})


function createRoom() {
    let createARoomForm = document.getElementById('create-a-room')
    let user = createARoomForm.username.value;
    let id = createARoomForm.roomid.value;
    let pass = createARoomForm.password.value;
    socket.emit('createRoom', {user, id, pass})
}

function joinRoom() {
    let createARoomForm = document.getElementById('create-a-room')
    let user = createARoomForm.username.value;
    let id = createARoomForm.roomid.value;
    let pass = createARoomForm.password.value;
    socket.emit('joinRoom', {user, id, pass})
}

function allowButtonsToBeClicked(gameRoom) {
    console.log(gameRoom)
    document.querySelectorAll('.game-piece').forEach(item => {
        item.addEventListener('click', event => {
            let gamePieceID = event.target.id;
            let userID = socket.id;
            console.log("userID: " + userID)
            console.log(gamePieceID + " " + gameRoom)
            socket.emit('gamePieceClick', gamePieceID, gameRoom, userID)
        })
    })
}

function disallowButtonsToBeClicked(gameRoom) {
    document.querySelectorAll('.game-piece').forEach(item => {
        item.removeEventListener('click', event => {
            let gamePieceID = event.path[0].id;
            let userID = socket.id;
            console.log("userID: " + userID)
            socket.emit('gamePieceClick', gamePieceID, gameRoom, userID)
        })
    })
}

    



function putInGame(id) {
    console.log(id)
    let gameBody = document.getElementById("game-body");
    let lobbyBody = document.getElementById("lobby-body");
    gameBody.style.display = 'block';
    lobbyBody.style.display = 'none';
    gameBody.style.backgroundColor = 'black';
    currentGame.setUpGameValues();
    currentGame.renderBoard();
    redTeam = currentGame.redTeam;
    blueTeam = currentGame.blueTeam;
    socket.emit('game', currentGame, id)
    allowButtonsToBeClicked(id);
}

function joinGame(id, gameData) {
    console.log("ID:" + id)
    console.log("GAME DATA: ", gameData)
    let gameBody = document.getElementById("game-body");
    let lobbyBody = document.getElementById("lobby-body");
    gameBody.style.display = 'block';
    lobbyBody.style.display = 'none';
    gameBody.style.backgroundColor = 'black';
    currentGame.addinData(gameData)
    currentGame.renderBoard();
    redTeam = currentGame.redTeam;
    blueTeam = currentGame.blueTeam;
    allowButtonsToBeClicked(id)
}

function makeNewGame() {
    console.log('NEW GAME COMING TO USER')
    currentGame = new Game();
    currentGame.newBoard();
    socket.emit('game', currentGame, roomID);
}