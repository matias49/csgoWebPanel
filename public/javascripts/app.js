// Socket behaviour
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
socket.on('notification', function(data) {
  if (!document.hasFocus()) {
    notifyUser(data.text);
  }
})

socket.on('swapTeams', function(data) {
  if ((data.round >= 16 && data.phase != 'over' && !teamSwaped) || (data.round <= 15 && teamSwaped)) {
    $('#teamT').attr('id', 'oldTeamT');
    $('#teamCT').attr('id', 'teamT');
    $('#oldTeamT').attr('id', 'teamCT');
    teamSwaped = teamSwaped ? false : true;
  }

})

socket.on('players', function(data) {
  updatePlayers(data.ct, "CT");
  updatePlayers(data.t, "T");
});

socket.on('playersImages', function(data) {
  for (var key in data.players) {
    $(".player[steamid='" + data.players[key].steamid + "'] .playerImage").attr("src", data.players[key].image);
  }
});

socket.on('noData', function() {
  $("#status").text("Waiting for data...");
});

socket.on('bombStatus', function(data) {
  // console.log(data);
  switch(data.status) {
    case 'planted':
      $("#bombIcon").attr("src", "/images/c4_planted.png");
      $("#bombIcon").show();
      break;
    case 'defused':
      $("#bombIcon").attr("src", "/images/c4_defused.png");
      $("#bombIcon").show();
      break;
    default:
      $("#bombIcon").attr("src", "");
      $("#bombIcon").hide();
      break;
  }
});

function notifyUser(text) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      var notification = new Notification("CSGO Spectator", {
        body: text
      });
    } else {
      Notification.requestPermission(function(permission) {
        if (permission === "granted") {
          var notification = new Notification("CSGO Spectator", {
            body: text
          });
        }
      });
    }
  }
}

function updatePlayers(players, team) {
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var id = "#team" + team + " .player" + i;
    $(id).attr("steamid", player.steamid);
    $(id + " .playerInfo .playerName").text(player.name);
    $(id + " .playerMoney").text(player.money);
    // Health
    if (player.health == 0) {
      $(id).addClass("dead");
    } else {
      $(id).removeClass("dead");
    }
    if ($(id).has("div.playerBars").length > 0){
      $(id + " .playerBars .playerHealth .progress-bar").attr("aria-valuenow", player.health);
      $(id + " .playerBars .playerHealth .progress-bar").css("width", player.health + "%");
      $(id + " .playerBars .playerHealth .progress-bar").text(player.health);
      // Armor
      $(id + " .playerBars .playerArmor .progress-bar").attr("aria-valuenow", player.armor);
      $(id + " .playerBars .playerArmor .progress-bar").css("width", player.armor + "%");
      $(id + " .playerBars .playerArmor .progress-bar").text(player.armor);
    }
    if($(id).has("div.playerLife").length > 0){
      $(id + " .playerLife .playerHealth .value").text(player.health);
      $(id + " .playerLife .playerArmor .value").text(player.armor);
    }

    $(id + " .playerImage").css("filter", function() {
      var flashInt = parseInt(player.flashed);
      var flashValue = 100 + (flashInt * 3);
      return "brightness(" + flashValue + "%)";
    });

    // More info
    // If the more info section doesn't have a "single" class, we will update each class
    if($(id + " .moreInfo").hasClass("single")){
      $(id + " .moreInfo").text(player.kills+"/"+player.assists+"/"+player.deaths);
    }
    else {
      $(id + " .playerKills").text(player.kills);
      $(id + " .playerDeaths").text(player.deaths);
      $(id + " .playerAssists").text(player.assists);
      $(id + " .playerScore").text(player.score);
    }
    // $(".player"+i+" .playerName").text(player.roundKills);
  }
}

// Button behaviour
$('#playersSeeScoreboard').click(function() {
  if ($('#playersSeeScoreboard').is(':checked')) {
    if ($('.player').has("div.playerBars").length > 0) {
      $('.playerBars').hide();
    }
    if ($('.player').has("div.playerLife").length > 0) {
      $('.playerLife').hide();
      $('.moreInfo').toggleClass("col-md-offset-5");
    }
    $('.playerMoney').hide();
  } else {
    if ($('.player').has("div.playerBars").length > 0) {
      $('.playerBars').show();
    }
    if ($('.player').has("div.playerLife").length > 0) {
      $('.playerLife').show();
      $('.moreInfo').toggleClass("col-md-offset-5");
    }
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
  console.log($('#showOptions').attr('enabled'))
    // We show the options if the button wasn't clicked
  if ($('#showOptions').attr('enabled') == 'false') {
    $('.option').show();
    $('#showOptions').attr('enabled', 'true');
  } else {
    $('.option').hide();
    $('#showOptions').attr('enabled', 'false');
  }
});
