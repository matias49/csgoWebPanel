var CONFIG = require('../config/config');

/**
 * The primary object of the CSGO data
 * @param {JSON} body All the CSGO data (req.body)
 */
function CsgoData(body) {
  this.provider = Provider(body.provider);
  this.map = Map(body.map);
  this.ct = Team(body.map.team_ct, 'CT', 'CT');
  this.t = Team(body.map.team_t, 'T', 'T');
  this.round = Round(body.round);
  this.screenPlayer = Player(body.player);
  // We store all the players on an array
  this.players = [];
  if (body.hasOwnProperty('allplayers')) {
    for (var key in body.allplayers) {
      this.players.push(Player(body.allplayers[key], key));
    }
  }
  this.auth = Auth(body.auth);
}

/**
 * Provider data on the CSGO data
 * @param {JSON} provider The provider data
 */
function Provider(provider) {
  var data = new Object();
  data.name = provider.name;
  data.appid = provider.appid;
  data.version = provider.version;
  data.steamid = provider.steamid;
  data.timestamp = provider.timestamp;
  return data;
}

/**
 * Map data on the CSGO data
 * @param {JSON} map The map data
 */
function Map(map) {
  var data = new Object();
  data.mode = map.mode;
  data.name = map.name;
  data.phase = map.phase;
  data.round = map.round;
  return data;
}

/**
 * Round data on the CSGO data
 * @param {JSON} round The round data
 */
function Round(round) {
  var data = new Object();
  data.phase = round.phase;
  return data;
}

/**
 * Player data on the CSGO data
 * @param {JSON} player  The player data
 * @param {string} steamid The steamID of the player, which isn't include on the player JSON if the data come from the allplayers, but it's it key
 */
function Player(player, steamid) {
  var data = new Object();
  data.steamid = player.steamid || steamid;
  data.name = player.name;
  // Team can be 'undefined' if we're on the free view
  data.team = player.team || 'SPEC';
  if (player.hasOwnProperty('activity')) {
    data.activity = player.activity;
  }
  // We flat the state data
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

/**
 * Team data on the CSGO data
 * @param {JSON} team        The team data
 * @param {string} side        The side of the team
 * @param {string} defaultName The clan name of the team, the default name of the team (define above) otherwise
 */
function Team(team, side, defaultName) {
  var data = new Object();
  data.score = team.score;
  data.side = side;
  data.name = team.name || defaultName;
  return data;
}

/**
 * Auth data on the CSGO data
 * @param {JSON} auth The Auth data
 */
function Auth(auth) {
  var data = new Object();
  data.token = auth.token;
  return data;
}

/**
 * Sorting all the players array by their team
 */
CsgoData.prototype.sortPlayersByTeam = function() {
  this.players.sort(function(a, b) {
    return a.team.localeCompare(b.team);
  });
}

module.exports = CsgoData;
