var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();
var CONFIG = require('../config/config');
var oldCsgo, csgo;

var io = require('socket.io')(3001);

io.on('connection', function (socket) {
    console.log('new user');
});

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
    // console.log(csgo);
    // All the behaviour
    if (csgo.isWarmup()) {
      // console.log("WARMUP");
    } else {
      if (csgo.isStatusChanged(oldCsgo)) {
        switch (csgo.round.phase) {
          case 'freezetime':
            console.log('Round ' + csgo.map.round + ' is on buytime.');
            io.emit('info', {'text' : 'Round ' + csgo.map.round + ' is on buytime.'});
            console.log(csgo.logWinningTeam());
            break;
          case 'live':
            console.log('Round ' + csgo.map.round + ' is now live.');
            io.emit('info', {'text' : 'Round ' + csgo.map.round + ' is now live.'});
            break;
          case 'over':
            // GSI already increments the round number when the round is over. no, please.
            console.log('Round ' + (csgo.map.round - 1) + ' just ended. ' + csgo.getWinnerTeamName() + ' won the round with ' + csgo.getTeamPlayersAlive(csgo.getWinnerTeamSide()) + ' players alive.');
            io.emit('info', {'text' : 'Round ' + (csgo.map.round - 1) + ' just ended. ' + csgo.getWinnerTeamName() + ' won the round with ' + csgo.getTeamPlayersAlive(csgo.getWinnerTeamSide()) + ' players alive.'});
            break;
          default:
            console.log('Cannot get phase');
            break;
        }
      }

      if (csgo.isBombStatusChanged(oldCsgo)) {
        if (csgo.round.bomb === 'planted') {
          console.log('Bomb has been planted.');
        } else if (csgo.round.bomb === 'defused') {
          console.log('Bomb has been defused');
        } else if (csgo.round.bomb === '' && oldCsgo.round.bomb === 'planted') {
          console.log('Bomb might exploded.');
        } else if (csgo.round.bomb === '') {
          console.log('no info');
        } else {
          console.log('new event : ' + csgo.round.bomb)
        }
      }
    }
    // console.log(csgo.map);
    res.send('');
  } catch (e) {
    console.error("DEBUG");
    console.log(e);
    console.log(req.body);
  }
})

module.exports = router;
