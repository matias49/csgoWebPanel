var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();
var CONFIG = require('../config/config');
var oldCsgo, csgo;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post(CONFIG.POST_PAGE, function(req, res) {
  try {
    // Headers verification
    // The data comes already parsed (application/json)
    headers = new headersModel(req.headers);
    if (!headers.isValidGlobal()) {
      console.log('NOK CS.');
      return null;
    }
    console.log('OK CS.');
    // We keep the last information given to compare with the new one
    oldCsgo = csgo;
    csgo = new csgoModel(req.body);
    csgo.sortPlayersByTeam();
    // console.log(csgo.map);
    res.send('');
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;
