import db from './models/index.mjs';

import { resolve } from 'path';

import initGamesController from './controllers/gamesController.mjs';
import initUserController from './controllers/usersController.mjs';



export default function bindRoutes(app,wss) {
  const GamesController = initGamesController(db,wss);
  const UsersController = initUserController(db,wss);

  app.get('/',(req,res)=>{
    res.sendFile(resolve('dist','main.html'));
  })

  app.get('/startGame', GamesController.create);
  app.post('/game/goFish/:id',GamesController.goFish)
    app.post('/users/signin', UsersController.getUserById);
}
