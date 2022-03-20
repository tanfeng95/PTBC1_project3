import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import http from 'http'
import WebSocket , { WebSocketServer }   from 'ws'

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

// Set Express to listen on the given port
const PORT = process.env.PORT || 3005;

const server = http.createServer(app);

const wss = new WebSocketServer({ server,  deserializer: () => {}});

bindRoutes(app,wss);

server.listen(PORT, function () {
  console.log('Listening on http://localhost:3005');
});
