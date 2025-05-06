let readyPlayerCount = 0;

function listen(io){

    // specifying the namespace that we want to create
    const pongNamespace = io.of('/pong');

    //*if we were to have a tetris game and we wanted to specify that
    //it'll look like this
    //const tetrisNamespace = io.of('/tetris');
    // tetrisNamespace.('connection', (socket) => {...})


    //we then adjust the following code to pongNamespace.on whereas it used to be io.on
    //and in turn the code should now follow the correctNamespace
    //the rest of the 'sockets' now act on clients that have connected to the pongNamespace
    pongNamespace.on('connection', (socket) => {

        let room = 0;
        //we're in the connection event 
        console.log("a user is connected", socket.id);
        
        //when a player sends a ready event add him to a room
        //listener for the ready event
        socket.on('ready', () => { 
            //using the math floor function when a player joins 0/2 = 0, and when another player joins, 1/2 = 0.5 which in the floor function is still 0
            //when there are 2 ready players 2/2 = 1, and when there are 3, 3/2 is 1.5 which is still one, so both join room 1
            //when there are 4 ready players 4/2 = 2, and when there are 5 players, 5/2 = 2.5 which is still 2, so both join room 2
            room = "room" + Math.floor(readyPlayerCount/2);
            socket.join(room);

            console.log('Player ready', socket.id);
            
            //increase the readyPlayerCount
            readyPlayerCount++;
    
            if(readyPlayerCount % 2 === 0){
                //we broadcast to only those connected to the pong namespace
                //broadcast('startGame') event -> how do you send a connection to all those that are connected
                pongNamespace.in(room).emit('startGame', socket.id);//this refers to the socket.id that can be accessed from this complete socket sessioni
                console.log(room)
            }
    
        });
    
        //when the server receives a 'paddleMove' event, this gets triggered and whatever function is inside get's executed
        //in this case the we broadcast the movedata that was sent from the client to all other clients except the sender
        socket.on('paddleMove', (paddleData)=> {
            socket.to(room).emit('paddleMove', paddleData);
        });
    
        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });
    
        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        })
    });
    
}

module.exports = {listen};