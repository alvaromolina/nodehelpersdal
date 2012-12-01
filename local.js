var SerialPort = require("serialport").SerialPort;
var serialport = require("serialport");

var mensajerecibido = false;
var telefonofrom = '';
var mensajeenviar ='';


var io = require('socket.io-client');

var serverUrl = 'http://50.57.83.147:8082/';
var conn = io.connect(serverUrl);

conn.on('connect', function(socket) { 
    console.log('Connected!');
});

conn.on('sms', function (data) {
  console.log(data);

  sp.write('AT+CMGS="'+data.numero+'"\r');
  mensajeenviar=data.mensaje.toString('utf-8').trim();
  setTimeout(function () {
    sp.write('\r');
  }, 200);
  
});
  


process.stdin.resume();
process.stdin.setEncoding('utf8');
 
process.stdin.on('data', function (chunk) {
  sp.write(chunk);
});


var sp = new SerialPort("/dev/tty.SLAB_USBtoUART", {
  baudrate: 115200,
  databits: 8,
  stopbits: 1,
  parity: 'none',
  flowControl: false,
  parser: serialport.parsers.readline("\n") 
});


sp.on('close', function (err) {
  console.log('port closed');
});

sp.on('error', function (err) {
  console.error("error", err);
});

sp.on('open', function () {
  console.log('port opened');
});

sp.on("data", function (data) {
  
    console.log("Received"+data);
    var regex = '\CMT: "([0-9]+)"'
    var result = data.match(regex);
    //console.log(result);
    if(result && result[1]){
      console.log(typeof result[1]);
      console.log(result[1]);
      telefonofrom = result[1];
      mensajerecibido = true;
    }else if (mensajerecibido){
      data = data.substr(0,data.length-1);
      console.log("recibido"+data+" de "+telefonofrom);
      mensajerecibido = false;
      conn.emit('smsrecibido', {'mensaje':data,'telefono':telefonofrom}, function(resp, data) {
          sp.write('AT+CMGS="'+telefonofrom+'"\r');
          
          setTimeout(function () {
            sp.write('\r');
            
          }, 200);
          
          //echo
          mensajeenviar=data.toString('utf-8').trim();
          
          console.log('Respuesta ' + resp+ ' ' + data);
          telefonofrom ='';
      }); 
    }
    
    data = data.toString('utf-8').trim();

    if(data=='>' && mensajeenviar!=''){
      sp.write(mensajeenviar+"\x1A\r\n");
    }
});



