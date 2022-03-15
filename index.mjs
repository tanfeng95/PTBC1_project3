import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import http from 'http'


import bindRoutes from './routes.mjs';

// Initialise Express instance
const app = express();
// Set the Express view engine to expect EJS templates
app.set('view engine', 'ejs');
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride('_method'));
// Expose the files stored in the public folder
app.use(express.static('public'));
// Expose the files stored in the distribution folder
app.use(express.static('dist'));



// const ws = new WebSocket('ws://www.host.com/path', {
//   perMessageDeflate: false
// });

// Bind route definitions to the Express application
bindRoutes(app);
// Set Express to listen on the given port
const PORT = process.env.PORT || 3005;


//const server = http.createServer(express)
import WebSocket , { WebSocketServer }   from 'ws'
import sockjs from 'sockjs'

const wss = sockjs.createServer();
//const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', function connection(ws) {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
      const message = JSON.parse(messageAsString);
      const metadata = clients.get(ws);
      message.sender = metadata.id;
      message.color = metadata.color;

      const outbound = JSON.stringify(message);

      [...clients.keys()].forEach((client) => {
        client.write(outbound);
      });
    });

      ws.on("close", () => {
      clients.delete(ws);
    });

});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const server = http.createServer();
wss.installHandlers(server, {prefix: '/ws'});
server.listen(7071, '0.0.0.0');

app.listen(PORT);

console.log("wss up");