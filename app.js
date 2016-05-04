var express = require('express');
var app = express();
var socketio = require('socket.io');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var csrf = require('csurf');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);

var glob = require('glob');
var path = require('path');
var process = require('process');

//var events = require('./libs/connect-events');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var utilities = require('./libs/utilities');
var config = require('./config/config');
var azure = require('./libs/azureTables');
var sockets = require('./libs/socket_server');
//var everyauth = require('./libs/everyauth');
var everyauth = require('everyauth');
var authenticated = require('./libs/everyauth/authenticated');
//var passport = require('./libs/passport');

var io;
var env = process.env['ARC_LOGGING_INSTANCE'] || 'development';

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.set('views', path.join(config.root, '/app/views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
	req.events = ee;
	next();
});

app.use(express.static(path.join(config.root, '/public')));
app.use(favicon(path.join(config.root, '/app/views/favicon.ico')));

app.use(cookieParser(config.secret));
app.use(session({
	secret: config.secret,
	resave: false,
	saveUninitialized: false,
	store: new RedisStore({
		host: config.redis.host,
		port: config.redis.port,
		auth_pass: config.redis.key,
		tls: { servername: config.redis.host }
	}),
	cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(methodOverride());

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
	//app.use(everyauth.middleware(app));
	
	everyauth.debug = true;

	everyauth.everymodule
		.findUserById(function (id, callback) {
			callback(null, usersById[id]);
		});

	everyauth.google
		.appId(config.google.token)
		.appSecret(config.google.secret)
		.entryPath(config.routes.googleAuth)
		.callbackPath(config.routes.googleAuthCallback)
		.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
		.findOrCreateUser(function (sess, accessToken, extra, googleUser) {
			//googleUser.refreshToken = extra.refresh_token;
			//googleUser.expiresIn = extra.expires_in;
			//var user = getGoogleUser(googleUser);
			googleUser.refreshToken = extra.refresh_token;
			googleUser.expiresIn = extra.expires_in;
			var user = usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));

			console.log('user promise -> ', user);
			
			return user;
		})
		.redirectPath('/');
	
	app.use(everyauth.middleware(app));
	app.use(function verify(req, res, next){
		console.log('session -> ', req.session);
		console.log('logged in -> ', req.loggedIn);
		req.session.isAuthenticated = (req.env === "production") ? req.loggedIn : true;
		res.locals.isAuthenticated = req.session.isAuthenticated;

		if (req.session.isAuthenticated)
		{
			res.locals.user = req.user;
		}

		next();	
	});
	
	//app.use(passport.passport.initialize());
	//app.use(passport.passport.session());
	//passport.routes(app);
}

var controllers = glob.sync(config.root + '/app/controllers/*.js');
controllers.forEach(function (controller) {
	require(controller)(app);
});

var server = app.listen(process.env.PORT || 3000);
sockets.listen(server, ee);