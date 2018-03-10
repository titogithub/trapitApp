var express = require('express');
var router = express.Router();
var Cocheras = require('../controllers/cocherasController');
const path = require('path').resolve;

router.get('/estdisp', Cocheras.cocherasDisp);

router.post('/estacionamientos', Cocheras.estacionamientosCercanos);

router.get('/estacionamiento/:id', Cocheras.getCochera);

router.get('/reservar/:id', Cocheras.reservar);

router.get('/cancelar/:id', Cocheras.cancelar);

router.get('/trapito', function(req, res) {
  // res.sendFile(path.join(__dirname + '/dist/index.html'));
  res.sendFile(path('dist/index.html'));

});

module.exports = router;