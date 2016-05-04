var socket = io.connect();

var resizable = function() {
	
};

$(document).ready(function() {
    var logs = new Logs(socket);
	
	var user;
	
	console.log('logging.io client started');
	console.log('socket -> ', socket);
    
    socket.on('message', function(message) {
		var data = JSON.parse(message);
        logs.parseRows(data);
    });

    socket.on('update', function(data) {
		console.log('received update -> ', (data) ? data : 'nothing!');
        logs.addRow(data);
    });
	
	socket.on("login", function(userdata) {
		console.log('Login UserData -> ', userdata);

        socket.handshake.session.userdata = userdata;
		
    });
    socket.on("logout", function(userdata) {
		
		console.log('logout event');
        if (socket.handshake.session.userdata)
		{
            delete socket.handshake.session.userdata;
        }
		
    }); 
    
});


