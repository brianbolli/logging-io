var socketio = require('socket.io');
var io, _socket;

var logging = require('./logging');

exports.listen = function(server, events) {
    io = socketio.listen(server);
    io.sockets.on('connection', function(socket){
		       
        socket.on('message', function(data){
        
           logging.logRequest(data);
           socket.emit('message', data);

        });
              
        socket.on('error', function(error){
           console.log('Error -> ', error); 
        });

        socket.on('disconnect', function(){
            console.log('client disconnected');
        });
		
		events.on('message', function(data){
			socket.send(data);
		});
        
        events.on('update', function(data){
            socket.emit('update', data);
        });

    });
   
};