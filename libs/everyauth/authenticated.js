"use-strict";

module.exports.verify = function verify(req, res, next){
	console.log('session -> ', req.session);
	console.log('auth -> ', req.session.auth);
	//req.session.isAuthenticated = req.session.auth.loggedIn ? true : false;
	req.session.isAuthenticated = (req.env !== "production") ? true : req.loggedIn;
	res.locals.isAuthenticated = req.session.isAuthenticated;

	if (req.session.isAuthenticated)
	{
		res.locals.user = req.session.auth.google.user;
	}

	next();	
};


