// Load requirements

var express = require("express");
var app = express();

var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server);


server.listen(8082)


app.get('/', function (req, res) {
  res.send('Hola');
});


app.get('/sendsms/:numero/:mensaje', function (req, res) {
  res.send('Hola');
  
  io.sockets.emit('sms', { mensaje: req.params.mensaje, numero: req.params.numero});

});


io.sockets.on('connection', function(socket) { 

    console.log('Client connected.');
    
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
    
    socket.on('smsrecibido', function (data, fn) {
      console.log(data);
      
      var str=data.mensaje;
      var n =str.split(" ");
      
      if(n[0].toLowerCase == 'crimen'){
        mensaje = 'se reporto el crimen. Mucha gracias';
      }else if(n[0].toLowerCase == 'placa'){
        mensaje ='info placa';
      }
      else{
        mensaje ='favor enviar la palabra crimen o placa';
      }
      
      fn(0,mensaje);
    });
    
});