import axios from 'axios';
import './styles.scss';

const mainDiv = document.querySelector('.mainDiv')
const lobbyDiv = document.querySelector('.lobbyDiv')
const loginDiv = document.querySelector('.loginDiv')
let currentGame = null
let currentPlayer  ;


// login screen
const pUsername = document.createElement('p');
pUsername.innerHTML = 'username : ';
const inputUsername = document.createElement('input');
inputUsername.setAttribute('type', 'text');

const pPassword = document.createElement('p');
pPassword.innerHTML = 'password : ';
const inputPassword = document.createElement('input');
inputPassword.setAttribute('type', 'text');

const btnLogin = document.createElement('button');
btnLogin.innerHTML = 'sign in';
btnLogin.addEventListener('click', () => { login(); });

const pWrongInput = document.createElement('p');

loginDiv.append(pUsername, inputUsername, pPassword, inputPassword, btnLogin, pWrongInput);

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
        // console.log(data.getUser[0].id);
        playerId = data.getUser[0].id;
        console.log(`playerId =`  + playerId)
        //loginDiv.style.display = 'none';
        // create a start game button

        // startGameBtn.innerHTML = 'start game';
        // startGameBtn.addEventListener('click', () => { startGame(); });
        // btnDiv.appendChild(startGameBtn);
      }
    });
};


const createGameBtn = document.createElement('button');
createGameBtn.innerHTML = 'create game';
lobbyDiv.appendChild(createGameBtn);

const joinGameLabel = document.createElement('label')
joinGameLabel.innerHTML = 'game id'
lobbyDiv.appendChild(joinGameLabel)

const joinGameInput = document.createElement('input')
joinGameInput.setAttribute('type','text')
lobbyDiv.appendChild(joinGameInput)

const joinGameBtn = document.createElement('button');
joinGameBtn.innerHTML = 'join game'
lobbyDiv.appendChild(joinGameBtn)



const createGame = async () =>{
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

  // create deck or game state 
  await axios
  .get('/startGame')
  .then((gameState)=>{
    currentGame = gameState.data;
    currentPlayer = currentGame.currentplayer;
    console.log(currentPlayer)
    console.log(currentGame.player1Hand)
    console.log(currentGame.player2Hand)
    // display player1 and player 2 cards 
    displayCards(currentGame.player1Hand , Divplayer1cards)
    displayCards(currentGame.player2Hand , Divplayer2cards)
    //display deck 
    displayCardDeck(currentGame.cardDeck,maindeckDiv)
    playerPosition = 'player1'
    if(playerPosition == 'player1'){
      //Divplayer2cards.style.backgroundColor = rgba(255, 0, 0, 0.5);
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

const cardRankArray = ['ace','2','3','4','5','6','7','8'
,'9','10','jack','queen','king']

const displayCardDeck = (deck , deckDiv) =>{

  // left handle card deck count and card deck image
  const leftDeckDiv = document.createElement('div')
  leftDeckDiv.setAttribute('class','leftDeckDiv');
  const remaindingcardDiv = document.createElement('div')
  remaindingcardDiv.setAttribute('class','remaindingcardDiv')
  remaindingcardDiv.innerHTML = `remainding cards in deck = ${deck.length}`
  const numberofBookDiv  = document.createElement('div')
  numberofBookDiv.setAttribute('class' , 'numberofBookDiv')
  numberofBookDiv.innerHTML = 
  `player 1 book = 0 </br>
   player 2 book = 0`

  leftDeckDiv.append(remaindingcardDiv,numberofBookDiv)

  // middle handle go fish and buttons and show states 
  const middleDeckDiv = document.createElement('div')
  middleDeckDiv.setAttribute('class','middleDeckDiv');

  const selectDiv = document.createElement('div')
  const cardStateDiv = document.createElement('div')
  cardStateDiv.setAttribute('class','cardStateDiv')
  cardStateDiv.innerHTML =`current state = player 1 go first`

  const selectCardSelect = document.createElement('select')
  selectCardSelect.setAttribute('id','selectCardSelect')
  for(let i = 0 ; i < cardRankArray.length ; i ++){
      var option = document.createElement('option')
      option.text = cardRankArray[i]
      selectCardSelect.options.add(option,i)
  }

  const selectCardButton = document.createElement('button')
  selectCardButton.innerHTML = "select"
  selectCardButton.setAttribute('id','selectCardButton')
  selectCardButton.addEventListener('click', () =>{GoFish()})

  selectDiv.append(selectCardSelect,selectCardButton)

  

  middleDeckDiv.append(selectDiv,cardStateDiv)



  // right handle rules
  const rightDeckDiv = document.createElement('div')
  rightDeckDiv.setAttribute('class','rightDeckDiv');
  const RuleHeader = document.createElement('label')
  RuleHeader.innerHTML = 'rules';
  var link = document.createElement("a");
  link.setAttribute('href' , "https://www.youtube.com/watch?v=hRpXLSMdve0" )
  link.setAttribute('target','_blank')
  link.innerHTML = 'link to youtube about rules'
  rightDeckDiv.append(RuleHeader,link);

  deckDiv.append(leftDeckDiv,middleDeckDiv,rightDeckDiv);
}

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
        `player 1 book = ${data.player1Book} </br>
        player 2 book = ${data.player2Book}`

        // update remainding cards 
        const remaindingcardDiv = document.querySelector('.remaindingcardDiv')
        remaindingcardDiv.innerHTML = `remainding cards in deck = ${data.remanindingCards.length}`

        // update current state 
        const cardStateDiv = document.querySelector('.cardStateDiv')
        if(data.winner === ''){
          cardStateDiv.innerHTML = `current state = player ${data.currentplayer}`
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
   
})

joinGameBtn.addEventListener('click', () =>{

    

    if(gameId == null){
      gameId = joinGameInput.value
    }

    const joinGame = {
      'method' : 'join',
      'clientId' : clientId,
      'gameId' : gameId
    }


    ws.send(JSON.stringify(joinGame));

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
      const dbState = response.DBGameState;
      console.log(dbState)
      createDivs()
      const maindeckDiv = document.querySelector('.maindeckDiv')
      displayCardDeck(dbState.gameState.cardDeck,maindeckDiv)
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

  
  // document.body.onmousemove = (evt) => {
  //       const messageBody = { x: evt.clientX, y: evt.clientY };
  //       ws.send(JSON.stringify(messageBody));
  // };



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
        `player 1 book = ${dbState.gameState.player1Book} </br>
        player 2 book = ${dbState.gameState.player2Book}`

        // update remainding cards 
        const remaindingcardDiv = document.querySelector('.remaindingcardDiv')
        remaindingcardDiv.innerHTML = `remainding cards in deck = ${dbState.gameState.cardDeck.length}`

        // update current state 
        const cardStateDiv = document.querySelector('.cardStateDiv')
        if(dbState.gameState.winner === ''){
          cardStateDiv.innerHTML = `current state = player ${dbState.gameState.currentplayer}`
          currentPlayer = dbState.gameState.currentplayer;
        } 
        else{
          cardStateDiv.innerHTML = `winner is  player ${dbState.gameState.winner}`
        }

        const selectCardButton = document.getElementById('selectCardButton')
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
