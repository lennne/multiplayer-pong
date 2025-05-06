let readyPlayerCount = 0;

function listen(io){
    io.on('connection', (socket) => {
        //we're in the connection event 
        console.log("a user is connected", socket.id);
    
        //listener for the ready event
        socket.on('ready', () => {
            console.log('Player ready', socket.id);
            
            //increase the readyPlayerCount
            readyPlayerCount++;
    
            if(readyPlayerCount === 2){
                //broadcast('startGame') event -> how do you send a connection to all those that are connected
                io.emit('startGame', socket.id);//this refers to the socket.id that can be accessed from this complete socket sessioni
            }
    
        });
    
        //when the server receives a 'paddleMove' event, this gets triggered and whatever function is inside get's executed
        //in this case the we broadcast the movedata that was sent from the client to all other clients except the sender
        socket.on('paddleMove', (paddleData)=> {
            socket.broadcast.emit('paddleMove', paddleData);
        });
    
        socket.on('ballMove', (ballData) => {
            socket.broadcast.emit('ballMove', ballData);
        });
    
        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`)
        })
    });
    
}

module.exports = {listen};