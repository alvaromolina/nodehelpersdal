// Load requirements

var express = require("express");
var app = express();

var http = require('http')
var server = http.createServer(app)
var io = require('socket.io').listen(server);

var httpcliente = require('http');


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
      console.log(n);
      if(n[0].toLowerCase() == 'crimen'){
        
        
          n[0]="";
          mens = n.join();
          options = {
            host: 'practiclabs.com',
            path: '/messages/add/'+mens+'4565',
            //path: '/Mobiles/getPlateData/'+'2477HEP'+'.json',
            method: 'GET'
          };
        
          http.request(options, function(response) {
                  response.on('end', function() {
                    fn(0,"Incidente registrado. Muchas Gracias.");
                  });
                  
          } ).end();
        
      }else if(n[0].toLowerCase() == 'placa'){
        
        if(typeof n[1] !== "undefined"){

          options = {
            host: 'practiclabs.com',
            path: '/Mobiles/getPlateData/'+n[1].toUpperCase()+'.json',
            //path: '/Mobiles/getPlateData/'+'2477HEP'+'.json',
            method: 'GET'
          };
        
          http.request(options, function(response) {
                  var placadata = '';
                  // keep track of the data you receive
                  response.on('data', function(data) {
                    placadata += data;
                  });
                  
                  // finished? ok, write the data to a file
                  response.on('end', function() {
                        console.log("placa:"+placadata.toString());
                        
                        jplaca = JSON.parse(placadata);
                        if(typeof jplaca.Clase!=='undefined'){
                          fn(0,"Clase:"+jplaca.Clase+" Modelo: "+jplaca.Clase+ " Marca:" + jplaca.Marca+" Color:"+ jplaca.Color+ " Puertas:"+jplaca.Puertas+" Radicatoria:"+ jplaca.Radicatoria);
                        }else{
                          fn(0,'La placa no esta en nuestra base de datos');
                        }
                  });
                  
          } ).end();
        }else{
          mensaje ='placa invalida';
          
          fn(0,mensaje);
        }        
      }
      else{
        mensaje ='favor enviar la palabra crimen o placa seguida de la placa o texto';
        fn(0,mensaje);
      }
      
    });
    
});