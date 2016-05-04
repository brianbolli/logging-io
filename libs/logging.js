var connection = require('./connection');

exports.logRequest = function (data) {
    
    var meta = {
        client: data.client,
        instance: data.instance,
        source: data.source
    };
     
    switch (data.type)
    {
        case 'warning' :
        case 'warn' :
            //winston.warn(msg, meta);
            connection.warn(data.msg, meta);
        break;
        case 'error' :
            //winston.error(msg, meta);
            connection.error(data.msg, meta);
        break;
        case 'data' :
            //winston.data(msg, meta);
            connection.data(data.msg, meta);
        break;
        default:
            //winston.info(msg, meta);
            connection.info(data.msg, meta);
        break;
    }
    
    var result = {
        ok: true,
        msg: data.msg,
        meta: meta
    };
    
    return result;
};


