"use strict";

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();


exports.middleware = function (req, res, next) {
	req.events = ee;
	next();	
};

exports.get = function() {
	return ee;
}