export default function initUserController(db,wss) {

    wss.on('connection', function connection(ws) {
  //console.log('Parsing session from request...');

  // open and close connection 
    ws.on("open", () => console.log("opened!"))
    ws.on("close", () => console.log("closed!"))

    // testing message is working and connection is working on sever side , able to recevice from client 
    ws.on('message', (message) => {
        // //log the received message and send it back to the client
        // console.log('received: %s', message);
        // ws.send(`Hello, you sent -> ${message}`);
    });


    //send immediatly a feedback to the incoming connection    
   // ws.send('Hi there, I am a WebSocket server');
});
  

  const getUserById = async (request, response) => {
    try {
      console.log('sadasdasds');
      console.log(request.body.username);
      console.log(request.body.password);

      const getUser = await db.User.findAll(
        {
          where: {
            email: request.body.username,
          },
        },
      );
      console.log(getUser);
      if (getUser.length === 0) {
        response.send(false);
      }

      // console.log(getUser[0]);
      const { dataValues } = getUser[0];
      console.log(dataValues.email);
      if (dataValues.email === dataValues.password) {
        response.send({ getUser });
      } else {
        response.send(false);
      }

      // response.send({ getUser });
    } catch (error) {
      console.log(error);
    }
  };
  const findAllUser = async (request, response) => {
    try {
      const findAll = await db.User.findAll();
      console.log(findAll);
      response.send({ findAll });
    } catch (ex) {
      console.log(ex);
    }
  };

  return {
    getUserById,
    findAllUser,
  };
}
