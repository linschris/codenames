
/*
    Goal:
     - make teams, make it so you can join a team(by deafult join red until run out of room, then join other room)
     ^ fix this functionality
*/
/* fonts:

font-family: 'Poppins', sans-serif;
font-family: 'Raleway', sans-serif;
*/


class Game {
    constructor() {
        //Game variables
        this.numBlueFound = 0;
        this.numRedFound = 0;
        this.teamRedScore = Math.round(Math.random() * 1 + 8);
        this.teamBlueScore = 17 - this.teamRedScore;
        this.blueTurn = true;
        this.redTurn = false;
        this.numBlue = 0;
        this.numRed = 0;
        this.maxRed = this.teamRedScore; 
        this.maxBlue = this.teamBlueScore; 
        this.maxDeath = 1; 
        this.maxNeutral = 7;
        this.gameWords = [];
        this.teams = [];
        //Game functions
    }

    addinData(gameData) {
        this.teamRedScore = gameData.teamRedScore;
        this.teamBlueScore = 17 - this.teamRedScore;
        this.maxRed = this.teamRedScore; 
        this.maxBlue = this.teamBlueScore; 
        this.gameWords = gameData.gameWords;
        this.teams = gameData.teams;
        this.decideTurn();
    }

    setUpGameValues() {
        this.numBlue = 0; this.numRed = 0; this.numDeath = 0; this.numNeutral = 0;
        this.decideTurn();
        for(let i = 1; i <= 25; i++) {
            let randomNumber = Math.round(Math.random() * words.length);
            let randomWord = words[randomNumber];
            this.gameWords.push(randomWord)
            this.calculateRandomTeams(this.numRed,this.numBlue,this.numDeath,this.numNeutral)
        }
    }

    adjustScore() {
        document.getElementById("gameScore").innerHTML = 'Score:' + (this.teamRedScore - this.numRedFound) + '-' + (this.teamBlueScore - this.numBlueFound);
        if(this.teamRedScore - this.numRedFound == 0) {
            let gameTurn = document.getElementById('gameTurn')
            gameTurn.innerHTML = "RED WINS!"
        }
        if(this.teamBlueScore - this.numBlueFound == 0) {
            let gameTurn = document.getElementById('gameTurn')
            gameTurn.innerHTML = "BLUE WINS!"
        }
    }

    decideTurn() {
        if(this.teamRedScore > this.teamBlueScore) this.makeRedTurn();
        else {
            this.makeBlueTurn();
        }   
    }

    removeClasses(currentGamePiece) {
        let currentGamePieceClasses = currentGamePiece.classList;
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
    calculateRandomTeams(numRed, numBlue, numDeath, numNeutral) {
        let randomTeamNumber = Math.floor(Math.random() * 4 + 1);
        if(randomTeamNumber == 4 && numDeath < this.maxDeath) { 
            this.addDeath();
        }
        else if(randomTeamNumber == 3 && numBlue < this.maxBlue) { 
            this.addBlue();
        }
        else if(randomTeamNumber == 2 && numRed < this.maxRed) { 
            this.addRed();
        }
        else if(randomTeamNumber == 1 && numNeutral < this.maxNeutral) { 
            this.addNeutral();
        }
        else {
            this.calculateRandomTeams(numRed, numBlue, numDeath, numNeutral)
        }
    }

  addRed() { this.numRed++; this.teams.push('team-red')}  addBlue() { this.numBlue++; this.teams.push('team-blue') }  addDeath() { this.numDeath++; this.teams.push('team-death') }  addNeutral() {this.numNeutral++; this.teams.push('team-neutral')}

    showGamePiece(id) {
        let currentGamePiece = document.getElementById(id);
        currentGamePiece.classList.remove('invisible-to-guesser')
        if(!currentGamePiece.classList.contains('clicked')) {
            currentGamePiece.classList.add('clicked')
            this.calculateST(id);
        }
    }

    calculateST(id) {
        let currentGamePiece = document.getElementById(id);
        if(currentGamePiece.classList.contains('team-red')) {
            this.numRedFound++;
            this.adjustScore();
            if(this.blueTurn) {
                this.makeRedTurn();
            }
        }
        else if(currentGamePiece.classList.contains('team-blue')) {
            this.numBlueFound++;
            this.adjustScore();
            if(this.redTurn) {
                this.makeBlueTurn();
            }
        }
        else if(currentGamePiece.classList.contains('team-neutral')) {
            if(this.redTurn) this.makeBlueTurn();
            else { this.makeRedTurn(); }
        }
        else {
            let gameTurn = document.getElementById('gameTurn')
            if(this.redTurn) {
                gameTurn.innerHTML = "BLUE WINS!"
            }
            else {
                gameTurn.innerHTML = "RED WINS!"
            }
        }
    }
    makeBlueTurn() {
        this.blueTurn = true;
        this.redTurn = false;
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "Currently... Blue Turn."
    }
    
    makeRedTurn() {
        this.redTurn = true;
        this.blueTurn = false;   
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "Currently... Red Turn." 
    }


    makeAllVisible() {
    for(let i = 1; i <= 25; i++) {
        let currentGamePiece = document.getElementById('game-piece'.concat(i));
        currentGamePiece.classList.remove('invisible-to-guesser')
    }
}

    makeAllInvisibleButClicked() {
        for(let i = 1; i <= 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            if(!currentGamePiece.classList.contains('clicked')) {
                currentGamePiece.classList.add('invisible-to-guesser')
            }
        }
    }

    makeAllInvisible() {
        for(let i = 1; i <= 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            currentGamePiece.classList.add('invisible-to-guesser')
        }
    }

    renderBoard() { 
       let gameBoard = document.getElementById("gameBoard") 
       for(let i = 1; i <= this.gameWords.length; i++) {
          gameBoard.innerHTML += `<div class="game-piece ${this.teams[i-1]}" id="game-piece${i}">${this.gameWords[i-1]}</div>`
          if(i % 5 == 0) gameBoard.innerHTML += '<br>'
       }
       this.makeAllInvisible();
       this.adjustScore();
    }


    newBoard() {
        this.clearBoard()
        this.newWordsAndTeams()
    }

    newWordsAndTeams() {
        for(let i = 1; i < 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            currentGamePiece.innerHTML = this.gameWords[i-1]
            currentGamePiece.classList.add(this.teams[i-1])
        }
    }


    clearBoard() {
        for(let i = 1; i < 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            this.removeClasses(currentGamePiece)
            currentGamePiece.innerHTML = '';
        }
    }

    renderTeamBoard() {
        let teamBoard = document.getElementById("teamBoard")

    }


}







  

  