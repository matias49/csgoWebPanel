var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/csgo', function(req, res) {
  try {
    // Objects initialization
    // The data comes already parsed (application/json)
    headers = new headersModel(req.headers);
    // Sender verification
    if (!headers.isValidGlobal()) {
      console.log('NOK CS.');
      return null;
    }
    console.log('OK CS.');
    csgo = new csgoModel(req.body);

    console.log(csgo.players);
    res.send('');
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;
