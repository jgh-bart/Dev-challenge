var express      = require("express");
var session      = require("express-session");
var formidable   = require("formidable");
var fs           = require("fs")
var MongoClient  = require("mongodb").MongoClient;
var imgFunctions = require("./Code/js06-photos.js");

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
// session
app.use(session({
	secret: "awoeifj24awe",
	resave: true,
	saveUninitialized: true
}));
// set view engine
app.set("view engine", "jade");

// access assets and code
app.use("/Assets", express.static("Assets"));
app.use("/Code", express.static("Code"));

// MongoDB connection
var mongodbURL = "mongodb+srv://JGHB:devchallenge123@cluster0-pzgen.gcp.mongodb.net/dev-challenge-db?retryWrites=true&w=majority"

// function to access MongoDB database
async function queryMongoDB(req, res, queryType, queryArguments) {
	var client = new MongoClient(mongodbURL);
	try {
		// Connect to the MongoDB cluster
		await client.connect();
		switch(queryType) {
			case "login":
				var username = queryArguments.username
				var password = queryArguments.password
				// count entries matching username and password in database
				var result = await client.db("dev-challenge-db").collection("dc-users").find({username: username, password: password});
				var resultArray = await result.toArray()
				if (resultArray.length > 0) {
					var user = resultArray[0]
					console.log("User found:", user.username, ", logging in");
					loginSession(req, res, user);
				} else {
					console.log("user/password not found");
					// redirect unsuccessful log-in to login page
					res.redirect("/");
				}
				break;
			case "register":
				var username = queryArguments.username
				var password = queryArguments.password
				var email    = queryArguments.email
				// count entries matching username or email in database
				var resultCount = await client.db("dev-challenge-db").collection("dc-users").countDocuments({$or: [{username: username}, {email: email}]});
				if (await resultCount == 0) {
					// Add user
					var user = {username: username, password: password, email: email, leagueTeam: null, tasks: {}}
					await client.db("dev-challenge-db").collection("dc-users").insertOne(user);
					console.log("User added:", user.username);
					loginSession(req, res, user);
				} else {
					console.log("Username or email already registered");
					// redirect unsuccessful registration to login page
					res.redirect("/");
				}
				break;
			case "setData":
				// identify document by username from session data, set the field required
				await client.db("dev-challenge-db").collection("dc-users").findOneAndUpdate({username: req.session.user.username}, {$set:queryArguments});
				break;
		}
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}
// function to log-in
function loginSession(req, res, user) {
	req.session.loggedin = true;
	req.session.user = user;
	res.redirect("/02-homepage"); //redirect to homepage
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
		queryMongoDB(req, res, "login", {username: username, password: password});
	} else {
		// redirect to log-in page if username or password input blank
		res.redirect("/");
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
		res.redirect("/");
	} else if (password1 != password2) {
		console.log("Passwords do not match");
		res.redirect("/");
	} else {
		queryMongoDB(req, res, "register", {username: username, password: password1, email: email});
	}
});
// to log out
app.get("/logout", function(req, res) {
	console.log("Logging out");
	req.session.destroy(function(err) {
		if (err) throw err;
	});
	res.redirect("/");
});
// route to retrieve user object of session data
app.get("/getUser", function(req, res) {
	res.json(req.session.user);
});
// route to amend user object in session data and MongoDB
app.get("/setUser", function(req, res) {
	console.log("Set data:", req.query);
	// set MongoDB
	queryMongoDB(req, res, "setData", req.query);
	// set session data
	for (var [key, value] of Object.entries(req.query)) {
		req.session.user[key] = value;
		req.session.save(function(err) {
			if (err) throw err;
		});
	}
});

// other pages
app.get("/:page", function(req, res) {
	if (["02-homepage", "04-news", "05-sport", "06-photos", "07-tasks"].includes(req.params.page)) {
		if (! req.session.loggedin) {
			// redirect to login page if no user is logged in
			console.log("Page inaccessible: not logged in")
			res.redirect("/");
		} else if (req.params.page == "06-photos") {
			// Experiment with Jade for photo page
			var imagesToDisplay = {};
			var i = 1;
			// create Jade string for each photo, add to imagesToDisplay object
			fs.readdir(__dirname + "/Images/", function(err, files) {
				if (err) throw err;
				files.forEach(function(file) {
					imagesToDisplay["photo" + i] = "img.centre-img(src='Images/" + file + "', width='280px')";
					i += 1;
				});
				if (i <= 6) {
					// the plus-sign image in the first available slot will hold the click function to add a photo
					imagesToDisplay["photo" + i] = "img.centre-img.pointer(src='Assets/Plus_button.png', alt='Add photo', width='100px')"
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
