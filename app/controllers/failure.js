var express = require('express'),
  router = express.Router(),
  table = require('../models/table'),
  log = require('../../libs/logPost');
  
module.exports = function (app) {
  
	app.use('/logs', router);

	router.post('/', log.logRequest);

	router.get('/', function (req, res, next) {
	
		return res.render('failure', {
			title: 'Logging.io',
			//user: (req.session.isAuthenticated) ? auth.google.user : false,
			user: false,
			//username: (req.session.isAuthenticated) ? auth.google.user.given_name : false,
			username: false,
			//avatar: (req.session.isAuthenticated) ? auth.google.user.picture : false,
			avatar: false
		});    

	});
};