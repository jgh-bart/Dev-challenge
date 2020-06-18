// function to load photos into page
function loadPage() {
	$.ajax({
		url: "/getPhotos",
		complete: function(data) {
			var i = 1;
			data.responseJSON.files.forEach(function(file) {
				$("#photo" + i).empty();
				$("#photo" + i).append(`<img class='page-photo' src='Images/${file}'/>`);
				i += 1;
			});
			if (i <= 6) {
				// Show plus sign to add photos in first available slot
				$("#photo" + i).empty();
				$("#photo" + i).append("<img id='uploadPlus' class='centre-img pointer' src='Assets/Plus_button.png' alt='Add photo' width='100px' onclick='uploadFile();'/>");
			}
		}
	});
}

// page starter
loadPage();

// function to add a photo, activated by clicking plus sign
function uploadFile() {
	$.ajax({
		url: "/uploadPhoto",
		complete: function() {
			loadPage();
		}
	});
}