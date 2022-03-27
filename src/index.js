import axios from 'axios';
import './styles.scss';

// when the page refreshes stop the timeout 
window.addEventListener('load', (event) =>{
  console.log('page is reloaded')
  axios.get('/game/reload')
})


const mainDiv = document.querySelector('.mainDiv')
const lobbyDiv = document.querySelector('.lobbyDiv')
const loginDiv = document.querySelector('.loginDiv')
const RuleDiv = document.querySelector('.rulesDiv')
let currentGame = null
let currentPlayer  ;

// #region login functions 

// login screen
const LabelUsername = document.createElement('label');
LabelUsername.innerHTML = 'Username : ';
const inputUsername = document.createElement('input');
inputUsername.setAttribute('type', 'text');

const LabelPassword = document.createElement('label');
LabelPassword.innerHTML = 'Password : ';
const inputPassword = document.createElement('input');
inputPassword.setAttribute('type', 'password');

const btnLogin = document.createElement('button');
btnLogin.setAttribute('class','greenBtnClass')
btnLogin.innerHTML = 'Sign In';
btnLogin.addEventListener('click', () => { login(); });

const pWrongInput = document.createElement('p');


loginDiv.append(LabelUsername, inputUsername, LabelPassword,
   inputPassword, btnLogin, pWrongInput);



let playerId;
let playerPosition

const login = () => {
  const data = {
    username: inputUsername.value,
    password: inputPassword.value,
  };
  axios
    .post('/users/signin', data)
    .then((response) => {
      console.log(response);
      const { data } = response;
      if (data === false) {
        pWrongInput.innerHTML = 'wrong email or password';
      } else {
        playerId = data.getUser[0];
        console.log(`playerId =`  + playerId)
        loginDiv.style.display = 'none';
        createLobby()
      }
    });
};

// #endregion


// #region lobby functions 
const createGameBtn = document.createElement('button');
createGameBtn.setAttribute('class','greenBtnClass')
const joinGameBtn = document.createElement('button');
joinGameBtn.setAttribute('class','greenBtnClass')
const joinGameLabel = document.createElement('label')
const joinGameInput = document.createElement('input')
const labelPlayer1ID = document.createElement('label')
const createLobby = () =>{

    // labelPlayer1ID.innerHTML = 'Name :'
    lobbyDiv.append(labelPlayer1ID)
    const labelPlayer1Name = document.createElement('label')
    //labelPlayer1Name.innerHTML = playerId.email
    lobbyDiv.append(labelPlayer1Name)

 
    createGameBtn.innerHTML = 'Create Game';
    lobbyDiv.appendChild(createGameBtn);


    joinGameLabel.innerHTML = 'Game Id : '
    lobbyDiv.appendChild(joinGameLabel)

    joinGameInput.setAttribute('type','text')
    lobbyDiv.appendChild(joinGameInput)


    joinGameBtn.innerHTML = 'Join Game'
    lobbyDiv.appendChild(joinGameBtn)
}
    






const createGame = async () =>{
  const mainDiv = document.querySelector('.mainDiv')
  mainDiv.innerHTML = ''
  mainDiv.style.display = ''

  const maindeckDiv = document.createElement('div')
  maindeckDiv.setAttribute('class','maindeckDiv')
  const player1CardsDiv = document.createElement('div')
  player1CardsDiv.setAttribute('class','player1CardsDiv')
  
  // player 1 name
  const DivPlayer1Name = document.createElement('div')
  DivPlayer1Name.innerHTML = `Player 1 `
    // this is the card div for cards 
  const Divplayer1cards = document.createElement('div')
  Divplayer1cards.setAttribute('class','Divplayer1cards')


  player1CardsDiv.append(DivPlayer1Name,Divplayer1cards)


  const player2CardsDiv = document.createElement('div')
  player2CardsDiv.setAttribute('class', 'player2CardsDiv')

  const DivPlayer2Name = document.createElement('div')
  DivPlayer2Name.innerHTML = 'Player 2'
  // this is the card div for cards 
  const Divplayer2cards = document.createElement('div')
  Divplayer2cards.setAttribute('class','Divplayer2cards')

  player2CardsDiv.append(DivPlayer2Name,Divplayer2cards)

  mainDiv.append(player1CardsDiv,maindeckDiv,player2CardsDiv);

  // create deck or game state 
  await axios
  .get('/startGame')
  .then((gameState)=>{
    currentGame = gameState.data;
    currentPlayer = currentGame.currentplayer;
    // console.log(currentPlayer)
    console.log(currentGame)
    // console.log(currentGame.player2Hand)
    // display player1 and player 2 cards 
    displayCards(currentGame.player1Hand , Divplayer1cards)
    displayCards(currentGame.player2Hand , Divplayer2cards)
    //display deck 
    //displayCardDeck(currentGame.cardDeck,maindeckDiv)
    displayCardDeck(currentGame,maindeckDiv)
    playerPosition = 'player1'
    if(playerPosition == 'player1'){
      Divplayer2cards.style.filter  = "blur(10px)"
    }

  })

}

const displayCards = (playerhand, playerDiv) =>{

    for(let i = 0; i < playerhand.length ; i++){
      const SingleCardDiv = document.createElement('div');
      SingleCardDiv.setAttribute('class','SingleCardDiv');
      const cardSuit = document.createElement('div');
      const cardName = document.createElement('div');
      SingleCardDiv.append(cardSuit,cardName)
      cardSuit.innerHTML = playerhand[i].suit;
      cardName.innerHTML = playerhand[i].name;

      playerDiv.appendChild(SingleCardDiv);
      
    }
} 

const cardRankArray = ['Ace','2','3','4','5','6','7','8'
,'9','10','Jack','Queen','King']

const displayCardDeck = (currentGame , deckDiv) =>{

  // left handle card deck count and card deck image
  const leftDeckDiv = document.createElement('div')
  leftDeckDiv.setAttribute('class','leftDeckDiv');
  const remaindingcardDiv = document.createElement('div')
  remaindingcardDiv.setAttribute('class','remaindingcardDiv')
  remaindingcardDiv.innerHTML = `Remainding cards in deck = ${currentGame.cardDeck.length}`
  const numberofBookDiv  = document.createElement('div')
  numberofBookDiv.setAttribute('class' , 'numberofBookDiv')
  numberofBookDiv.innerHTML = 
  `Player 1 book = 0 </br>
   Player 2 book = 0`

  leftDeckDiv.append(remaindingcardDiv,numberofBookDiv)

  // middle handle go fish and buttons and show states 
  const middleDeckDiv = document.createElement('div')
  middleDeckDiv.setAttribute('class','middleDeckDiv');

  const selectDiv = document.createElement('div')
  const cardStateDiv = document.createElement('div')
  cardStateDiv.setAttribute('class','cardStateDiv')
  cardStateDiv.innerHTML =`current state = player 1 go first`

  const gameIDDiv = document.createElement('div')
  gameIDDiv.innerHTML = `Game Id = ${currentGame.id}`

  const resetBtn = document.createElement('button')
  resetBtn.innerHTML = 'Back to lobby'
  resetBtn.setAttribute('class','selectBtnClass')
  resetBtn.addEventListener('click',() =>{ backToLobby()})


  const selectCardSelect = document.createElement('select')
  selectCardSelect.setAttribute('id','selectCardSelect')
  for(let i = 0 ; i < cardRankArray.length ; i ++){
      var option = document.createElement('option')
      option.text = cardRankArray[i]
      selectCardSelect.options.add(option,i)
  }

  const selectCardButton = document.createElement('button')
  selectCardButton.setAttribute('class','selectBtnClass')
  selectCardButton.innerHTML = "Select"
  selectCardButton.setAttribute('id','selectCardButton')
  selectCardButton.addEventListener('click', () =>{GoFish()})

  selectDiv.append(selectCardSelect,selectCardButton)

  

  middleDeckDiv.append(selectDiv,cardStateDiv,gameIDDiv,resetBtn)



  // right handle rules
  const rightDeckDiv = document.createElement('div')
  rightDeckDiv.setAttribute('class','rightDeckDiv');
  const RuleHeader = document.createElement('label')
  RuleHeader.innerHTML = 'Rules';
  var link = document.createElement("a");
  link.setAttribute('href' , "https://www.youtube.com/watch?v=hRpXLSMdve0" )
  link.setAttribute('target','_blank')
  link.innerHTML = 'Link to youtube about rules and how to play'
  rightDeckDiv.append(RuleHeader,link);

  deckDiv.append(leftDeckDiv,middleDeckDiv,rightDeckDiv);
}

const backToLobby = ()=>{
  const mainDiv = document.querySelector('.mainDiv')
  const lobbyDiv = document.querySelector('.lobbyDiv')
  mainDiv.style.display = "none"
  lobbyDiv.style.display =''
  axios.get('/game/reload')

  createLobby()
}
// #endregion


// #region game play function 
// go fish logic 
const GoFish =  () =>{
  const getSelect = document.getElementById('selectCardSelect')
  console.log(getSelect.value)
  console.log(getSelect.selectedIndex)
  const playerSelectedCard = { 
    card : getSelect.value,
    currentPlayer : currentPlayer };
  console.log(playerSelectedCard)
  console.log(`currentGame = ` +currentGame)
  try{
       axios
      .post(`/game/goFish/${currentGame.id}`,playerSelectedCard)
      .then((response)=>{
        // need to update results 
        console.log(response)
        const data = response.data 
        // update player 1 hand 
        const player1cardDiv = document.querySelector('.Divplayer1cards')
        console.log(player1cardDiv)
        player1cardDiv.innerHTML = ''
        displayCards(data.player1Hand,player1cardDiv)
        // update player 2 hand
        const player2cardDiv = document.querySelector('.Divplayer2cards')
        player2cardDiv.innerHTML = ''
        displayCards(data.player2Hand,player2cardDiv)

        // update books 
        const numberofBookDiv = document.querySelector('.numberofBookDiv')
        numberofBookDiv.innerHTML = 
        `Player 1 book = ${data.player1Book} </br>
        Player 2 book = ${data.player2Book}`

        // update remainding cards 
        const remaindingcardDiv = document.querySelector('.remaindingcardDiv')
        remaindingcardDiv.innerHTML = `Remainding cards in deck = ${data.remanindingCards.length}`

        // update current state 
        const cardStateDiv = document.querySelector('.cardStateDiv')
        if(data.winner === ''){
          cardStateDiv.innerHTML = `Current state = player ${data.currentplayer}`
          currentPlayer = data.currentplayer;
        } 
        else{
          cardStateDiv.innerHTML = `winner is  player ${data.winner}`
        }


      })
  }catch(ex){
    console.log(ex)
  }


}
// #endregion


// #region websocket functions 

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
 function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

import "@babel/polyfill";

let gameId = null;
let clientId = null;

(async function() {


  const ws = await connectToServer(); 

  async function connectToServer() {    
        const ws = new WebSocket('ws://localhost:3005/');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
  }
  createGameBtn.addEventListener('click',async () => {

    await createGame()

    const createNewGame = {
        "method" : 'create',
        gameId : currentGame.id,
        clientId : clientId
    }
    ws.send(JSON.stringify(createNewGame))
    lobbyDiv.style.display = 'none'
})

joinGameBtn.addEventListener('click', () =>{

  console.log(joinGameInput.value)

    if(gameId == null){
      gameId = joinGameInput.value
    }
    gameId = joinGameInput.value

    const joinGame = {
      'method' : 'join',
      'clientId' : clientId,
      'gameId' : gameId
    }


    ws.send(JSON.stringify(joinGame));
    lobbyDiv.style.display = 'none'
})


  ws.onmessage=  (message) => {
    //message.data
    //console.log('client side js' + message.data)
    const response = JSON.parse(message.data);

    if(response.method === 'created'){
      gameId = response.game.gameId
      console.log(`game created with game id = ${gameId}`)
    }

    if(response.method === 'join'){
      const joiningMessage = response.message;
      console.log(joiningMessage)
      console.log(response.game)
      if(joiningMessage == 'gameid not in use'){
        lobbyDiv.style.display = ''
        return
      }
      const dbState = response.DBGameState;
      console.log(dbState)
      createDivs()
      const maindeckDiv = document.querySelector('.maindeckDiv')
      dbState.gameState.id = dbState.id
      displayCardDeck(dbState.gameState,maindeckDiv)
      currentGame = dbState
      currentPlayer = dbState.gameState.currentplayer
      playerPosition = 'player2'
     
      if(playerPosition == 'player2'){
          const Divplayer1cards = document.querySelector('.Divplayer1cards')
          Divplayer1cards.style.filter  = "blur(10px)"
      }
      // update accordingly 
    }

    if(response.method === 'connect'){
      clientId = response.clientId
      console.log(`client id set successfullt id = ${clientId}`)
    }

    if(response.method === 'update'){
      //console.log(`updating state in progress`)
      var dbState = response.DBGameState;
      //console.log(dbState)
      updateUI(dbState);
    }
  }
 })();

const updateUI = (dbState) =>{

        const player1cardDiv = document.querySelector('.Divplayer1cards')
        //console.log(player1cardDiv)
        player1cardDiv.innerHTML = ''
        displayCards(dbState.gameState.player1Hand,player1cardDiv)
        // update player 2 hand
        const player2cardDiv = document.querySelector('.Divplayer2cards')
        player2cardDiv.innerHTML = ''
        displayCards(dbState.gameState.player2Hand,player2cardDiv)

        // update books 
        const numberofBookDiv = document.querySelector('.numberofBookDiv')
        numberofBookDiv.innerHTML = 
        `Player 1 books = ${dbState.gameState.player1Book} </br>
        Player 2 books = ${dbState.gameState.player2Book}`

        // update remainding cards 
        const remaindingcardDiv = document.querySelector('.remaindingcardDiv')
        remaindingcardDiv.innerHTML = `Remainding cards in deck = ${dbState.gameState.cardDeck.length}`

        // update current state 
        const cardStateDiv = document.querySelector('.cardStateDiv')
        const selectCardButton = document.getElementById('selectCardButton')
        if(dbState.gameState.winner === ''){
          cardStateDiv.innerHTML = `Current state = player ${dbState.gameState.currentplayer}`
          currentPlayer = dbState.gameState.currentplayer;
        } 
        else{
          cardStateDiv.innerHTML = `Winner is  player ${dbState.gameState.winner}
                                    </br> please return to lobby and create a new game `
          selectCardButton.disabled = true;
        }

        
        // console.log(`player postion ` + playerPosition)
        // console.log(`current player ` + currentPlayer)
        if(playerPosition == 'player1')
        { 
          if(currentPlayer == 2){
              selectCardButton.disabled  = true
          }else{
            selectCardButton.disabled  = false 
          }
          
        }
       if(playerPosition == 'player2'){
          if(currentPlayer == 1){
            console.log('player 1 button disabled')
            selectCardButton.disabled  = true
          }else{
            selectCardButton.disabled  = false 
          }
          
        }
}



const createDivs = () =>{

      const maindeckDiv = document.createElement('div')
      maindeckDiv.setAttribute('class','maindeckDiv')
      const player1CardsDiv = document.createElement('div')
      player1CardsDiv.setAttribute('class','player1CardsDiv')
      
      // player 1 name
      const DivPlayer1Name = document.createElement('div')
      DivPlayer1Name.innerHTML = 'player 1'
        // this is the card div for cards 
      const Divplayer1cards = document.createElement('div')
      Divplayer1cards.setAttribute('class','Divplayer1cards')


      player1CardsDiv.append(DivPlayer1Name,Divplayer1cards)


      const player2CardsDiv = document.createElement('div')
      player2CardsDiv.setAttribute('class', 'player2CardsDiv')

      const DivPlayer2Name = document.createElement('div')
      DivPlayer2Name.innerHTML = 'player 2'
      // this is the card div for cards 
      const Divplayer2cards = document.createElement('div')
      Divplayer2cards.setAttribute('class','Divplayer2cards')

      player2CardsDiv.append(DivPlayer2Name,Divplayer2cards)

      mainDiv.append(player1CardsDiv,maindeckDiv,player2CardsDiv);

   
}

// #endregion

// #region rules div 

const ruleHeaderDiv = document.createElement('div')
const h3Header = document.createElement('h3')
h3Header.innerHTML = "How to play : Go Fish"
const rulesIntrolabel = document.createElement('p')
rulesIntrolabel.innerHTML = 'Go Fish is a fun game that will amuse and entertain even the youngest card players. It is similar to the game Authors.'
ruleHeaderDiv.append(h3Header,rulesIntrolabel)

const ruleBodyDiv = document.createElement('div')

const ThePackHeader = document.createElement('h6')
ThePackHeader.innerHTML = 'THE PACK'
const packIntro = document.createElement('p')
packIntro.innerHTML = 'The standard 52-card pack is used. Some cards will be dealt and the rest will form the stock pile.'

const TheObjectiveHeader = document.createElement('h6')
TheObjectiveHeader.innerHTML = 'OBJECTIVE OF THE GAME'
const ObjectiveIntro = document.createElement('p')
ObjectiveIntro.innerHTML = 'The goal is to win the most "books" of cards. A book is any four of a kind, such as four kings, four aces, and so on.'


const TheDealHeader = document.createElement('h6')
TheDealHeader.innerHTML = 'THE DEAL'
const DealIntro = document.createElement('P')
DealIntro.innerHTML = 'Any player deals one card face up to each player. The player with the lowest card is the dealer. The dealer shuffles the cards, and the player to the right cuts them. </br>The dealer completes the cut and deals the cards clockwise one at a time, face down, beginning with the player to the left. If two or three people are playing, each player receives seven cards. If four or five people are playing, each receives five cards. The remainder of the pack is placed face down on the table to form the stock.'

const ThePlayHeader = document.createElement('h6')
ThePlayHeader.innerHTML = 'THE PLAY'
const PlayIntro = document.createElement('P')
PlayIntro.innerHTML = `The player to the left of the dealer looks directly at any opponent and says, for example, "Give me your kings," usually addressing the opponent by name and specifying the rank that they want, from ace down to two. The player who is "fishing “must have at least one card of the rank that was asked for in their hand. The player who is addressed must hand over all the cards requested. If the player has none, they say, "Go fish!" and the player who made the request draws the top card of the stock and places it in their hand.</br>If a player gets one or more cards of the named rank that was asked for, they are entitled to ask the same or another player for a card. The player can ask for the same card or a different one. So long as the player succeeds in getting cards (makes a catch), their turn continues. When a player makes a catch, they must reveal the card so that the catch is verified. If a player gets the fourth card of a book, the player shows all four cards, places them on the table face up in front of everyone, and plays again.</br>If the player goes fishing without "making a catch" (does not receive a card he asked for), the turn passes to the left.</br>The game ends when all thirteen books have been won. The winner is the player with the most books. During the game, if a player is left without cards, they may (when it's their turn to play), draw from the stock and then ask for cards of that rank. If there are no cards left in the stock, they are out of the game.`


ruleBodyDiv.append(ThePackHeader,packIntro,TheObjectiveHeader
  ,ObjectiveIntro,TheDealHeader,DealIntro,ThePlayHeader,PlayIntro)
RuleDiv.append(ruleHeaderDiv,ruleBodyDiv)
// #endregion

