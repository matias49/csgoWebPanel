var express = require('express');
var headersModel = require('../models/headers');
var csgoModel = require('../models/csgo');
var router = express.Router();
var CONFIG = require('../config/config');
var oldCsgo = [];
var csgo;

// We set the socket port
var io = require('socket.io')(3001);

io.on('connection', function(socket) {
  var path = socket.request.headers.referer.match(/\/\w+\//g)[0].match(/\/\w+/g);
  console.log(path[0]);
  if (oldCsgo[path[0]] !== undefined) {
    sendBaseData(oldCsgo[path[0]]);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/:channel/demo', function(req, res, next) {
  res.render('demo', {
    'channel': req.params.channel
  });
});

router.get('/:channel/team1', function(req, res, next) {
  res.render('team1', {
    'channel' : req.params.channel
  });
});
router.get('/:channel/team2', function(req, res, next) {
  res.render('team2', {
    'channel' : req.params.channel
  });
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
    csgo = new csgoModel(req.body);
    // console.log(oldcsgo);
    var channel = csgo.auth.token;
    // Channel name must start with / and must contain only alphanumeric characters
    if(!/^\/\w*$/.test(channel)){
      return null;
    }
    if(oldCsgo[channel] !== undefined){
      if(oldCsgo[channel].provider.steamid != csgo.provider.steamid && oldCsgo[channel].provider.timestamp - csgo.provider.timestamp < 500){
        return null;
      }
    }
    if(oldCsgo[channel] === undefined){
      oldCsgo[channel] = csgo;
    }

    csgo.sortPlayersByTeam();
    // console.log(csgo);

    sendBaseData(channel);
    // All the behaviour
    if (csgo.isWarmup()) {
      // console.log("WARMUP");
    } else {
      if (csgo.isStatusChanged(oldCsgo[channel])) {
        switch (csgo.round.phase) {
          case 'freezetime':
            io.of(channel).emit('info', {
              'text': 'Round ' + csgo.map.round + ' is on buytime.'
            });
            // If the tab doesn't have the focus, we notify the user the score on the freezetime phase.
            io.of(channel).emit('notification',{
              'text': csgo.logWinningTeam()
            });
            break;
          case 'live':
            io.of(channel).emit('info', {
              'text': 'Round ' + csgo.map.round + ' is now live.'
            });
            break;
          case 'over':
            // GSI already increments the round number when the round is over. no, please.
            io.of(channel).emit('info', {
              'text': 'Round ' + (csgo.map.round - 1) + ' just ended. ' + csgo.getWinnerTeamName() + ' won the round with ' + csgo.getTeamPlayersAlive(csgo.getWinnerTeamSide()) + ' players alive.'
            });
            break;
          default:
            console.log('Cannot get phase');
            break;
        }
      }

      if (csgo.isBombStatusChanged(oldCsgo[channel])) {
        if (csgo.round.bomb === 'planted') {
          io.of(channel).emit('info', {
            'text': 'Bomb has been planted.'
          });

        } else if (csgo.round.bomb === 'defused') {
          io.of(channel).emit('info', {
            'text': 'Bomb has been defused.'
          });
        } else if (csgo.round.bomb === '' && oldCsgo[channel].round.bomb === 'planted') {
          io.of(channel).emit('info', {
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
    oldCsgo[channel] = csgo;
    res.send('');
  } catch (e) {
    console.error("DEBUG");
    console.log(e);
    console.log(req.body);
    io.of(channel).emit('noData');
  }
})

function sendBaseData(channel) {
  io.of(channel).emit('swapTeams', {
    'round': csgo.map.round,
    'phase': csgo.round.phase
  });
  // Informations en cours de la partie
  io.of(channel).emit('mapInfo', {
    'name': csgo.map.name,
    'status': csgo.round.phase
  });
  io.of(channel).emit('teamT', {
    'name': csgo.team.t.name,
    'score': csgo.team.t.score
  });
  io.of(channel).emit('teamCT', {
    'name': csgo.team.ct.name,
    'score': csgo.team.ct.score
  });

  io.of(channel).emit('players', {
    'ct': csgo.getCTPlayers(),
    't': csgo.getTPlayers()
  });

  io.of(channel).emit('bombStatus',{
    'status' : csgo.round.bomb
  });

  csgo.getPlayerImages(csgo, oldCsgo[channel]).then(function(res) {
    io.of(channel).emit('playersImages', {
      'players': csgo.players
    });
  });
}

module.exports = router;
