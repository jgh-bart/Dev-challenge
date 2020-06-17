var fs = require("fs");

exports.uploadImage = function(inputFilepath, newFilepath) {
	// Read the file
	fs.readFile(inputFilepath, function(err, data) {
		if (err) throw err;
		console.log("File read:", inputFilepath);
		// Write the file to new location
		fs.writeFile(newFilepath, data, function(err) {
			if (err) throw err;
			console.log("File uploaded to:", newFilepath);
		});
	});
	// Delete the file in temporary input location
	deleteImage(inputFilepath);
}

exports.deleteImage = function(filepath) {
	fs.unlink(filepath, function(err) {
		if (err) throw err;
		console.log("File deleted:", filepath);
	});
}