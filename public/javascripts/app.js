// Socket behaviour

var socket = io.connect('http://192.168.63.128:3001');

socket.on('info', function(data) {
  $("#logText").append(data.text + "<br />");
});

socket.on('mapInfo', function(data) {
  $("#map").text("Map : " + data.name);
  $("#status").text(data.status);
});

socket.on('teamCT', function(data) {
  $("#teamCT .team").text(data.name);
  $("#teamCT .score").text(data.score);
});

socket.on('teamT', function(data) {
  $("#teamT .team").text(data.name);
  $("#teamT .score").text(data.score);
});

// We send the notification to the user only if he isn't watching the tab
socket.on('notification', function(data){
  if(!document.hasFocus()){
    notifyUser(data.text);
  }
})

socket.on('players', function(data) {
  for (var i = 0; i < data.players.length; i++) {
    var player = data.players[i];
    console.log("Player " + player.name + "is on team " + player.team);
    $("#player" + i + " .playerInfo .playerName").text(player.name);
    $("#player" + i + " .playerMoney").text(player.money);
    // Health
    $("#player" + i + " .playerHealth .progress-bar").attr("aria-valuenow", player.health);
    $("#player" + i + " .playerHealth .progress-bar").css("width", player.health + "%");
    $("#player" + i + " .playerHealth .progress-bar").text(player.health);
    // Armor
    $("#player" + i + " .playerArmor .progress-bar").attr("aria-valuenow", player.armor);
    $("#player" + i + " .playerArmor .progress-bar").css("width", player.armor + "%");
    $("#player" + i + " .playerArmor .progress-bar").text(player.armor);
    $("#player" + i + " .playerImage").css("filter", function(){
      var flashInt = parseInt(player.flashed);
      var flashValue = 100+(flashInt*3);
      return "brightness("+flashValue+"%)";
    });
    // More info
    $("#player" + i + " .playerKills").text(player.kills);
    $("#player" + i + " .playerDeaths").text(player.deaths);
    $("#player" + i + " .playerAssists").text(player.assists);
    $("#player" + i + " .playerScore").text(player.score);
    // $(".player"+i+" .playerName").text(player.roundKills);
  }
});

socket.on('playersImages', function(data){
  for (var i = 0; i < data.players.length; i++) {
    var player = data.players[i];
    $("#player" + i + " .playerImage").attr("src", player.image);
  }
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
