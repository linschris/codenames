
/*
    Goal:
     - make teams, make it so you can join a team(by deafult join red until run out of room, then join other room)
     ^ fix this functionality
*/
/* fonts:

font-family: 'Poppins', sans-serif;
font-family: 'Raleway', sans-serif;
*/



let numRedFound = 0; let numBlueFound = 0;
let teamRedScore = Math.round(Math.random() * 1 + 8);
let teamBlueScore = 17 - teamRedScore;

let blueTurn = true;
let redTurn = false;



function adjustScore() {
    document.getElementById("gameScore").innerHTML = 'Score:' + (teamRedScore - numRedFound) + '-' + (teamBlueScore - numBlueFound);
    if(teamRedScore - numRedFound == 0) {
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "RED WINS!"
    }
    if(teamBlueScore - numBlueFound == 0) {
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "BLUE WINS!"
    }
}


window.onload = document.querySelectorAll('.game-piece').forEach(item => {
    item.addEventListener('click', event => {
        showGamePiece(event.path[0].id)
    })
})

window.onload = function() {
    this.adjustScore();
    this.setUpNewBoard();
}

function decideTurn() {
    if(teamRedScore > teamBlueScore) makeRedTurn();
    else {
        makeBlueTurn();
    }   
}


const maxRed = teamRedScore; const maxBlue = teamBlueScore; const maxDeath = 1; const maxNeutral = 7;
let numRed = 0; let numBlue = 0; let numDeath = 0; let numNeutral = 0;




function setUpNewBoard() {
    numBlue = 0; numRed = 0; numDeath = 0; numNeutral = 0;
    this.decideTurn();
    //removeClasses();
    for(let i = 1; i <= 25; i++) {
        console.log(i)
        //Gives each of the gamepieces a random word.
        let randomNumber = Math.round(Math.random() * words.length);
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        let randomWord = words[randomNumber];
        currentGamePiece.innerHTML = randomWord;
        //Gives each of the gampieces a random team, neutrak, or death type.
        console.log(numRed + " " + numBlue + " " + numDeath + " " + numNeutral)
        removeClasses(currentGamePiece);
        calculateRandomTeams(currentGamePiece,numRed,numBlue,numDeath,numNeutral)
        currentGamePiece.classList.add('invisible-to-guesser')
    }
}


function removeClasses(currentGamePiece) {
    currentGamePieceClasses = currentGamePiece.classList;
    for(var i = 0; i < currentGamePieceClasses.length; i++) {
        let gameClass = currentGamePieceClasses[i];
        if(gameClass === "team-red" || gameClass === "team-blue" || gameClass === "team-death" || gameClass === "team-neutral") {
            currentGamePiece.classList.remove(gameClass)
        }
    }
    


    for(let i = 1; i <= 25; i++) {
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        if(!currentGamePiece.classList[1] == undefined) {
            currentGamePiece.classList.remove(currentGamePiece.classList[1])
        }
    }
}


function calculateRandomTeams(currentGamePiece, numRed, numBlue, numDeath, numNeutral) {
    let randomTeamNumber = Math.floor(Math.random() * 4 + 1);
    if(randomTeamNumber == 4 && numDeath < maxDeath) { 
        currentGamePiece.classList.add('team-death');
        addDeath();
    }
    else if(randomTeamNumber == 3 && numBlue < maxBlue) { 
        currentGamePiece.classList.add('team-blue'); 
        addBlue();
    }
    else if(randomTeamNumber == 2 && numRed < maxRed) { 
        currentGamePiece.classList.add('team-red'); 
        addRed();
    }
    else if(randomTeamNumber == 1 && numNeutral < maxNeutral) { 
        currentGamePiece.classList.add('team-neutral') 
        addNeutral();
    }
    else {
        calculateRandomTeams(currentGamePiece, numRed, numBlue, numDeath, numNeutral)
    }
}
function addRed() { numRed++; } function addBlue() { numBlue++; } function addDeath() { numDeath++; } function addNeutral() { numNeutral++; }



function showGamePiece(id) {
    let currentGamePiece = document.getElementById(id);
    currentGamePiece.classList.remove('invisible-to-guesser')
    if(!currentGamePiece.classList.contains('clicked')) {
        currentGamePiece.classList.add('clicked')
        calculateST(id);
    }
}

function calculateST(id) {
    let currentGamePiece = document.getElementById(id);
    if(currentGamePiece.classList.contains('team-red')) {
        numRedFound++;
        adjustScore();
        if(blueTurn) {
            makeRedTurn();
        }
    }
    else if(currentGamePiece.classList.contains('team-blue')) {
        numBlueFound++;
        adjustScore();
        if(redTurn) {
            makeBlueTurn();
        }
    }
    else if(currentGamePiece.classList.contains('team-neutral')) {
        if(redTurn) makeBlueTurn();
        else { makeRedTurn(); }
    }
    else {
        let gameTurn = document.getElementById('gameTurn')
        if(redTurn) {
            gameTurn.innerHTML = "BLUE WINS!"
        }
        else {
            gameTurn.innerHTML = "RED WINS!"
        }
    }
}


function makeBlueTurn() {
    blueTurn = true;
    redTurn = false;
    let gameTurn = document.getElementById('gameTurn')
    gameTurn.innerHTML = "Currently... Blue Turn."
}

function makeRedTurn() {
    redTurn = true;
    blueTurn = false;   
    let gameTurn = document.getElementById('gameTurn')
    gameTurn.innerHTML = "Currently... Red Turn." 
}


function makeAllVisible() {
    for(let i = 1; i <= 25; i++) {
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        currentGamePiece.classList.remove('invisible-to-guesser')
    }
}

function makeAllInvisibleButClicked() {
    for(let i = 1; i <= 25; i++) {
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        if(!currentGamePiece.classList.contains('clicked')) {
            currentGamePiece.classList.add('invisible-to-guesser')
        }
    }
}

function makeAllInvisible() {
    for(let i = 1; i <= 25; i++) {
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        currentGamePiece.classList.add('invisible-to-guesser')
    }
}

/*
var lis = document.querySelectorAll('#myList li');
for(var i=0; li=lis[i]; i++) {
    li.parentNode.removeChild(li);
}
*/

function addPlayerRed() {
    let blueTeam = document.querySelector("#blueTeam li")
    console.log(blueTeam.childNodes[0])
    if(blueTeam == null) {
        console.log("EMPTY BLUE TEAM. DO NOTHING.")
    }
    else {
        let blueTeam = document.querySelector("#blueTeam li")
        let indexOfUser = -1;
        for(let i = 0; i < blueTeam.childNodes.length; i++) {
            console.log(blueTeam.childNodes[i])
            console.log("User1")
            if(blueTeam.childNodes[i] === 'User1') {
                console.log(i)
                indexOfUser = i;
            }
        }
        
        console.log(indexOfUser)
        if(indexOfUser != -1) {
            console.log(blueTeam.children)
            blueTeam.removeChild(blueTeam.childNodes[indexOfUser])
        }
        
    }
    addPlayerToTeam("redTeam", "User1")
 }


  function addPlayerBlue() {
    
    addPlayerToTeam("blueTeam", "User1")
  }

  function addPlayerToTeam(teamName, userName) {
    var ul = document.getElementById(teamName);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(userName));
    ul.appendChild(li);
  }

  function switchTeams(FromTeam, ToTeam, element) {
    var blueTeam = document.querySelector("#" + FromTeam + " li");
    console.log(blueTeam)
    console.log("HIT")

  }

  function moveItem(e) {
    var moveTo = this.parentElement.parentElement.id == "redTeam" ? blueTeam : redTeam;
    moveTo.appendChild(this.parentElement);
}