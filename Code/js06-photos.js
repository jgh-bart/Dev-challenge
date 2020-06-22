// function to load photos into page
function loadPage() {
	$.ajax({
		url: "/getPhotos",
		complete: function(data) {
			var i = 1;
			data.responseJSON.files.forEach(function(file) {
				if (i <= 6) {
					$("#photo" + i).empty();
					$("#photo" + i).append(`<img class="page-photo" src="${file}"/>`);
					$("#photo" + i).append(`<button type="button" class="deletePhotoButton" onclick="deleteFile('${i}');">DELETE</button>`);
					i += 1;
				}
			});
			if (i <= 6) {
				// Show plus sign to add photos in first available slot
				$("#photo" + i).empty();
				$("#photo" + i).append("<label for='uploadInput' class='centre-img'><img id='plusToUpload' class='centre-img pointer' src='Assets/Plus_button.png' alt='Add photo' width='100px'/></label>");
				i += 1;
			}
			while (i <= 6) {
				// Empty all other slots
				$("#photo" + i).empty();
				i += 1;
			}
		}
	});
}

// page starter
loadPage();

// function to submit the photo upload form
function upload() {
	$("#uploadForm").submit();
}
// function to delete a photo, activated by clicking any delete button
function deleteFile(id) {
	if (confirm("Do you want to delete this image?")) {
		$.ajax({
			url: `/deletePhoto?id=${id}`,
			complete: function() {
				loadPage();
			}
		});
	}
}