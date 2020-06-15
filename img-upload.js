var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + "/Images/" + files.filetoupload.name;
      // Read the file
        fs.readFile(oldpath, function (err, data) {
            if (err) throw err;
            console.log('File read');
            // Write the file to new location
            fs.writeFile(newpath, data, function (err) {
                if (err) throw err;
				console.log('File written');
				// Write response with image
				res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<h1>File uploaded</h1>');
				res.write('<img src="data:image;base64,' + Buffer.from(data).toString('base64') + '", width=200px/>');
                res.end();
            });
            // Delete the file's temporary location
            fs.unlink(oldpath, function (err) {
                if (err) throw err;
                console.log('File deleted');
            });
        });
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(3000);

// function to count the files in a directory
/*
function countFiles(directory) {
	fs.readdir(dir, function (
}
*/