var mongoose = require('mongoose');
Cocheras = require('../models/cocheras');
var configMail = require('../mailer/config');
// Mail
var nodemailer = require('nodemailer');
var mailerhbs = require('nodemailer-express-handlebars');

// Config Mail
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: configMail.config.usr,
		pass: configMail.config.pwd
	}
});

transporter.use('compile', mailerhbs({
	viewPath: 'public/templates', 
	extName: '.hbs'
}));

// Google Distance Service
var distance = require("google-distance-matrix");
distance.key('AIzaSyCn5iMy9WIvgb2fEusbRJJfGVaMZ0wZzHY');


mongoose.Promise = Promise;

exports.listCocheras = listCocheras;

exports.cocherasDisp = cocherasDisp;

exports.getCochera = getCochera;

exports.reservar = reservar;

exports.cancelar = cancelar;

exports.estacionamientosCercanos = estacionamientosCercanos;

exports.inicializarCocheras = inicializarCocheras;

function listCocheras() {
	return  Cocheras.find().exec();
}

function getCochera (req, res) {
	Cocheras.findOne({id:req.params.id}).exec()
	.then((cochera)=>res.send(cochera), function (err) {
		console.log('error: ', err);
	})
}

function cocherasDisp (req, res){

	Cocheras.find({disponible:true}).exec()
	.then((cocheras)=>res.send(cocheras), function (err) {
		console.log('error: ', err );
	})
	
} 

function reservar (req, res) {
	console.log('req: ', req);
	Cocheras.findOne({id:req.params.id, disponible:true}).exec()
	.then((cochera) => {
		console.log('cochera: ', cochera);
		
		if (cochera != null){
			cochera.disponible = false;
			cochera.save();

			var emailDestino = cochera.mail;
			var mailOptions = {
				from: 'trapitpark@gmail.com',
				to: emailDestino,
				subject: 'Confirmacion Reserva Cochera',
				template: 'confirmacion',
				context: {
					descripcion: cochera.descripcion,
					direccion: cochera.direccion,
					img: cochera.url,
					precio: cochera.precio,
					puntuacion: cochera.puntuacion
				}
			};

			transporter.sendMail(mailOptions, function(err, info) {
				if (err)
					console.log(err)
				else
					console.log(info);
			});

			res.send({estado: "ok"});
		}
		else
			res.send({estado: "fail"});

	},function (err) {
		console.log("error al reservar db", err);
	})
}

function estacionamientosCercanos(req, res) {

	listCocheras()
	.then(function(cocheras) {
		var misEstacionamientos = cocheras;

      // var origins = ['Robinson 854, José Marmol, Buenos Aires, Argentina'];
      var origins = [];
      origins.push(req.body.lugar);
      var destinations = [];
      var destinationsId = [];

      // Llenar matriz destinos
      for (var i = 0; i < misEstacionamientos.length; i++) {
      	if (misEstacionamientos[i].disponible == true) {
      		destinations.push(misEstacionamientos[i].latitud + ',' + misEstacionamientos[i].longitud);
      		destinationsId.push(misEstacionamientos[i]);
      	}
      }

      // var destinations = ['-34.7981467,-58.3957462','-34.797831,-58.384435','-34.803151,-58.386324'];
      var rdoMatrix = [];

      distance.matrix(origins, destinations, function(err, distances) {
      	if (!err) {
      		for (var i = 0; i < destinations.length; i++) {
      			rdoMatrix.push({
      				lugar: destinationsId[i],
      				distancia: distances.rows[0].elements[i]
      			});
      		}
      	}

        // Ordenar Matrix 

        for (var i = 0; i < rdoMatrix.length && i < 3; i++) {
        	for (var j = i + 1; j < rdoMatrix.length; j++) {
        		if (rdoMatrix[j].distancia.distance.value < rdoMatrix[i].distancia.distance.value) {

        			var aux = rdoMatrix[i];
        			rdoMatrix[i] = rdoMatrix[j];
        			rdoMatrix[j] = aux;

        		}
        	}
        }

        var masCercanos = [];
        for (var i = 0; i < rdoMatrix.length && i < 3; i++) {
        	masCercanos.push(rdoMatrix[i]);
        }

        res.send(masCercanos);

    });



  }, function(err) {
  	console.log("error", err);
  });
	
}

function cancelar (req, res) {
	Cocheras.findOne({id:req.params.id, disponible:false}).exec()
	.then((cochera) => {
		if (cochera != null){
			cochera.disponible = true;
			cochera.save();

			var emailDestino = cochera.mail;
			var mailOptions = {
				from: 'trapitpark@gmail.com',
				to: emailDestino,
				subject: 'Confirmacion Reserva Cochera',
				template: 'confirmacion',
				context: {
					descripcion: cochera.descripcion,
					direccion: cochera.direccion,
					img: cochera.url,
					precio: cochera.precio,
					puntuacion: cochera.puntuacion
				}
			};

			transporter.sendMail(mailOptions, function(err, info) {
				if (err)
					console.log(err)
				else
					console.log(info);
			});

			res.send({estado: "ok"});

		}
		else
			res.send({estado: "fail"});
	},function (err) {
		console.log("error al reservar db", err);
	})
}

function inicializarCocheras() {
	Cocheras.find().exec()
	.then(function (cocheras) {
		for (var i = 0; i < cocheras.length; i++) {
			Cocheras.findOne({id:cocheras[i].id}).exec()
			.then(function (cochera) {
				cochera.disponible = true;
				cochera.save();
			},function (err) {
				console.log("error al gaurdar", err);
			})
		}
	},function (err) {
		console.log("error al inicializar", err);

	})
}

