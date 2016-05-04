var service = require('./azureService');

exports.query = function (events)
{
    service.queryEntities('log', null, null, function(error, result, response){
        
        if (error)
        {
            throw error;
        }
        
        events.emit('message', JSON.stringify(result));
    });

};

