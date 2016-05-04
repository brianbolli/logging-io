var config = require('../config/config');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

module.exports.csrf = function csrf(req, res, next){
	res.locals.token = req.csrfToken();
	next();
};

module.exports.authenticated = function authenticated(req, res, next){
	var auth = req.session['auth'];
	req.session.isAuthenticated = auth.loggedIn ? true : false;
	res.locals.isAuthenticated = req.session.isAuthenticated;
	if (req.session.isAuthenticated) {
		res.locals.user = auth.google.user;
	}
	next();
};

module.exports.logOut = function logOut(session){
	session.isAuthenticated = false;
	delete session.user;
};

