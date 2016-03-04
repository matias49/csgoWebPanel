var socket = io.connect('http://localhost:3001');

socket.on('info', function(data){
  console.log(data.text);
  $(".data").append(data.text+ "<br />");
});
