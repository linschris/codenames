const socket = io();
let createButton = document.getElementById('create-room-button')
let joinButton = document.getElementById('join-room-button')


createButton.addEventListener("click", () => {
    console.log("HIT HERE.")
    $("body").load("game.html")
    createRoom();
})
joinButton.addEventListener("click", () => {
    console.log("HIT HERE.2")
    $("body").load("game.html")
    joinRoom();
})



// Handles any messages emited by the server and client
socket.on('message', message => {
    console.log(message)
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
    let userName = createARoomForm.username.value;
    let roomName = createARoomForm.roomid.value;
    let password = createARoomForm.password.value;
    socket.emit('createRoom', {user: userName, room: roomName, pass: password})
}

function joinRoom() {
    let createARoomForm = document.getElementById('create-a-room')
    let userName = createARoomForm.username.value;
    let roomName = createARoomForm.roomid.value;
    let password = createARoomForm.password.value;
    socket.emit('joinRoom', {user: userName, room: roomName, pass: password})
}

