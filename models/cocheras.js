var mongoose = require("mongoose");
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var cocheraSchema = new Schema({
	id: { type: Number }, 
	nombre: { type: Number },
	latitud: { type: Number },
	longitud: { type: Number },
	descripcion: { type: String },
	direccion: { type: String },
	disponible: { type: Boolean },
	puntuacion: { type: Number },
	precio: { type: Number },
	mail: { type: String},
	url: { type: String}
});

module.exports = mongoose.model('Cochera', cocheraSchema);
