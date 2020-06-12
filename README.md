#Codenames
###by Christopher Linscott

Link to website: https://linschris-codenames.glitch.me/

###What is Codenames?

It's a card game in which there are:
*4 people form 2 teams:
  *In each of these teams, there are two roles:
    *Spymasters: These people can see the 'teams' of the cards (which cards are red, blue, neutral, or death)
    *Guessers: These people, from clues of the spymaster, are meant to guess only the cards of their team.
The goal for either team is to pick all the cards of their respective team before the other team.
- So how a game will normally go is:
  - A spymaster gives a clue to hint the guessers toward their own team cards (Ex: 'Dog 3' to hint at ball, fetch, husky)
  - The guessers will be given n + 1 tries (n being the number of cards the spymasters says his clue is meant to reveal) 
  - If the guessers guess:
    *Their own team's card: The turn continues and they attempt to reveal more of their team's cards
    *The other team's card: The turn stops, the enemy team earns a point(losing a card they need to reveal) and becomes enemy's turn
    *A neutral card: The turn stops and switches to the enemy
    *A death card: Automatic lose: The team that picks this card loses the game automatically.

###If you want to look deeper into source code:
- Specific files to look into:
  - app.js -> represents server-side code, takes in 'emit's (message) from the client and broadcasts an event(such as flip a card) to rest of users
  - main.js -> represents client-side code, takes in 'emit's'(message) from server to update their own game
  - script.js -> holds the Game class, which stores all the users, teams, cards, and is changed from updates from main.js

