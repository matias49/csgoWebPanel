var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();
var CONFIG = require('../config/config');
var oldCsgo, csgo;

// We set the socket port
var io = require('socket.io')(3001);

io.on('connection', function (socket) {
  if(csgo !== undefined){
    sendBaseData();
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/demo', function(req, res, next) {
  res.render('demo');
});


router.post(CONFIG.POST_PAGE, function(req, res) {
  try {
    // Headers verification
    // The data comes already parsed (application/json)
    headers = new headersModel(req.headers);
    if (!headers.isValidGlobal()) {
      return null;
    }
    // We keep the last information given to compare with the new one
    oldCsgo = csgo;
    csgo = new csgoModel(req.body);
    csgo.sortPlayersByTeam();
    // console.log(csgo);

    sendBaseData();
    // All the behaviour
    if (csgo.isWarmup()) {
      // console.log("WARMUP");
    } else {
      if (csgo.isStatusChanged(oldCsgo)) {
        switch (csgo.round.phase) {
          case 'freezetime':
            io.emit('info', {
              'text': 'Round ' + csgo.map.round + ' is on buytime.'
            });
            // If the tab doesn't have the focus, we notify the user the score on the freezetime phase.
            io.emit('notification',{
              'text': csgo.logWinningTeam()
            });
            break;
          case 'live':
            io.emit('info', {
              'text': 'Round ' + csgo.map.round + ' is now live.'
            });
            break;
          case 'over':
            // GSI already increments the round number when the round is over. no, please.
            io.emit('info', {
              'text': 'Round ' + (csgo.map.round - 1) + ' just ended. ' + csgo.getWinnerTeamName() + ' won the round with ' + csgo.getTeamPlayersAlive(csgo.getWinnerTeamSide()) + ' players alive.'
            });
            break;
          default:
            console.log('Cannot get phase');
            break;
        }
      }

      if (csgo.isBombStatusChanged(oldCsgo)) {
        if (csgo.round.bomb === 'planted') {
          io.emit('info', {
            'text': 'Bomb has been planted.'
          });

        } else if (csgo.round.bomb === 'defused') {
          io.emit('info', {
            'text': 'Bomb has been defused.'
          });
        } else if (csgo.round.bomb === '' && oldCsgo.round.bomb === 'planted') {
          io.emit('info', {
            'text': 'Bomb might exploded.'
          });
        } else if (csgo.round.bomb === '') {
          console.log('no info');
        } else {
          console.log('new bomb event : ' + csgo.round.bomb)
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

function sendBaseData(){
  // Informations en cours de la partie
  io.emit('mapInfo', {
    'name': csgo.map.name,
    'status': csgo.round.phase
  });
  io.emit('teamT', {
    'name': csgo.team.t.name,
    'score': csgo.team.t.score
  });
  io.emit('teamCT', {
    'name': csgo.team.ct.name,
    'score': csgo.team.ct.score
  });

  io.emit('players', {
    'ct': csgo.getCTPlayers(),
    't' : csgo.getTPlayers()
  });

  csgo.getPlayerImages(csgo, oldCsgo).then(function(res) {
    io.emit('playersImages', {
      'players': csgo.players
    });
  });
}

module.exports = router;
