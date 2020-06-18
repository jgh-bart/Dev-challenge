var MongoClient = require("mongodb").MongoClient;

// MongoDB connection
var mongodbURL = "mongodb+srv://JGHB:devchallenge123@cluster0-pzgen.gcp.mongodb.net/dev-challenge-db?retryWrites=true&w=majority"

// function to access MongoDB database
async function queryMongoDB() {
	var client = new MongoClient(mongodbURL);
	try {
		// Connect to the MongoDB cluster
		await client.connect();
		// set MongoDB query here
	} catch(err) {
		console.error(err);
	} finally {
		await client.close();
	}
}
queryMongoDB();