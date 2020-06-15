// https://www.youtube.com/watch?v=EN6Dx22cPRI

var express = require("express");
var mysql = require('mysql');
var app = express();

// MySQL connection
var db = mysql.createConnection({
	domain   : 'https://mysqladmin.lnx1.innerbox.net/',
	host     : 'localhost',
	user     : 'sukyin01_db01_01',
	password : '6YsrDypg1@o8Uvod',
	database : 'dev-challenge'
});

db.connect(function(err) {
	if (err) throw err;
	console.log("MySQL connected.");
});

// create db
app.get("/createdb", function(req, res) {
	var sql = "CREATE DATABASE nodemysql";
	db.query(sql, function(err, result) {
		if (err) throw err;
		console.log(result);
		res.send("Database created.");
	});
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});