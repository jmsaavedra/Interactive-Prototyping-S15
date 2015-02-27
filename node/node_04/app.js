
//In terminal - run:

//npm install  - to download the necessary modules.
//node server.js - to run the server file in node.

var express = require('express'); //connect to the express module
var app = express(); //instantiate object of express as app
var port = 8080; //select a port
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var users;
var data;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/mySweetDB", function(err, db) {
  if(!err) {
		// create our collections objects
		users = db.collection("users");
		data = db.collection("data");
		console.log("We are connected");
  }
});



//use a folder to serve content out of (quickest way to get a webserver)
//all files in /public will be served up /visible to our server.
//Meaning that we can connect to them with data.
//try adding your own html and css files to the public folder

app.use(express.static(__dirname+'/public'));
app.get("/input",function(req,res){ // /input/?name=myName&data=myData
	console.log(JSON.stringify(req.query));
	//res.send(req.query);
	if(req.query.name != null){
		queryDBForName(req.query.name,function(e,o){
			if(!e && o){
				insertData(req.query,function(_e,_o){
					if(!_e){
						res.send(JSON.stringify(_o));
					}
				});
			}else{
				console.log("db error");
				res.send(400); // db error
			}
		});
	}else{
		console.log("no name");
		res.send(400); // no name param
	}
})
app.get("/output",function(req,res){
	console.log("OUTPUT GET: "+JSON.stringify(req.query));
  if(req.query.name != null){
    //make sure this name is real
    queryDataForName(req.query.name,function(e,o){
      if(!e && o){
        res.send(JSON.stringify(o));
      }else{
        res.send(400);
      }
    })
  }else{
    console.log("OUTPUT GET NO NAME PASSED");
    res.send(400);
  }

})
//start listening on our port of 8080
//visit localhost:8080/your_file.ext to view your work
app.listen(port);

function queryDBForName(sentName,callback){
	var queryDB ={name:sentName};
	var newUser = {name:sentName,regtime:new Date().getTime()};
	users.update(queryDB,newUser,{upsert:true},function(e,o){
		if(!e){
			console.log("found user: "+JSON.stringify(o));
			callback(null,o); // send back null error and db object
		}else{
			console.log("find user ERROR: "+e);
		}
	})
}
function queryDataForName(sentName,callback){
  data.find({name:sentName}).toArray(function(e,o){
    if(!e){
      console.log("GOT DATA FOR: "+sentName + " "+JSON.stringify(o));
      callback(null,o);
    }else{
      console.log("ERROR FINDING DATA FOR: "+sentName);
    }
  })
}
function insertData(query,callback){
	var dataObject = {name:query.name,data:query.data,time:new Date().getTime()};
	data.insert(dataObject,function(e,o){
		if(!e){
			callback(null,o); // send back null error and db object
		}else{
			console.log("insert data ERROR: "+e);
		}
	})
}

console.log("Listening on Port "+port+", press control-C to quit");

// function tree(data) {
//     if (typeof(data) == 'object') {
//         document.write('<ul>');
//         for (var i in data) {
//             document.write('<li>' + i);
//             tree(data[i]);
//         }
//         document.write('</ul>');
//     } else {
//         document.write(' => ' + data);
//     }
// }
