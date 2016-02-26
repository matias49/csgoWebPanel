var express = require('express');
var headersModel = require('../models/headers.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/csgo', function(req,res){

  // Objects initialization
  // The data comes already parsed (application/json)
  headers = new headersModel(req.headers);

  // Sender verification
  if(!headers.isValidGlobal()){
    console.log('NOK CS.');
    return null;
  }
  console.log('OK CS.');
  // console.log(req.body.player);
  res.send('');
})

module.exports = router;
