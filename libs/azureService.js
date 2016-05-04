var azure = require('azure');

var azureAccount = process.env.ARC_LOGGING_AZURE_ACCOUNT;
var azureKey     = process.env.ARC_LOGGING_AZURE_KEY;
 
module.exports = azure.createTableService(azureAccount, azureKey);
