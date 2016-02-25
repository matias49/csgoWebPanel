var express = require('express');
var headersModel = require('../models/headers.js')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/csgo', function(req,res){

  // Objects initialization
  headers = new headersModel(req.headers);

  // Sender verification
  if(!headers.isValidGlobal()){
    console.log('NOK CS.');

    return null;
  }
  console.log('OK CS.');
  //console.log(req);
  res.send('');

  //if(req.headers['user-agent'])
  //for (var key in req.body.allplayers){
  //  console.log(req.body.allplayers[key]);
  //}
})

module.exports = router;
