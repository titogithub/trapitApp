var mongoose = require('mongoose');
var mongocfg = require('./mongodb/configdb');
var mongoDB = 'mongodb://'+ mongocfg.config.usr + ':'+ mongocfg.config.pwd + '@ds129146.mlab.com:29146/trapitdb' ;


mongoose.connect(mongoDB,{ useMongoClient: true });
var db = mongoose.connection;


module.exports = db;