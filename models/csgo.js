var CONFIG = require('../config/config');

function CsgoData(body) {
  var data = new Object();
  data.provider = Provider(body.provider);
  data.map = Map(body.map);
  data.ct = Team(body.map.team_ct, 'CT', 'CT');
  data.t = Team(body.map.team_t, 'T', 'T');
  data.round = Round(body.round);
  data.screenPlayer = Player(body.player);

  data.players = [];
  if (body.hasOwnProperty('allplayers')) {
    for (var key in body.allplayers) {
      data.players.push({
        [key]: Player(body.allplayers[key], key)
      })
    }
  }
  data.auth = Auth(body.auth);
  return data;
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
  data.team = player.team;
  if( player.hasOwnProperty('activity')){
    data.activity = MatchStats(player.activity);
  }
  data.state = State(player.state);
  if( player.hasOwnProperty('match_stats')){
    data.matchStats = MatchStats(player.match_stats);
  }
  return data;
}

function State(state) {
  var data = new Object();
  data.health = state.health;
  data.armor = state.armor;
  data.helmet = state.helmet;
  data.flashed = state.flashed;
  data.burning = state.burning;
  data.money = state.burning;
  data.roundKills = state.round_kills;
  data.roundKillsHS = state.round_killhs;
  return data;
}

function MatchStats(matchStats) {
  var data = new Object();
  data.kills = matchStats.kills;
  data.assists = matchStats.assists;
  data.deaths = matchStats.deaths;
  data.mvps = matchStats.mvps;
  data.score = matchStats.score;
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

module.exports = CsgoData;
