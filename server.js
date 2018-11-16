const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
// create express app
const app = express();
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyBC3iBIYsIJoRAqtRQtDwBjoPm3MNReJOA",
    authDomain: "webfcm-e8cbb.firebaseapp.com",
    databaseURL: "https://webfcm-e8cbb.firebaseio.com",
    projectId: "webfcm-e8cbb",
    storageBucket: "webfcm-e8cbb.appspot.com",
    messagingSenderId: "721266676018"
  };
  firebase.initializeApp(config);

app.use(bodyParser.json())
require('./app/routes/note.routes.js')(app);
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json


// define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "Testing Mongo on Node.js"});
// });

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
app.get('/', function (req, res) {

	console.log("HTTP Get Request");
	var userReference = firebase.database().ref("/TestMessages/");

	//Attach an asynchronous callback to read the data
	userReference.on("value", 
			  function(snapshot) {
					console.log(snapshot.val());
					res.json(snapshot.val());
					userReference.off("value");
					}, 
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

app.put('/', function (req, res) {

	console.log("HTTP Put Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/TestMessages/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
	userReference.set({Name: name, Age: age}, 
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					} 
					else {
						res.send("Data saved successfully.");
					}
			});
});

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


