var express = require('express'),
  router = express.Router(),
  table = require('../models/table'),
  log = require('../../libs/logPost');
  
module.exports = function (app) {
  
	app.use('/logs', router);

	router.post('/', log.logRequest);

	router.get('/', function (req, res, next) {
		if (req.session.isAuthenticated)
		{
			return res.render('logs', {
				title: 'Logging.io - Logs',
				columns: table.columns,
				user: res.locals.user
			});    
		}
		else
		{
			return res.redirect(403, '/');
		}

	});
};