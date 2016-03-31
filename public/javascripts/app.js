// Socket behaviour

var socket = io.connect('http://192.168.63.128:3001');
var teamSwaped = false;

socket.on('info', function(data) {
  $("#logText").prepend(data.text + "<br />");
});

socket.on('mapInfo', function(data) {
  $("#map").text(data.name);
  $("#status").text(data.status);
});

socket.on('teamCT', function(data) {
  $("#teamCT .teamName").text(data.name);
  $("#teamCT .teamScore").text(data.score);
});

socket.on('teamT', function(data) {
  $("#teamT .teamName").text(data.name);
  $("#teamT .teamScore").text(data.score);
});

// We send the notification to the user only if he isn't watching the tab
socket.on('notification', function(data){
  if(!document.hasFocus()){
    notifyUser(data.text);
  }
})

socket.on('swapTeams', function(data){
  if((data.round >= 16 && data.phase != 'over' && !teamSwaped) || (data.round <= 15 && teamSwaped)){
    $('#teamT').attr('id', 'oldTeamT');
    $('#teamCT').attr('id', 'teamT');
    $('#oldTeamT').attr('id', 'teamCT');
    teamSwaped = teamSwaped ? false : true;
  }

})

socket.on('players', function(data) {
  updatePlayers(data.ct,"CT");
  updatePlayers(data.t,"T");
});

socket.on('playersImages', function(data){
  for (var key in data.players) {
    $(".player[steamid='"+data.players[key].steamid+"'] .playerImage").attr("src", data.players[key].image);
  }
});

socket.on('noData', function(){
  $("#status").text("Waiting for data...");
});

function notifyUser(text){
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      var notification = new Notification("CSGO Spectator", {body : text});
    }
    else {
      Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("CSGO Spectator", {body : text});
      }
    });
    }
  }
}

function updatePlayers(players, team){
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var id = "#team"+team+" .player"+i;
    $(id).attr("steamid", player.steamid);
    $(id+" .playerInfo .playerName").text(player.name);
    $(id+" .playerMoney").text(player.money);
    // Health
    if(player.health == 0){
      $(id).addClass("dead");
    }
    else {
      $(id).removeClass("dead");
    }
    $(id+" .playerHealth .progress-bar").attr("aria-valuenow", player.health);
    $(id+" .playerHealth .progress-bar").css("width", player.health + "%");
    $(id+" .playerHealth .progress-bar").text(player.health);
    // Armor
    $(id+" .playerArmor .progress-bar").attr("aria-valuenow", player.armor);
    $(id+" .playerArmor .progress-bar").css("width", player.armor + "%");
    $(id+" .playerArmor .progress-bar").text(player.armor);
    $(id+" .playerImage").css("filter", function(){
      var flashInt = parseInt(player.flashed);
      var flashValue = 100+(flashInt*3);
      return "brightness("+flashValue+"%)";
    });
    // More info
    $(id+" .playerKills").text(player.kills);
    $(id+" .playerDeaths").text(player.deaths);
    $(id+" .playerAssists").text(player.assists);
    $(id+" .playerScore").text(player.score);
    // $(".player"+i+" .playerName").text(player.roundKills);
  }
}

// Button behaviour
$('#playersSeeScoreboard').click(function() {
  if ($('#playersSeeScoreboard').is(':checked')) {
    $('.playerBars').hide();
    $('.playerMoney').hide();
  } else {
    $('.playerBars').show();
    $('.playerMoney').show();
  }
});

$('#hideLog').click(function() {
  if ($('#hideLog').is(':checked')) {
    $('#log').hide();
  } else {
    $('#log').show();
  }
});

$('#showOptions').click(function() {
  console.log($('#showOptions').attr('enabled') )
  // We show the options if the button wasn't clicked
  if($('#showOptions').attr('enabled') == 'false'){
    $('.option').show();
    $('#showOptions').attr('enabled', 'true');
  }
  else {
    $('.option').hide();
    $('#showOptions').attr('enabled', 'false');
  }
});
