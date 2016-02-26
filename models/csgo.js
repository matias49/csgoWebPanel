var CONFIG = require('../config/config');

function CsgoData(body){

}

function Provider(provider){
  this.name = provider.name;
  this.appid = provider.appid;
  this.version = provider.version;
  this.steamid = provider.steamid;
  this.timestamp = provider.timestamp;
}

function Map(map){
  this.mode = map.mode;
  this.name = map.name;
  this.phase = map.phase;
  this.round = map.round;
}

function Player(player){

}

function AllPlayers(allplayers){

}

function State(state){
  this.health = state.health;
  this.armor = state.armor;
  this.helmet = state.helmet;
  this.flashed = state.flashed;
  this.burning = state.burning;
  this.money = state.burning;
  this.roundKills = state.round_kills;
  this.roundKillsHS = state.round_killhs;
}

function MatchStats(matchStats){
  this.kills = matchStats.kills;
  this.assists = matchStats.assists;
  this.deaths = matchStats.deaths;
  this.mvps = matchStats.mvps;
  this.score = matchStats.score
}

function Team(team, side, defaultName){
  this.score = team.score;
  this.side = side;
  this.name = team.hasOwnProperty(team.name) ? team.name : defaultName;
}

function Auth(auth){
  this.token = auth.token;
}

module.exports = CsgoData;
