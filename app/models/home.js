"use-strict";

var azure = require('../../libs/azureTables');

var getLogs = function(events)
{
	azure.query(events);
};

var getColumns = function()
{

	return [
        {
            header: 'Client',
            class: false,
            style: false
        },
        {
            header: 'Instance',
            class: false,
            style: false
        },
        {
            header: 'Time Stamp',
            class: false,
            style: false
        },
        {
            header: 'Language',
            class: false,
            style: false
        },
        {
            header: 'Type',
            class: false,
            style: false
        },
        {
            header: 'Source',
            class: false,
            style: false
        },
        {
            header: 'User ID',
            class: false,
            style: false
        },
        {
            header: 'Message',
            class: false,
            style: false
        },
        {
            header: 'Data',
            class: 'data',
            style: false
        }
    ];
	
};

exports.getLogs = getLogs;

exports.getColumns = getColumns;

