var CONFIG = require('../config/config');

function CsgoData(body) {
  this.provider = Provider(body.provider);
  this.map = Map(body.map);
  this.ct = Team(body.map.team_ct, 'CT', 'CT');
  this.t = Team(body.map.team_t, 'T', 'T');
  this.round = Round(body.round);
  this.screenPlayer = Player(body.player);

  this.players = [];
  if (body.hasOwnProperty('allplayers')) {
    for (var key in body.allplayers) {
      this.players.push(Player(body.allplayers[key], key));
    }
  }
  this.auth = Auth(body.auth);
}

function Provider(provider) {
  var data = new Object();
  data.name = provider.name;
  data.appid = provider.appid;
  data.version = provider.version;
  data.steamid = provider.steamid;
  data.timestamp = provider.timestamp;
  return data;
}

function Map(map) {
  var data = new Object();
  data.mode = map.mode;
  data.name = map.name;
  data.phase = map.phase;
  data.round = map.round;
  return data;
}

function Round(round) {
  var data = new Object();
  data.phase = round.phase;
  return data;
}

function Player(player, steamid) {
  var data = new Object();
  data.steamid = player.steamid || steamid;
  data.name = player.name;
  data.team = player.team || 'SPEC';
  if (player.hasOwnProperty('activity')) {
    data.activity = player.activity;
  }
  data.health = player.state.health;
  data.armor = player.state.armor;
  data.helmet = player.state.helmet;
  data.flashed = player.state.flashed;
  data.burning = player.state.burning;
  data.money = player.state.burning;
  data.roundKills = player.state.round_kills;
  data.roundKillsHS = player.state.round_killhs;
  if (player.hasOwnProperty('match_stats')) {
    data.kills = player.match_stats.kills;
    data.assists = player.match_stats.assists;
    data.deaths = player.match_stats.deaths;
    data.mvps = player.match_stats.mvps;
    data.score = player.match_stats.score;
  }
  return data;
}

function Team(team, side, defaultName) {
  var data = new Object();
  data.score = team.score;
  data.side = side;
  data.name = team.name || defaultName;
  return data;
}

function Auth(auth) {
  var data = new Object();
  data.token = auth.token;
  return data;
}

CsgoData.prototype.sortPlayersByTeam = function() {
  this.players.sort(function(a, b) {
    return a.team.localeCompare(b.team);
  });
}

module.exports = CsgoData;
