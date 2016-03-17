var socket = io.connect('http://localhost:3001');

socket.on('info', function(data) {
  $(".data").append(data.text + "<br />");
});

socket.on('mapInfo', function(data) {
  $("#map").text("Map : " + data.name);
  $("#status").text(data.status);
});

socket.on('teamT', function(data) {
  $("#team1.team").text(data.name);
  $("#team1.score").text(data.score);
});

socket.on('teamCT', function(data) {
  $("#team1.team").text(data.name);
  $("#team1.score").text(data.score);
});

socket.on('players', function(data) {
  for (var i = 0; i < data.players.length; i++) {
    player = data.players[i];
    console.log("Player " + player.name + "is on team" + player.team);
    $(".player" + i + ".playerName").text(player.name);
    $(".player" + i + ".playerMoney").text(player.money);
    // Health
    $(".player" + i + ".playerHealth.progress-bar").attr("aria-valuenow", player.health);
    $(".player" + i + ".playerHealth.progress-bar").css("width", player.health + "%");
    $(".player" + i + ".playerHealth.progress-bar").text(player.health);
    // Armor
    $(".player" + i + ".playerArmor.progress-bar").attr("aria-valuenow", player.armor);
    $(".player" + i + ".playerArmor.progress-bar").css("width", player.armor + "%");
    $(".player" + i + ".playerArmor.progress-bar").text(player.armor);

    // More info
    $(".player" + i + ".playerKills").text(player.kills);
    $(".player" + i + ".playerName").text(player.deaths);
    $(".player" + i + ".playerName").text(player.assists);
    $(".player" + i + ".playerName").text(player.score);
    // $(".player"+i+".playerName").text(player.roundKills);
  }
});


$(document).ready(function() {
  console.log('ready');
});

$('#playersSeeScoreboard').click(function() {
  if ($('#playersSeeScoreboard').is(':checked')) {
    $('.playerBars').hide();
    $('.playerMoney').hide();
  } else {
    $('.playerBars').show();
    $('.playerMoney').show();
  }
});
