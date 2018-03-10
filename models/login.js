var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var loginSchema = new Schema({
	user: { type: String },
	password: { type: String }
});

module.exports = mongoose.model('Usuarios', loginSchema);
