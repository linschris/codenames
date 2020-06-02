const socket = io("http://localhost:3000");
let createButton = document.getElementById('create-room-button')
let joinButton = document.getElementById('join-room-button')


createButton.addEventListener("click", () => {
    console.log("HIT HERE.")
    createRoom();
})
joinButton.addEventListener("click", () => {
    console.log("HIT HERE.2")
    joinRoom();
})



// Handles any messages emited by the server and client
socket.on('message', message => {
    console.log(message)
})

socket.on('error-message', errorMessage => {
    let errorDiv = document.getElementById('error-div')
    errorDiv.innerHTML = errorMessage;
})

socket.on('putInGame', function() {
    console.log("put in game please.")
    putInGame();
})

// Username, room name, pass submit
/*
let createARoomForm = document.getElementById('create-a-room')
console.log(createARoomForm)
createARoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let userName = e.target.elements.username.value;
    let roomName = e.target.elements.roomid.value;
    let password = e.target.elements.password.value;

    console.log(userName + " " + roomName + " " + password);
    socket.emit('joinRoom', {user: userName, room: roomName, pass: password})
   
})
*/

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



function putInGame() {
    let gameBody = document.getElementById("game-body");
    let lobbyBody = document.getElementById("lobby-body");
    console.log("hit hererekrjenwk")
    gameBody.style.display = 'block';
    lobbyBody.style.display = 'none';
}