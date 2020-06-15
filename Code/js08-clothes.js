// Heroku CORS proxy necessary due to lack of CORS 'Access-Control-Allow-Origin' header
var corsProxy = "https://cors-anywhere.herokuapp.com/"

// Load Google Charts (promise)
var googleChartsPromise = new Promise(function(resolve, reject) {
	google.charts.load('current', {'packages':['corechart']}, function(error) {
		console.log(error);
		reject(Error("GOOGLE CHARTS NOT LOADED"));
	});
	resolve();
});

// Load data and draw graph
googleChartsPromise.then(function() {
	$.ajax({
		url: corsProxy + "https://therapy-box.co.uk/hackathon/clothing-api.php?username=swapnil",
		type: "GET",
		sameSite: "None",
		datatype: "json",
		success: function (result) {
			// clothes: an object holding the counts of each item
			var clothes = {};
			result.payload.forEach(function(item) {
				if (clothes.hasOwnProperty(item.clothe)) {
					clothes[item.clothe] += 1;
				} else {
					clothes[item.clothe] = 1
				}
			});
			var data = new google.visualization.DataTable();
			data.addColumn("string", "Clothes");
			data.addColumn("number", "Days");
			for (var item in clothes) {
				data.addRow([item, clothes[item]]);
			};
			var chart = new google.visualization.PieChart(document.getElementById("clothesPiechart"));
			chart.draw(data, options={"width":250, "height":130, "backgroundColor": "transparent"});
		},
		error: function (error) {
			console.log(error);
		}
	})
});