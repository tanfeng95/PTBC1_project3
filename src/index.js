import axios from 'axios';
import './styles.scss';

const mainDiv = document.querySelector('.mainDiv')
let currentGame = null
let currentPlayer  ;



const createGame = () =>{
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
  axios
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
import "@babel/polyfill";
(async function() {

    const ws = await connectToServer();    

    document.body.onmousemove = (evt) => {
        const messageBody = { x: evt.clientX, y: evt.clientY };
        ws.send(JSON.stringify(messageBody));
    };

    ws.onmessage = (webSocketMessage) => {
        const messageBody = JSON.parse(webSocketMessage.data);
        const cursor = getOrCreateCursorFor(messageBody);
        cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
    };
        
    async function connectToServer() {    
        const ws = new SockJS('http://localhost:7071/ws');
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if(ws.readyState === 1) {
                    clearInterval(timer);
                    resolve(ws);
                }
            }, 10);
        });   
    }

    function getOrCreateCursorFor(messageBody) {
        const sender = messageBody.sender;
        const existing = document.querySelector(`[data-sender='${sender}']`);
        if (existing) {
            return existing;
        }
        
        const template = document.getElementById('cursor');
        const cursor = template.content.firstElementChild.cloneNode(true);
        const svgPath = cursor.getElementsByTagName('path')[0];    
            
        cursor.setAttribute("data-sender", sender);
        svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);    
        document.body.appendChild(cursor);

        return cursor;
    }

})();


createGame()
