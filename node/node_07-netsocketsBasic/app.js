/****
*
* EXPRESS SERVER WITH MONGODB CLIENT + SOCKETS
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
var MongoClient = require('mongodb').MongoClient;
var colors      = require('colors');
var http        = require('http');
var net         = require('net');
var StringDecoder = require('string_decoder').StringDecoder;

var port = 8081; //select a port for HTTP requests
var netsocket_port = 5000; //this is the port our arduino can connect to
var users;
var data;

// Keep track of the socket clients
var clients = [];

/****
* CONNECT to the DB
* ==============================================
*
*/
MongoClient.connect("mongodb://localhost:27017/mynewDB", function(err, db) {
  if(!err) {
		// create our collections objects
		users = db.collection("users");
		data = db.collection("data");
		console.log("Successfully connected to MongoDB".green);
  }
});





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

// sample route with a route the way we're used to seeing it
app.get('/test', function(req, res) { //req = request (what came in)
                                      //res = response (what we're sending back)
	res.send('this is a test!');
});


//input GET route for when we are SAVING DATA to our database
app.get('/input', function(req,res){ // expecting:  localhost:8080/input?name=myName&data=myData
  console.log(">> /INPUT query from URL: ".cyan + JSON.stringify(req.query));

	insertData(req.query, function(error, data){ //returns error AND data that was just submitted
    if(!error){
      console.log("insertData complete: \n".green+JSON.stringify(data));
      res.send(data)
    } else {
      console.log("error on insertData: ".red + error)
      res.send("error insertData: \n" + error)
    }
  }); //end insertData

}); //end app.get('/input')


//output GET route for when we are READING data from database
app.get("/output",function(req,res){ // /output?name=myName
	console.log(">> /OUTPUT query from URL: ".yellow+JSON.stringify(req.query));

  if(req.query.name != null){ //checking to see if a username was passed in by URL

    //there is a user, return this user
    getDataByUser(req.query,function(error, output){
      if(!error && output){
        // console.log(JSON.stringify(output, null, '\t'));
        res.set('Content-Type', 'application/json');
        res.end(JSON.stringify(output, null, '\t'));
      }else{
        res.send("error: "+error);
      }
    }); //end getDataByUser
  }
  else {
    //no user found, just give us all the data
    getAllData(req.query, function(error, output){
      if(!error && output){
        // console.log(JSON.stringify(output, null, '\t'));
        res.set('Content-Type', 'application/json');
        res.end("getAllData: \n"+JSON.stringify(output, null, '\t'));
      }else{
        res.send("error: "+error);
      }
    })
  }
});




/****
* START THE HTTP SERVER
* ==============================================
*
*/
var server = http.createServer(app).listen(port, function(){
  console.log();
  console.log('  HTTP Express Server Running!  '.white.inverse);
  var listeningString = ' listening for HTTP on port: '+ port;
  console.log(listeningString.cyan.inverse);

});


/*** socket IO server ***/
var io = require('socket.io')(server);
io.on('connection', function(socket){
  socket.on('event', function(data){
    console.log("socket IO EVENT: ".cyan + JSON.stringify(data));

  });

  socket.on('click', function(data){
    console.log("socket IO CLICK: ".green + JSON.stringify(data));
    for(var i=0; i<netSockets.length; i++){
      //netSockets[i].write('1');
      netSockets[i].write('toggle');
    }
  })

  socket.on('disconnect', function(){
    console.log("socket DISCONNECTED".cyan);

  });
});

var netSockets = [];

/*** netsocket server ***/
var netsocketServer = net.createServer(function(socket) { //'connection' listener

  socket.name = socket.remoteAddress + ":" + socket.remotePort
  console.log('netSocket server connection made: '.green + socket.name );

  netSockets.push(socket);
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    var decoder = new StringDecoder('utf8');
    console.log("netsocket EVENT: ".yellow+decoder.write(data));
    //broadcast(socket.name + "> " + data, socket);
    socket.write(" >> this is the server response << ");
  });


  socket.on('end', function() {
    console.log('server disconnected');
  });
  //socket.write('hello\r\n');
  //socket.pipe(socket);
});

netsocketServer.listen(netsocket_port, function() { //'listening' listener
  var listeningString = ' listening for netsockets on port: '+ netsocket_port;
  console.log(listeningString.cyan.inverse);
});



//*******************************************************//
//                                                       //
//         >>>>  OUR DATABASE FUNCTIONS <<<<             //
//                                                       //
// - these could move to their own myApi.js module file  //
//                                                       //
//                                                       //
//*******************************************************//


/****
* GET ALL DATA from our db
* ==============================================
* mongo.collection.find: http://docs.mongodb.org/manual/reference/method/db.collection.find/
*/
function getAllData(query, callback){

  data.find().toArray(function(error,data){
    if(!error){
      callback(null,data);
    }else{
      callback(error, null);
    }
  });
}





/****
* GET DATA by user from our db
* ==============================================
* mongo.collection.find: http://docs.mongodb.org/manual/reference/method/db.collection.find/
*/
function getDataByUser(query, callback){

  var userToLookFor = query.name;

  data.find({name:userToLookFor}).toArray(function(error,data){
    if(!error){
      console.log("GOT DATA FOR: "+userToLookFor);
      callback(null,data);
    }else{
      console.log("ERROR FINDING DATA FOR: "+userToLookFor);
      callback(error, null);
    }
  });
}


/****
* INSERT data into DB
* ==============================================
* mongo.collection.insert: http://docs.mongodb.org/manual/reference/method/db.collection.insert/
*
*/
function insertData(query,callback){

  if(query.name != null){ //making sure the "name= " part of the query has something

    verifyUserInDB(query.name,function(verifyError, user){
      if(!verifyError && user){

          var dataObject = {name:query.name, data:query.data, time:new Date().getTime()};

          data.insert(dataObject, function(error, object){
            if(!error){
              callback(null,object); // send back null error and db object
            }else{
              console.log("insert data ERROR: "+error);
              callback(error, null);
            }
          })
      }else{
        console.log("error verifyUserInDB".red);
        callback("error verifyUserInDB: "+verifyError)
      }
    });
  } else { // req.query.name === null
    console.log("no 'name= ' could be found in your query".red);
    callback("no 'name= ' could be found in your query", null); // no name param
  }
}


/****
* VERIFY/UPDATE a user in our DB
* ==============================================
* - mongo.collection.update: http://docs.mongodb.org/manual/reference/method/db.collection.update/
* - "upsert" option means it will add this object if it cannot be found
* - OPTIONALLY, you could do a find() and if it doesn't match anyone, return an error
*
*/
function verifyUserInDB(sentName,callback){

  var query ={name:sentName};
  var newUser = {name:sentName,regtime:new Date().getTime()};

  users.update(query, newUser, {upsert:true},function(e,o){
    //http://docs.mongodb.org/manual/reference/method/db.collection.update/
    if(!e){
      callback(null,o); // send back null error and db object
    }else{
      console.log("find user ERROR: "+e);
    }
  })
}
