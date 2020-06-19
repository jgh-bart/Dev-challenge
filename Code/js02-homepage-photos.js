// load user photos in up to 4 homepage slots
$.ajax({
	url: "/getPhotos",
	complete: function(data) {
		var i = 1;
		data.responseJSON.files.forEach(function(file) {
			if (i <= 4) {
				$("#homePhoto" + i).empty();
				$("#homePhoto" + i).append(`<img class='home-photo' src='${file}'/>`);
				i += 1;
			}
		});
	}
});