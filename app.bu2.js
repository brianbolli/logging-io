var config = require('./config/config');
var http = require('http');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var sharedSession = require("express-socket.io-session");
var glob = require('glob');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var socketio = require('socket.io');
var methodOverride = require('method-override');
var everyauth = require('everyauth');
var logging = require('./libs/logging');
var azure = require('./libs/azureTables');

var io;
var ee = new EventEmitter();
var app = express();

var env = process.env['ARC_LOGGING_INSTANCE'] || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	app.set('views', path.join(config.root, '/app/views'));
	app.set('view engine', 'ejs');
	app.use(session({
			secret: config.secret,
			resave: false,
			saveUninitialized: false,
			store: new RedisStore({
				host: config.redis.host,
				port: config.redis.port,
				auth_pass: config.redis.key,
				tls: { 
					servername: config.redis.host
				}
			})
	}));
	app.use(favicon(path.join(config.root, '/app/views/favicon.ico')));
	app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
	}));
	app.use(methodOverride());
	app.use(express.static(path.join(config.root, '/public')));
	
	if (env === "production")
	{
		
		var usersById = {};
		var usersByGoogleId = {};
		var nextUserId = 0;

		var addUser = function(source, sourceUser) {
			var user;
			if (arguments.length === 1)
			{
				user = sourceUser = source;
				user.id = ++nextUserId;
				return usersById[nextUserId] = user;
			}
			else
			{
				user = usersById[++nextUserId] = {id: nextUserId};
				user[source] = sourceUser;
			}
			return user;    
		};

		everyauth.debug = true;

		everyauth.everymodule
			.findUserById(function (id, callback) {
				callback(null, usersById[id]);
			});

		everyauth.google
			.appId(config.google.token)
			.appSecret(config.google.secret)
			.entryPath('/auth/google')
			.callbackPath('/auth/google/callback')
			.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
			.findOrCreateUser(function (sess, accessToken, extra, googleUser) {
				googleUser.refreshToken = extra.refresh_token;
				googleUser.expiresIn = extra.expires_in;
				var user = usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
				console.log('user promise -> ', user);
				ee.emit('authenticated');
				return user;
			})
			.redirectPath('/');


		app.use(cookieParser());
		app.use(everyauth.middleware());
	}

	app.use(function (req, res, next) {
		req.ee = ee;
		next();
	});

	var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function (controller) {
		require(controller)(app);
	});

var port = process.env.PORT || 3000;

var server = http.createServer(app).listen(port, function () {
  console.log('Express server listening on port ' + port);
});

io = socketio.listen(server);
io.use(sharedSession(session, { autosave: true }));
io.sockets.on('connection', function(socket){
	console.log('server socket connection!');
	if (socket.session)
	{
		console.log('socket session -> ', socket.session);
		azure.query(socket);
	}
	
	socket.on("login", function(userdata) {
		console.log('login event occured -> ', userdata);
		socket.handshake.session.userdata = userdata;
		
	});

	socket.on("logout", function(userdata) {
		console.log('logout event occured');
		if (socket.handshake.session.userdata)
		{
			delete socket.handshake.session.userdata;
		}
	}); 
	
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
	
	socket.on('authenticated', function(){
		azure.query(socket);
	});

	ee.on('update', function(data){
		socket.emit('update', data);
	});

});

