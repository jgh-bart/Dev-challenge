var express      = require("express");
var bodyParser   = require("body-parser");
var formidable   = require('formidable');
var imgFunctions = require("./Code/js06-photos.js");

var app = express();
// set view engine
app.set("view engine", "jade");

// access assets and code
app.use("/Assets", express.static("Assets"));
app.use("/Code", express.static("Code"));

// login page
app.get(["/", "/login"], function(req, res) {
	res.sendFile(__dirname + "/01-frontpage.html");
});
app.post("loginHomepage", function(req, res) {
	// login logic to be implemented here
	res.redirect(__dirname + "/02-homepage");
});
app.post("registerHomepage", function(req, res) {
	// registration logic to be implemented here
	res.redirect(__dirname + "/02-homepage");
});

// other pages
app.get("/:page", function(req, res) {
	if (["02-homepage", "04-news", "05-sport", "06-photos", "07-tasks"].includes(req.params.page)) {
		if (1 == 2) {
			// when login is implemented, pages will redirect to login page if no user is logged in
			res.redirect(403, __dirname + "/");
		} else if (req.params.page == "06-photos") {
			// Experiment with Jade
			res.render("06-photos");
		} else {
			res.sendFile(__dirname + "/" + req.params.page + ".html");
		}
	} else {
		res.status(404).send("Welcome to the Dev Challenge. We can't find this page.");
	}
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
