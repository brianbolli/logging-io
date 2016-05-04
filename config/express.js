var express = require('express');
var glob = require('glob');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var everyauth = require('everyauth');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);
var config = require('./config');

module.exports = function (app) {
	var env = process.env['ARC_LOGGING_INSTANCE'] || 'development';
	app.locals.ENV = env;
	app.locals.ENV_DEVELOPMENT = env == 'development';

	app.set('views', path.join(config.root, '/app/views'));
	app.set('view engine', 'ejs');

	app.use(favicon(path.join(config.root, '/app/views/favicon.ico')));
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
            extended: true
	}));
	app.use(methodOverride());
	app.use(express.static(path.join(config.root, '/public')));
	
	
	if (env === "production")
	{
		
		//var users = require('../libs/users.js');
		
		var usersById = {};
		var usersByGoogleId = {};
		var nextUserId = 0;

		function addUser (source, sourceUser) {
		  var user;
		  if (arguments.length === 1) { // password-based
			user = sourceUser = source;
			user.id = ++nextUserId;
			return usersById[nextUserId] = user;
		  } else { // non-password-based
			user = usersById[++nextUserId] = {id: nextUserId};
			user[source] = sourceUser;
		  }
		  return user;
		}
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
				//var user = users.get(googleUser);
				//console.log('user promise -> ', user);
				return user;
			})
			.redirectPath('/');


		app.use(cookieParser(config.secret));
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

		app.use(everyauth.middleware(app));
	}
	//else
	//{
		//socket.start();
	//}

	var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function (controller) {
		require(controller)(app);
	});
/*
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});


	if (app.get('env') === 'development') {
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err,
				title: 'error'
			});
		});
	}

	app.use(function (err, req, res, next) {
		console.log(err);
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
			title: 'error'
		});
	});
*/
};
