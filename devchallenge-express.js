var express      = require("express");
var formidable   = require("formidable");
var fs           = require("fs")
var MongoClient  = require("mongodb").MongoClient;
var imgFunctions = require("./Code/js06-photos.js");

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
// set view engine
app.set("view engine", "jade");

// access assets and code
app.use("/Assets", express.static("Assets"));
app.use("/Code", express.static("Code"));

// MongoDB connection
var mongodbURL = "mongodb+srv://JGHB:devchallenge123@cluster0-pzgen.gcp.mongodb.net/dev-challenge-db?retryWrites=true&w=majority"

// function to check if username or email is already in database, and if not, add user to database
async function addUser(res, username, password, email) {
	var client = new MongoClient(mongodbURL);
	try {
		// Connect to the MongoDB cluster
		await client.connect();
		// check if username or email is not already in database
		var resultCount = await client.db("dev-challenge-db").collection("dc-users").countDocuments({$or: [{username: username}, {email: email}]});
		if (await resultCount == 0) {
			// Add user
			await client.db("dev-challenge-db").collection("dc-users").insertOne({username: username, password: password, email: email, leagueTeam: null, tasks: {}});
			// redirect successful registration to homepage
			res.redirect("/02-homepage");
		} else {
			console.log("Username or email already registered");
			// redirect unsuccessful registration to login page
			res.redirect("/");
		}
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

// function to find items in database matching username and password, redirecting to homepage or login page as appropriate
async function queryUserPassword(res, username, password) {
	var client = new MongoClient(mongodbURL);
	try {
		// Connect to the MongoDB cluster
		await client.connect();
		// MongoDB query
		var resultCount = await client.db("dev-challenge-db").collection("dc-users").countDocuments({username: username, password: password});
		if (await resultCount > 0) {
			console.log("user found: logging in");
			// redirect successful log-in to homepage
			res.redirect("/02-homepage");
		} else {
			console.log("user/password not found");
			// redirect unsuccessful log-in to login page
			res.redirect("/");
		}
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}

// login page
app.get(["/", "/login"], function(req, res) {
	res.sendFile(__dirname + "/01-frontpage.html");
});
// to log in
app.post("/loginHomepage", function(req, res) {
	username = req.body.username;
	password = req.body.password;
	if (username && password) {
		queryUserPassword(res, username, password);
	} else {
		// redirect to log-in page if username or password input blank
		res.redirect(401, __dirname + "/");
	}
});
// to register
app.post("/registerHomepage", function(req, res) {
	username  = req.body.username;
	email     = req.body.email;
	password1 = req.body.password;
	password2 = req.body.confirmPassword;
	if (!email.match(/.+@.+\.[a-z]+(\.[a-z]{2})?/)) {
		console.log("Email address not valid");
		res.redirect(401, __dirname + "/");
	} else if (password1 != password2) {
		console.log("Passwords do not match");
		res.redirect(401, __dirname + "/");
	} else {
		addUser(res, username, password1, email);
	}
});

// other pages
app.get("/:page", function(req, res) {
	if (["02-homepage", "04-news", "05-sport", "06-photos", "07-tasks"].includes(req.params.page)) {
		if (1 == 2) {
			// when login is implemented, pages will redirect to login page if no user is logged in
			res.redirect(401, __dirname + "/");
		} else if (req.params.page == "06-photos") {
			// Experiment with Jade for photo page
			var imagesToDisplay = {};
			var i = 1;
			// create Jade string for each photo, add to imagesToDisplay object
			fs.readdir(__dirname + "/Images/", function(err, files) {
				if (err) throw err;
				files.forEach(function(file) {
					imagesToDisplay["photo" + i] = "img(class='centre-img' src='Images/" + file + "' width=280px)";
					i += 1;
				});
				if (i <= 6) {
					// the plus-sign image in the first available slot will hold the click function to add a photo
					imagesToDisplay["photo" + i] = "img(class='centre-img pointer' src='Assets/Plus_button.png' alt='Add photo' width=100px)"
				}
				console.log(imagesToDisplay);
			});
			res.render("06-photos", imagesToDisplay);
		} else {
			// all other pages shown from HTML file
			res.sendFile(__dirname + "/" + req.params.page + ".html");
		}
	} else {
		res.status(404).send("Welcome to the Dev Challenge. We can't find this page.");
	}
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});
