var connection = require('./connection');
var azure = require('./azureTables');

exports.logRequest = function (req, res, next) {
    
    var result;

    if (!req.body.msg)
    {
       for (var json in req.body)
       {
           var body = JSON.parse(json);
           req.body = body;
       }
    }
	
	console.log('New Request -> ', req.body);

    var msg = req.body.msg;
    
    var meta = {
        client: req.body.client,
        instance: req.body.instance,
        source: req.body.source,
        language: req.body.language,
        data: req.body.data || false,
        user_id: req.body.user_id || false
    };
         
    switch (req.body.type)
    {
        case 'warning' :
        case 'warn' :
            result = connection.warn(msg, meta);
        break;
        case 'error' :
            result = connection.error(msg, meta);
        break;
        default:
            result = connection.info(msg, meta);
        break;
    }
	
	var data = {
            ok: true,
            msg: msg,
            meta: meta,
            type: req.body.type,
            timestamp: new Date,
            result: result
        };
	
	req.events.emit('update', JSON.stringify(data));
    
	res.json(data);
	res.end();
};

