var express = require('express'),
  router = express.Router(),
  home = require('../models/home'),
  logger = require('../../libs/logPost');
  
module.exports = function (app) {
  
	app.use('/', router);

	router.post('/', logger.logRequest);

	router.get('/', function (req, res, next) {
		
		if (req.loggedIn || app.locals.env !== "production")
		{
			console.log('i get logs, yipee!');
			home.getLogs(req.events);
			logs = true;
		}
		else
		{
			logs = false;
		}
		
		return res.render('home', {
			title: 'Logging.io - Home',
			user: (req.user) ? req.user : false,
			columns: home.getColumns(),
			logs:  logs
		});    

	});
};