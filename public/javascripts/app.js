var socket = io.connect('http://localhost:3001');

socket.on('info', function(data) {
  console.log(data.text);
  $(".data").append(data.text + "<br />");
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
