const express = require('express');
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build/client')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// API endpoint for weather
app.get("/api/weather", (req, res) => {
	var weather = {}
});

// API endpoint for news
const accessNews = require("./Code/js04-news.js");
app.get("/api/getNews", (req, res) => {
	//var news = {newsImage: null, newsHeadline: "Headline", newsBody: "Some news."};
	var news = accessNews();
	console.log(news);
	res.json(news);
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);