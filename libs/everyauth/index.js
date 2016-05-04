"use strict";

var users = require('./users');
var everyauth = require('everyauth');
var config = require('../../config/config');

module.exports.everyauth = function everyauth() {

	everyauth.debug = true;

	everyauth.everymodule
		.findUserById(function (id, callback) {
			callback(null, users.getUserById(id));
		});

	everyauth.google
		.appId(config.google.token)
		.appSecret(config.google.secret)
		.entryPath(config.routes.googleAuth)
		.callbackPath(config.routes.googleAuthCallback)
		.scope('https://www.googleapis.com/auth/userinfo.profile https://www.google.com/m8/feeds/')
		.findOrCreateUser(function (sess, accessToken, extra, googleUser) {
			googleUser.refreshToken = extra.refresh_token;
			googleUser.expiresIn = extra.expires_in;
			var user = users.getGoogleUser(googleUser);

			console.log('user promise -> ', user);
			
			return user;
		})
		.redirectPath('/logs');

	return everyauth;
	
};

module.exports.verify = function verify(req, res, next){
	console.log('session -> ', req.session);
	console.log('everyauth -> ', everyauth);
	req.session.isAuthenticated = everyauth.loggedIn;
	res.locals.isAuthenticated = req.session.isAuthenticated;

	if (req.session.isAuthenticated)
	{
		res.locals.user = req.session.auth.google.user;
	}

	next();	
};