/****
*
* EXPRESS SERVER WITH MONGODB CLIENT
* ==============================================
*
* >> WITH FRONTEND
*
* In terminal, run:
*
*   $ npm install     (to download/install the necessary modules)
*   $ node app.js     (to launch this node app)
*
*/

var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var util        = require('util');
var Twitter     = require('node-twitter');

var port = 8080; //select a port for this server to run on
var users;
var data;

/****
* TWITTER configuration
* ==============================================
*
*/
var twitterStreamClient = new Twitter.StreamClient(
    'bAVZ7rBZ2QMqboXEtMPnRpCvK',
    'pje8rlOyGV9Rn7NRYJ9K7hZ5i8kZwmoBtD2MJQ8hCzqEE7amjy',
    '15753430-HEgWgh8CnqtrJe5QcNR3C0jPt3E9yRdwUmMPYQecX',
    'whPI5kbExfxoiBOt8v8WtJsg6oezGFU0sXdInsEoNJtlx'
);

twitterStreamClient.on('close', function() {
    console.log('Connection closed.');
});
twitterStreamClient.on('end', function() {
    console.log('End of Line.');
});
twitterStreamClient.on('error', function(error) {
    console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
});
twitterStreamClient.on('tweet', function(tweet) {
  console.log("incoming tweet:".cyan);
  console.log("tweet.user.screen_name: "+tweet.user.screen_name);
  console.log("tweet.text: "+tweet.text);
//  console.log(tweet); //
  console.log("----------------------------");
  io.emit('tweet', tweet.text);
});

//***************** !!! *****************
//*** uncomment me if you want me to start up with a search term on load! ***//
//twitterStreamClient.start(['basketball']);



/****
* CONFIGURE the express application
* ==============================================
*
*/
//instantiate object of express as app
var app = express();
//use the public folder to serve files and directories STATICALLY (meaning from file)
app.use(express.static(__dirname+ '/public'));




/****
* ROUTES
* ==============================================
* - these are the HTTP /routes that we can hit
*
*/

//input GET route for when we are SAVING DATA to our database
app.get('/input', function(req,res){ // expecting:  localhost:8080/input?name=myName&data=myData
  console.log(">> /INPUT query from URL: ".cyan + JSON.stringify(req.query));
  res.send(">> /INPUT query from URL: " + JSON.stringify(req.query));

}); //end app.get('/input')


//output GET route for when we are READING data from database
app.get("/output",function(req,res){ // /output?name=myName
	console.log(">> /OUTPUT query from URL: ".yellow+JSON.stringify(req.query));
  res.send(">> /OUTPUT query from URL: "+JSON.stringify(req.query));
  //
  // if(req.query.name != null){ //checking to see if a username was passed in by URL
  //
  //   //there is a user, return this user
  //   getDataByUser(req.query,function(error, output){
  //     if(!error && output){
  //       // console.log(JSON.stringify(output, null, '\t'));
  //       res.set('Content-Type', 'application/json');
  //       res.end(JSON.stringify(output, null, '\t'));
  //     }else{
  //       res.send("error: "+error);
  //     }
  //   }); //end getDataByUser
  // }
  // else {
  //   //no user found, just give us all the data
  //   getAllData(req.query, function(error, output){
  //     if(!error && output){
  //       // console.log(JSON.stringify(output, null, '\t'));
  //       res.set('Content-Type', 'application/json');
  //       res.end("getAllData: \n"+JSON.stringify(output, null, '\t'));
  //     }else{
  //       res.send("error: "+error);
  //     }
  //   })
});




/****
* START THE HTTP SERVER
* ==============================================
*
*/
var server=http.createServer(app).listen(port, function(){
  console.log();
  console.log('  HTTP Express Server Running!  '.white.inverse);
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(listeningString.cyan.inverse);

});


/****
* START UP SOCKET SERVERS
* ==============================================
*
*/


//*** set up socketIO (browser websocket) connections ***
var io = require('socket.io')(server);

io.on('connection', function(websocket){

  console.log(">>> new websocket client connection made".green)
  // console.log(util.inspect(websocket)); //whoa there!! whole bunch of info...

  //when we get a websocket event named "search"
  websocket.on('search', function(data){
    //do something with the data you just got?
    console.log("socket IO search: ".cyan + JSON.stringify(data));
    //stop the client (in case it's running)
    twitterStreamClient.stop(function(e,t){
      console.log("twitterStreamClient STOPPED".red);
      twitterStreamClient.start([data]);
      console.log("twitterStreamClient STARTED with search: ".green + data);
    })
  });

  //when we get a websocket event named "stop"
  websocket.on('stop', function(data){ //we received a "stop" command from the browser socket
    twitterStreamClient.stop(function(e,t){
      console.log("twitterStreamClient STOPPED".red);
    })
    console.log("socket IO CLICK: ".green + JSON.stringify(data));
  });

  websocket.on('disconnect', function(data){
    socketIOConnections = []; // wipe out our array, everyone will get re-added... TODO: much better ways to handle this...
    console.log("websocket DISCONNECTED: ".red+data.toString());
  })
});
