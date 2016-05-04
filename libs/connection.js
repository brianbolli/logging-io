var connection = require('winston');
var azure = require('winston-azuretable').AzureLogger;
var process = require('process');

connection.add(azure, {
    account: process.env.ARC_LOGGING_AZURE_ACCOUNT,
    key: process.env.ARC_LOGGING_AZURE_KEY
});

module.exports = connection;