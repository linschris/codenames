
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
        this.customWords = [];
        this.teams = [];
        this.redTeam = [];
        this.blueTeam = [];
        this.users = [];
        this.userRoles = [];
        this.win = false;
    }

    addinData(gameData) {
        this.teamRedScore = gameData.teamRedScore;
        this.teamBlueScore = 17 - this.teamRedScore;
        this.maxRed = this.teamRedScore; 
        this.maxBlue = this.teamBlueScore; 
        this.gameWords = gameData.gameWords;
        this.teams = gameData.teams;
        this.users = gameData.users;
        this.userRoles = gameData.userRoles;
        this.decideTurn();
    }

    addinCustomWords(customWords) {
        this.customWordsArray = (customWords.trim()).split(',')
        if(this.customWordsArray.length == 0) {
            return;
        }
        else if(this.customWordsArray.length < 25) {
            let randomWordArray = [];
            let numCustomWords = 0;
            let maxNumberCustomWords = this.customWordsArray.length
            console.log(words.length)
            for(let i = 0; i < 25; i++) {
                let randomNumber = Math.round(Math.random() * 10)
                if(randomNumber > 6 && numCustomWords < maxNumberCustomWords) {
                    randomNumber = Math.floor(Math.random() * this.customWordsArray.length);
                    console.log(randomNumber + ' ' + randomNumber)
                    let randomWord = this.customWordsArray[randomNumber];
                    console.log('hit ehre!')
                    randomWordArray.push(randomWord)   
                    numCustomWords++;
                }
                else {
                    randomNumber = Math.floor(Math.random() * words.length);
                    let randomWord = words[randomNumber];
                    console.log('hit here12ew! 2')
                    console.log(randomNumber + ',' + randomNumber)
                    randomWordArray.push(randomWord)
                }
            }
            this.gameWords = randomWordArray
        }
        else {
            let currentCustomWordsArray = [];
            for(let i = 0; i < 25; i++) {
                console.log(this.customWordsArray.length)
                let randomNumber = Math.round(Math.random() * this.customWordsArray.length);
                console.log(randomNumber)
                let randomWord = this.customWordsArray[randomNumber];
                currentCustomWordsArray.push(randomWord)
            }
            this.gameWords = currentCustomWordsArray
        }
        
    }

    makeNewGame(gameData) {
        this.addinData(gameData)
        this.reWriteBoard()
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
        document.getElementById("gameScore").innerHTML = `Score: <span id='redScore'>${(this.teamRedScore - this.numRedFound)}</span> - <span id='blueScore'>${(this.teamBlueScore - this.numBlueFound)}</span>`;
        if(this.teamRedScore - this.numRedFound == 0) {
            let gameTurn = document.getElementById('gameTurn')
            gameTurn.innerHTML = "RED WINS!"
            this.gameWin()
        }
        if(this.teamBlueScore - this.numBlueFound == 0) {
            let gameTurn = document.getElementById('gameTurn')
            gameTurn.innerHTML = "BLUE WINS!"
            this.gameWin()
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
            for(let i = 0; i < currentGamePiece.classList.length; i++) {
                if(currentGamePiece.classList[i] == 'clicked') currentGamePiece.classList.remove(currentGamePiece.classList[i])
            }
        }
    }
    calculateRandomTeams(numRed, numBlue, numDeath, numNeutral) {
        let randomTeamNumber = Math.floor(Math.random() * 100 + 1);
        if(randomTeamNumber > 90 && numDeath < this.maxDeath) { 
            this.addDeath();
        }
        else if(randomTeamNumber > 50 && numBlue < this.maxBlue) { 
            this.addBlue();
        }
        else if(randomTeamNumber > 25 && numRed < this.maxRed) { 
            this.addRed();
        }
        else if(randomTeamNumber >= 1 && numNeutral < this.maxNeutral) { 
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
            this.calculateScoreTurn(id);
        }
    }

    calculateScoreTurn(id) {
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
            this.endTurn()
        }
        else {
            let gameTurn = document.getElementById('gameTurn')
            if(this.redTurn) {
                gameTurn.innerHTML = "BLUE WINS!"
                this.gameWin()
            }
            else {
                gameTurn.innerHTML = "RED WINS!"
                this.gameWin()
            }
        }
    }
    makeBlueTurn() {
        this.blueTurn = true;
        this.redTurn = false;
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "Currently... Blue Turn."
        gameTurn.classList.remove('team-red')
        gameTurn.classList.add('team-blue')
    }
    
    makeRedTurn() {
        this.redTurn = true;
        this.blueTurn = false;   
        let gameTurn = document.getElementById('gameTurn')
        gameTurn.innerHTML = "Currently... Red Turn." 
        gameTurn.classList.remove('team-blue')
        gameTurn.classList.add('team-red')
    }

    endTurn() {
        if(this.redTurn) {
            this.makeBlueTurn();
        }
        else { 
            this.makeRedTurn(); 
        }
    }

    gameWin() {
        this.win = true;
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

    //create columns element, create 5 card (class="column"), gameBoard.appendChild(card)

    renderBoard() { 
    console.log(this.gameWords)
       let gameBoard = document.getElementById("gameBoard")
        for(let i = 0; i < 5; i++) {
            var row = document.createElement('div')
            row.classList.add('columns')
            for(let j = 1; j <= 5; j++) { 
                let currentColumn = document.createElement('div')
                currentColumn.classList.add('column', 'is-one-fifths')
                row.appendChild(currentColumn)
                let currentCardNumber = (i*5) + j
                currentColumn.innerHTML += `<div class="box game-piece ${this.teams[currentCardNumber-1]}" id="game-piece${currentCardNumber}">${this.gameWords[currentCardNumber-1]}</div>`
            }
            gameBoard.appendChild(row)
        }
       this.makeAllInvisible();
       this.adjustScore();
    }


    newBoard() {
        this.clearBoard()
        this.setUpGameValues()
        this.newWordsAndTeams()
        this.makeAllInvisible()
        this.adjustScore()
    }

    reWriteBoard() {
        this.clearBoard()
        this.newWordsAndTeams()
        this.makeAllInvisible()
        this.adjustScore()
    }

    newWordsAndTeams() {
        for(let i = 1; i <= 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            currentGamePiece.innerHTML = this.gameWords[i-1]
            currentGamePiece.classList.add(this.teams[i-1])
        }
    }


    clearBoard() {
        for(let i = 1; i <= 25; i++) {
            let currentGamePiece = document.getElementById('game-piece'.concat(i));
            this.removeClasses(currentGamePiece)
            currentGamePiece.innerHTML = '';
        }
    }

    renderTeamBoard() {
        let teamBoard = document.getElementById("teamBoard")
        let redUserTeam = document.getElementById("red-user-team")
        let blueUserTeam = document.getElementById("blue-user-team")
        console.log(this.users)
        for(let i = 0; i < this.users.length; i++) {
            if(this.redTeam.includes(this.users[i])) {
                let indexOfUser = this.redTeam.indexOf(this.users[i])
                redUserTeam.innerHTML +=`
                <div class="box user-team-red">
                    ${this.redTeam[indexOfUser]}${this.renderRole(this.userRoles[i])}
                </div>`
            }
            if(this.blueTeam.includes(this.users[i])) {
                let indexOfUser = this.blueTeam.indexOf(this.users[i])
                blueUserTeam.innerHTML +=`
                <div class="box user-team-blue">
                    ${this.blueTeam[indexOfUser]}${this.renderRole(this.userRoles[i])}
                </div>`
            }
        }
    }


    updateUsers(userArray) {
        console.log('userArray: ', userArray)
        this.users = userArray
        this.clearTeamBoard()
        this.putPlayersInTeams()
        this.renderTeamBoard()
    }

    updateTeams(newRedTeam, newBlueTeam) {
        this.redTeam = newRedTeam
        this.blueTeam = newBlueTeam
        let redUserTeam = document.getElementById("red-user-team")
        let blueUserTeam = document.getElementById("blue-user-team")
        redUserTeam.innerHTML = 'Red Team:'
        blueUserTeam.innerHTML = 'Blue Team:'
        this.renderTeamBoard()
    }

    updateRole(user, role) {
        let userIndex = this.users.indexOf(user)
        this.userRoles[userIndex] = role;
        this.clearJustTeamBoard()
        this.renderTeamBoard()
    }

    renderRole(role) {
        if(role == 'spymaster') {
            return '<span class="icon has-text-dark"><i class="fas fa-glasses"></i></span>'
        }
        else {
            return '<span class="icon has-text-dark"><i class="fas fa-question"></i></span>'
        }
    }



    clearTeamBoard() {
        let redUserTeam = document.getElementById("red-user-team")
        let blueUserTeam = document.getElementById("blue-user-team")
        this.redTeam = []
        this.blueTeam = []
        redUserTeam.innerHTML = 'Red Team:'
        blueUserTeam.innerHTML = 'Blue Team:'
    }
    clearJustTeamBoard() {
        let redUserTeam = document.getElementById("red-user-team")
        let blueUserTeam = document.getElementById("blue-user-team")
        redUserTeam.innerHTML = 'Red Team:'
        blueUserTeam.innerHTML = 'Blue Team:'
    }
    

    putPlayersInTeams() {
        console.log('randomizing teams')
        console.log(this.users)
        console.log('this.userRoles=', this.userRoles)
        for(let i = 0 ; i < this.users.length ; i++) {
            if(!this.blueTeam.includes(this.users[i]) || !this.redTeam.includes(this.users[i])) {
                if(i % 2 == 0) {
                    this.redTeam.push(this.users[i])
                }
                else {
                    this.blueTeam.push(this.users[i])
                }
            }
            if(this.userRoles[i] == undefined) {
                this.userRoles.push('guesser')
            }
        }
        console.log(this.users)
        console.log(this.userRoles)
        console.log(this.redTeam)
        console.log(this.blueTeam)
    }

    shuffleUsers() {
        let currentIndex = this.users.length
        while(currentIndex !== 0) {
            var randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            var temporaryValue = this.users[randomIndex];
            this.users[currentIndex] = this.users[randomIndex]
            this.users[randomIndex] = temporaryValue
        }
        return this.users
    }
}







  

  