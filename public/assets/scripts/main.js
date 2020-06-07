const socket = io("http://localhost:3000");
let createButton = document.getElementById('create-room-button')
let joinButton = document.getElementById('join-room-button')
let newGameButton = document.getElementById('new-game-button')
let guesserButton = document.getElementById('guesser-button')
let spymasterButton = document.getElementById('spymaster-button')
let currentGame = new Game();
let roomID;


createButton.addEventListener("click", () => {
    createRoom();
})
joinButton.addEventListener("click", () => {
    joinRoom();
})
newGameButton.addEventListener("click", () => {
    socket.emit('new-game', roomID)
})
guesserButton.addEventListener("click", () => {
    currentGame.makeAllInvisibleButClicked();
})
spymasterButton.addEventListener("click", () => {
    currentGame.makeAllVisible();
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
})

socket.on('clickGamePiece', function(gamePieceID) {
    console.log("HIT HERE")
    console.log("CLICKED ON: ", gamePieceID)
    currentGame.showGamePiece(gamePieceID);
})

socket.on('new-game', function() {
    console.log('NEW GAME COMING TO USER')
    currentGame = new Game();
    currentGame.setUpGameValues();
    currentGame.newBoard();
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
            let gamePieceID = event.path[0].id;
            console.log(gamePieceID + " " + gameRoom)
            socket.emit('gamePieceClick', gamePieceID, gameRoom)
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
    allowButtonsToBeClicked(id)
}