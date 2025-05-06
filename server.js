const api = require('./api'); 
const server = require('http').createServer(api);
const sockets = require('./sockets');
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    }
  });

const PORT = 3000;


console.log(`Listenin on port ${PORT}`);


//on the server side we have multiple sockets being connected at the same time unlike the client side
//we can only get access to our socket when we're handling a connection event



server.listen(PORT);
sockets.listen(io);