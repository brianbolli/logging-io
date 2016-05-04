"use strict";

var express = require('express');
var router = express.Router();

var passport = require('passport');
var google = require('passport-google-oauth').OAuth2Strategy;
var user = require('./user');
var config = require('../../config/config');
	
passport.use(new google({
	clientID: config.google.token,
	clientSecret: config.google.secret,
	callbackURL: config.host + config.routes.googleAuthCallback
	},
	function(accessToken, refreshToken, profile, done) {
		profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
	})
);

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

var authenticated = function authenticated(req, res, next) {
	req.session.isAuthenticated = req.session.passport.user !== undefined;
	res.locals.isAuthenticated = req.session.isAuthenticated;
	if (req.session.isAuthenticated)
	{
		res.locals.user = req.session.passport.user;
	}
	next();
};

var routes = function routes(app){

	app.use(router);
	
	router.use(authenticated);
	
	router.get(
		config.routes.googleAuth,
		passport.authenticate('google',
		{
			scope: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
		}
	));
	
	router.get(
		config.routes.googleAuthCallback,
		passport.authenticate('google',
		{
			successRedirect: '/logs',
			failureRedirect: '/failure'
		}
	));

};

exports.passport = passport;
exports.routes = routes;