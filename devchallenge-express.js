var express      = require("express");
var session      = require("express-session");
var formidable   = require("formidable");
var fs           = require("fs")
var MongoClient  = require("mongodb").MongoClient;

var app = express();
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
// session
app.use(session({
	secret: "awoeifj24awe",
	resave: true,
	saveUninitialized: true
}));

// access assets, code, and user images
app.use("/Assets", express.static("Assets"));
app.use("/Code", express.static("Code"));
app.use("/Images", express.static("Images"));

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
				var resultArray = await result.toArray();
				if (resultArray.length > 0) {
					var user = resultArray[0];
					console.log("User found:", user.username, ", logging in");
					loginSession(req, res, user);
				} else {
					// redirect unsuccessful log-in to login page
					res.redirect("/?login=failed");
				}
				break;
			case "register":
				var username = queryArguments.username
				var password = queryArguments.password
				var email    = queryArguments.email
				// count entries matching username or email in database
				var resultCount = await client.db("dev-challenge-db").collection("dc-users").countDocuments({$or: [{username: username}, {email: email}]});
				if (await resultCount == 0) {
					// set up array of tasks, initially 7
					var tasksArray = [];
					var i;
					for (i = 0; i < 7; i++) {
						tasksArray.push({"task": "", "tick": false});
					}
					// add user
					var user = {username: username, password: password, email: email, leagueTeam: null, tasks: tasksArray};
					await client.db("dev-challenge-db").collection("dc-users").insertOne(user);
					console.log("User added:", user.username);
					loginSession(req, res, user);
					// create image folder for user, named username
					fs.mkdir(__dirname + "/Images/" + user.username, function(err) {
						if (err) throw err;
					});
				} else {
					// redirect unsuccessful registration to login page
					res.redirect("/?registration=already_exists");
				}
				break;
			case "setData":
				// identify document by username from session data, set the field required
				await client.db("dev-challenge-db").collection("dc-users").findOneAndUpdate({username: req.session.user.username}, {$set:queryArguments});
				res.end();
				break;
		}
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}
// function to log in and redirect to homepage
function loginSession(req, res, user) {
	req.session.loggedin = true;
	req.session.user = user;
	res.redirect("/02-homepage"); //redirect to homepage
}

// route to log in
app.post("/login", function(req, res) {
	username = req.body.username;
	password = req.body.password;
	if (username && password) {
		queryMongoDB(req, res, "login", {username: username, password: password});
	} else {
		// redirect to log-in page if username or password input blank
		res.redirect("/?login=blank");
	}
});
// route to register
app.post("/register", function(req, res) {
	username  = req.body.username;
	email     = req.body.email;
	password1 = req.body.password;
	password2 = req.body.confirmPassword;
	if (!email.match(/.+@.+\.[a-z]+(\.[a-z]{2})?/)) {
		res.redirect("/?registration=invalid_email");
	} else if (password1 != password2) {
		res.redirect("/?registration=passwords_unmatched");
	} else if (password1.length < 5) {
		res.redirect("/?registration=password_invalid");
	} else {
		queryMongoDB(req, res, "register", {username: username, password: password1, email: email});
	}
});
// route to log out
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
	// set session data
	for (var [key, value] of Object.entries(req.query)) {
		var parsedValue = parseIfJsonOrBoolean(value);
		// set MongoDB
		var query = {};
		query[key] = parsedValue;
		queryMongoDB(req, res, "setData", query);
		// set session data
		if (key.includes(".")) {
			// to handle nested queries in dot notation
			var splitKey = key.split(".");
			if (splitKey.length == 2) {
				req.session.user[splitKey[0]][splitKey[1]] = parsedValue;
			} else if (splitKey.length == 3) {
				req.session.user[splitKey[0]][splitKey[1]][splitKey[2]] = parsedValue;
			}
		} else {
			req.session.user[key] = parsedValue;
		}
		req.session.save(function(err) {
			if (err) throw err;
		});
	}
});
// route to retrieve user images from Images/username (username retrieved from session data)
app.get("/getPhotos", function(req, res) {
	var directoryPath = __dirname + "/Images/" + req.session.user.username;
	fs.readdir(directoryPath, function(err, files) {
		if (err) throw err;
		var filesToSend = [];
		files.forEach(function(file) {
			filesToSend.push("Images/" + req.session.user.username + "/" + file);
		});
		res.json({"files": filesToSend});
	});
});
// route to upload user image
app.post("/uploadPhoto", function(req, res) {
	var uploadPromise = new Promise(function(resolve, reject) {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			console.log('TYPE', files.filetoupload.type);
			if (files.filetoupload.type.split("/")[0] == "image") {
				var oldpath = files.filetoupload.path;
				var destinationDirectory = __dirname + "/Images/" + req.session.user.username;
				// New filename: numbered one higher than the last file in the destination directory
				var newFilename;
				var filenamePromise = new Promise(function(resolve, reject) {
					fs.readdir(destinationDirectory, function(err, files) {
						if (err) reject (err);
						if (files.length == 0) {
							newFilename = "00001";
						} else {
							newFilename = String(parseInt(files[files.length - 1].split(".")[0]) + 1).padStart(5, "0");
						}
						resolve();
					});
				});
				filenamePromise.then(function() {
					var extension = files.filetoupload.name.split(".")[files.filetoupload.name.split(".").length - 1];
					var newpath = destinationDirectory + "/" + newFilename + "." + extension;
					// Read file
					fs.readFile(oldpath, function (err, data) {
						if (err) throw err;
						console.log('File read:', oldpath);
						// Write file to new location
						fs.writeFile(newpath, data, function (err) {
							if (err) throw err;
							console.log('File written:', newpath);
						});
						// Delete the file's temporary location
						fs.unlink(oldpath, function (err) {
							if (err) throw err;
							console.log('File deleted:', oldpath);
							resolve();
						});
					});
				});
			} else {
				throw `${files.filetoupload.type} is not a permitted filetype`;
			}
		});
	});
	// promise to upload photo
	uploadPromise.then(function() {
		res.redirect("/06-photos");
	});
});
// route to delete user image
app.get("/deletePhoto", function(req, res) {
	var directoryPath = __dirname + "/Images/" + req.session.user.username;
	// promise to delete photo
	var deletePromise = new Promise(function(resolve, reject) {
		// get list of files in directory, identify file to delete by index
 		fs.readdir(directoryPath, function(err, files) {
			if (err) reject (err);
			var fileToDelete = directoryPath  + "/" + files[parseInt(req.query.id) - 1];
			// delete file
			fs.unlink(fileToDelete, function(err) {
				if (err) {
					reject(err);
				} else {
					console.log("File deleted:", fileToDelete);
					resolve();
				}
			});
		});
	});
	// send response after promise fulfilled
	deletePromise.then(function() {
		res.end();
	});
});

// login page
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/01-frontpage.html");
});
// other pages
app.get("/:page", function(req, res) {
	if (["02-homepage", "04-news", "05-sport", "06-photos", "07-tasks"].includes(req.params.page)) {
		if (! req.session.loggedin) {
			// redirect to login page if no user is logged in
			console.log("Page inaccessible: not logged in")
			res.redirect("/");
		} else {
			// send HTML file
			res.sendFile(__dirname + "/" + req.params.page + ".html");
		}
	} else {
		res.status(404).send("Welcome to the Dev Challenge. We can't find this page.");
	}
});

app.listen(3000, function() {
	console.log("Listening on port 3000");
});

// function which takes a string and returns JSON for {}, or Boolean for Boolean string, otherwise string
function parseIfJsonOrBoolean(inputString) {
	if (inputString[0] == "{" && inputString[inputString.length - 1] == "}") {
			return JSON.parse(inputString);
		} else if (inputString == "true" || inputString == "false") {
			return (inputString == "true");
		} else {
			return inputString;
		}
}
