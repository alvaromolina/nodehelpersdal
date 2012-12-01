var io = require('socket.io-client');

var serverUrl = 'http://localhost:8080/';
var conn = io.connect(serverUrl);

conn.on('connect', function(socket) { 
    console.log('Connected!');
    conn.emit('evento', 'data enviada', function(resp, data) {
        console.log('server sent resp code ' + resp+ ' ' + data);
    });
});

