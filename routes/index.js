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
    if(csgo.isStatusChanged(oldCsgo)){
      switch (csgo.round.phase) {
        case 'freezetime':
          console.log('Round '+csgo.map.round+' is on buytime.');
          console.log(csgo.logWinningTeam());
          break;
        case 'live':
          console.log('Round '+csgo.map.round+' is now live.');
          break;
        case 'over':
          // GSI already increments the round number when the round is over. no, please.
          console.log('Round '+(csgo.map.round-1)+' just ended. '+csgo.round.winTeam+ ' won the round.');
          break;
        default:
          console.log('Cannot get phase');
          break;
      }
    }

    if(csgo.isBombStatusChanged(oldCsgo)){
      switch (csgo.round.bomb) {
        case 'planted':
          console.log('Bomb has been planted.');
          break;
        case 'exploded':
          console.log('Bomb exploded.');
          break;
        case 'defused':
          // GSI already increments the round number when the round is over. no, please.
          console.log('Bomb has been defused');
          break;
        default:
          // console.log('Bomb event : '+csgo.round.bomb);
          break;
      }
    }
    // console.log(csgo.map);
    res.send('');
  } catch (e) {
    console.log(e);
  }
})

module.exports = router;
