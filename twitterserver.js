// Load requirements

var express = require("express");
var app = express();
app.set("jsonp callback", true );
var https = require('http');
var http = require('http');
var fs = require('fs');

var server = https.createServer(app)
//var io = require('socket.io').listen(server);

server.listen(8083)


//The url we want, plus the path and options we need
/*var options = {
  host: 'api.twitter.com',
  path: '/1/statuses/show/210462857140252672.json',
  method: 'GET'
};
*/
var options = {
  host: 'search.twitter.com',
  path: '/search.json?q=%23cochavalley',
  method: 'GET'
};




app.get('/', function (req, res) {
  res.send('Hola');
});


app.get('/tweets', function (req, res) {
    res.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
    // make the request, and then end it, to close the connection
    http.request(options, function(response) {
            var tweetData = '';
            // keep track of the data you receive
            response.on('data', function(tweets) {
              tweetData += tweets;
            });

            // finished? ok, write the data to a file
            response.on('end', function() {
                    
                  console.log(tweetData);
                  console.log(req.query);
                  res.end(req.query.callback+"("+tweetData+")");
            });
    } ).end();   
});


app.get('/tweet/:id', function (req, res) {
    
    var option = {
  host: 'search.twitter.com',
  path: '/search.json?q=%23segurimapas',
  method: 'GET'
};


    res.writeHead(200, {"Content-Type": "text/plain; charset=UTF-8"});
    // make the request, and then end it, to close the connection
    http.request(option, function(response) {
            var tweetData = '';
            // keep track of the data you receive
            response.on('data', function(tweets) {
              tweetData += tweets;
            });

            // finished? ok, write the data to a file
            response.on('end', function() {
                    
                  console.log(tweetData);
                  console.log(req.query);
                  res.end(req.query.callback+"("+tweetData+")");
            });
    } ).end();   
});

/*
io.sockets.on('connection', function(socket) { 

    console.log('Client connected.');
    
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
    
    socket.on('smsrecibido', function (data, fn) {
      console.log(data);
      fn(0,data.mensaje);
    });
    
});
*/