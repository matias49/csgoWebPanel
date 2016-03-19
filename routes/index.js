var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();
var CONFIG = require('../config/config');
var oldCsgo, csgo;

// We set the socket port
var io = require('socket.io')(3001);

io.on('connection', function (socket) {
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
    'players': csgo.players
  });

  csgo.getPlayerImages(csgo, oldCsgo).then(function(res) {
    io.emit('playersImages', {
      'players': csgo.players
    });
  });
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
      console.log('NOK CS.');
      return null;
    }
    console.log('OK CS.');
    // We keep the last information given to compare with the new one
    oldCsgo = csgo;
    csgo = new csgoModel(req.body);
    csgo.sortPlayersByTeam();
    // console.log(csgo);


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
      'players': csgo.players
    });

    csgo.getPlayerImages(csgo, oldCsgo).then(function(res) {
      io.emit('playersImages', {
        'players': csgo.players
      });
    });

    // All the behaviour
    if (csgo.isWarmup()) {
      // console.log("WARMUP");
    } else {
      if (csgo.isStatusChanged(oldCsgo)) {
        switch (csgo.round.phase) {
          case 'freezetime':
            console.log('Round ' + csgo.map.round + ' is on buytime.');
            io.emit('info', {
              'text': 'Round ' + csgo.map.round + ' is on buytime.'
            });
            console.log(csgo.logWinningTeam());
            // If the tab doesn't have the focus, we notify the user the score on the freezetime phase.
            io.emit('notification',{
              'text': csgo.logWinningTeam()
            });
            break;
          case 'live':
            console.log('Round ' + csgo.map.round + ' is now live.');
            io.emit('info', {
              'text': 'Round ' + csgo.map.round + ' is now live.'
            });
            break;
          case 'over':
            // GSI already increments the round number when the round is over. no, please.
            console.log('Round ' + (csgo.map.round - 1) + ' just ended. ' + csgo.getWinnerTeamName() + ' won the round with ' + csgo.getTeamPlayersAlive(csgo.getWinnerTeamSide()) + ' players alive.');
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
          console.log('Bomb has been planted.');
          io.emit('info', {
            'text': 'Bomb has been planted.'
          });

        } else if (csgo.round.bomb === 'defused') {
          console.log('Bomb has been defused');
          io.emit('info', {
            'text': 'Bomb has been defused.'
          });
        } else if (csgo.round.bomb === '' && oldCsgo.round.bomb === 'planted') {
          console.log('Bomb might exploded.');
          io.emit('info', {
            'text': 'Bomb might exploded.'
          });
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
