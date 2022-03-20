/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
  let currentIndex = 0;

  // loop over the entire cards array
  while (currentIndex < cards.length) {
    // select a random position from the deck
    const randomIndex = getRandomIndex(cards.length);

    // get the current card in the loop
    const currentItem = cards[currentIndex];

    // get the random card
    const randomItem = cards[randomIndex];

    // swap the current card and the random card
    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }

  // give back the shuffled deck
  return cards;
};

const makeDeck = function () {
  // create the empty deck at the beginning
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
 function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 


/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Controller Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */
// hash map of game and clients 
const games = {};
const clients = {};

import WebSocket , { WebSocketServer }   from 'ws'

export default function initGamesController(db,wss) {

  
const getGameState = async(gameId) =>{
        const DBGameState = await db.Game.findByPk(gameId);
        console.log(DBGameState)
        return DBGameState;
}



  wss.on('connection', function connection(ws) {

  const updateGameState = async () =>{
  
    for (const g of Object.keys(games)) {
            const game = games[g]
            const DBGameState = await db.Game.findByPk(game.gameId);

           // console.log(`db game state ` +DBGameState)

            const payLoad = {
                "method": "update",
                "game": game,
                'DBGameState': DBGameState
            }

            game.clients.forEach(c=> {
                ws.send(JSON.stringify(payLoad))
            })
        }

      setTimeout(updateGameState, 500);
  }


  // opening of server and creating a new client id and make sure it connected to server 
  let clientId =  guid();
  clients[clientId] = { 'connection': ws };
  const newClient = {
    'method' : 'connect',
    'clientId' : clientId
  }
  ws.send(JSON.stringify(newClient));

  console.log('Parsing session from request...');

    // testing message is working and connection is working on sever side , able to recevice from client 
  ws.on('message', async (message) => {
        //log the received message and send it back to the client
        //console.log('received: %s', message);
        //ws.send(`Hello, you sent -> ${message}`);
        
        const result = JSON.parse(message)
        //console.log(result)
        //const gameId = guid();
    

         
         if(result.method == 'create'){
          updateGameState();
           console.log('creating game')
           const gameId = result.gameId;
           const clientId = result.clientId
           games[gameId] = {
              "method" : 'created',
             "message" : 'game created'  ,
             'gameId' : gameId,
             'clients' : [{   
               "clientId": clientId,
                "color": "Red"}],
           }

           const payLoad = {
             "method" : "created",
             "game" : games[gameId]
           }

           ws.send(JSON.stringify(payLoad))
         }

         
         if(result.method == 'join'){
           console.log('severs side join')
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            if (game.clients.length >= 2) 
            {
                //sorry max players reach
                return;
            }       
            game.clients.push({
                "clientId": clientId,
                "color": "Blue"
            })


            console.log(`game player number = ${game.clients.length}` )

            let CurrentGameState = await getGameState(game.gameId);
            console.log(`current game state ` + CurrentGameState.gameState.cardDeck.length)
            const payLoad = {
              'method' :'join',
              'message' : 'thanks you for joining the game',
               "game": game,
              'DBGameState' : CurrentGameState
            }

            console.log('sending joining game state ')

            ws.send(JSON.stringify(payLoad))
            // game.clients.forEach(c => {
            //     //clients[c.clientId]
            //     ws.send(JSON.stringify(payLoad))
            // })
            //ws.send(JSON.stringify(payLoad))
            console.log('sending joining game state asdsadasd ')
            if(game.clients.length === 2){
              //update state mean getting all the data from created game and send it to 2nd player 
              updateGameState();
            }
         }



         if(result.method == 'update'){
           console.log('update')
         }


    });
});



  // render the main page
  const index = (request, response) => {
    response.render('games/index');
  };

  // create a new game. Insert a new row in the DB.
  const create = async (request, response) => {
    // deal out a new shuffled deck for this game.
    const cardDeck = shuffleCards(makeDeck());
    let player1Hand = []
    let player1Book = 0;
    let player2Hand = []
    let player2Book = 0;
    let currentplayer = 1 ;
    let winner = '';
    for(let i = 0 ; i < 7 ; i++){
        player1Hand.push(cardDeck.pop())
        player2Hand.push(cardDeck.pop())
    }
    const newGame = {
      gameState: {
        cardDeck,
        player1Hand,
        player1Book,
        player2Hand,
        player2Book,
        currentplayer,
        winner,
      },
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        cardDeck : game.gameState.cardDeck,
        player1Hand: game.gameState.player1Hand,
        player2Hand: game.gameState.player2Hand,
        player1Book : game.gameState.player1Book,
        player2Book : game.gameState.player2Book,
        currentplayer : game.gameState.currentplayer,
        winner : game.gameState.winner,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      // make changes to the object
      const playerHand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];

      // update the game with the new info
      await game.update({
        gameState: {
          cardDeck: game.gameState.cardDeck,
          playerHand,
        },

      });

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        playerHand: game.gameState.playerHand,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  function filterByCardName(card,value){
    if(card.name.toString === value){
      return false
    }
    return true;
  }

  

  const goFish =  async (request,response) =>{
    console.log(request.params.id)
    console.log(request.body.card)

    try{
      const game = await db.Game.findByPk(request.params.id);
      let player1Cards  = game.gameState.player1Hand
      let player2Cards = game.gameState.player2Hand
      let currentplayer = request.body.currentPlayer  ;
      let didplayerGetCard = false;
      let winner = game.gameState.winner;
  
      let selectedValue = request.body.card
      console.log(selectedValue)
      console.log(`current player = ` + currentplayer)
      // if current player is player 1
      if(currentplayer === 1) 
      {
         
          for(let i = 0 ; i < player2Cards.length ; i++)
          {
            if(player2Cards[i].name.toString() 
            === selectedValue)
            {
              player1Cards.push(player2Cards[i])
              didplayerGetCard = true; ;
            }
          }
          // remove the from array 
        player2Cards =  player2Cards.filter(function(value, index, arr){ 
            console.log(value)
            return value.name.toString() !=  selectedValue;
        })
        

      }
      else // current player is player 2 
      {
        for(let i = 0 ; i < player1Cards.length ; i++)
        {
            if(player1Cards[i].name.toString()
             === selectedValue)
            {
              player2Cards.push(player1Cards[i])
              didplayerGetCard = true;
            }
        }
          // remove the from array 
            player1Cards =  player1Cards.filter(function(value, index, arr){ 
            console.log(value)
            return value.name.toString() !=  selectedValue;
        })

      }    

      console.log(didplayerGetCard)
      // change the current player turn 
      if(didplayerGetCard === true){ 
        currentplayer = request.body.currentPlayer
      }
      else
       // if they did not get the card the requester need to draw a card from deck 
      {
        // switch to the other player 
        if(currentplayer==1){
          player1Cards.push(game.gameState.cardDeck.pop())
           currentplayer = 2

        }else{
          currentplayer = 1
          player2Cards.push(game.gameState.cardDeck.pop())
        }
      }
      console.log(`current player ` + currentplayer)

      // check if there any books then remove them and update game state 
      //i only need to check the winners 
      let addCardToBook = null ;
      let addCardToBookIsTrue = false ;
      let cardNameTally = {};
      if(didplayerGetCard){
        let checkHand = null ;
          if(currentplayer ==1){
              checkHand = player1Cards
          }else{
            checkHand = player2Cards
          }
          console.log(checkHand)
          for(let i = 0 ; i < checkHand.length; i++)
          {
            var cardName = checkHand[i].name;
            if(cardName in cardNameTally){
              cardNameTally[cardName] += 1;
            }
            else
            {
              cardNameTally[cardName] = 1;
            }
          }

          // check if there 4 of the same kind
          for(cardName in cardNameTally){
            //console.log(` ${cardNameTally[cardName]} ${cardName}`)
            if(cardNameTally[cardName] === 4){
                addCardToBook = cardName ;
                addCardToBookIsTrue = true;
            }
          }
          // i need to remove card from hand and add to book 
          if(addCardToBookIsTrue){
            // add current player book count 
            if(currentplayer == 1){
                 game.gameState.player1Book += 1
            }else{
              game.gameState.player2Book += 1
            }
            // filter out the same 4 cards 
            checkHand =  checkHand.filter(function(value, index, arr){ 
            console.log(`check hand `+ value)
            return value.name.toString() !=  addCardToBook;
             })
             console.log(checkHand)
            if(currentplayer ==1)
            {
              player1Cards = checkHand
            }
            else
            {
              player2Cards = checkHand
            }
          }
      }
      // winning book logic 
      if(game.gameState.player1Book >= 7){
        winner = 'player 1'
      }
           if(game.gameState.player2Book >= 7){
        winner = 'player 2'
      }


      await game.update({
        gameState :{
          cardDeck : game.gameState.cardDeck,
          player1Hand: player1Cards,
          player2Hand: player2Cards,
          player1Book : game.gameState.player1Book,
          player2Book : game.gameState.player2Book,
          currentplayer : currentplayer,
          winner : winner,
        }
      })

      response.send({
        player1Hand : player1Cards,
        player2Hand : player2Cards,
        currentplayer : currentplayer,
        player1Book :  game.gameState.player1Book,
        player2Book : game.gameState.player2Book,
        remanindingCards : game.gameState.cardDeck,
        winner : winner,
      })
   



    }catch(ex){
      console.log(ex)
    }
  }

  // return all functions we define in an object
  // refer to the routes file above to see this used
  return {
    deal,
    create,
    index,
    goFish,
  };
}
