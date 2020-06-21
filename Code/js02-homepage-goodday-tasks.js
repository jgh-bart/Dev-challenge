// retrieve user object from server session data, to set welcome message and task display on homepage
$.ajax({
	url: "/getUser",
	complete: function(data) {
		// set welcome message
		$("#welcome").html(`Good day, ${data.responseJSON.username}`);
		// set task display to display up to 3 non-empty tasks
		var tasksToDisplay = [];
		data.responseJSON.tasks.forEach(function(taskItem) {
			if (tasksToDisplay.length < 3 && taskItem.task.length != 0) {
				if (taskItem.tick == true) {
					var symbol = "&#128505;" // tick in box
				} else {
					var symbol = "&#9744;" // empty box
				}
				tasksToDisplay.push(decodeHtml(symbol + "&#160;") + taskItem.task);
			}
		});
		if (tasksToDisplay.length == 0) {
			$("#homepageTasks").append($("<p></p>").text("No tasks set."));
		} else {
			tasksToDisplay.forEach(function(taskText) {
				$("#homepageTasks").append($("<p></p>").text(taskText));
			});
		}
	}
});

//function to decode html entities
function decodeHtml(html) {
	var txt = document.createElement("textarea");
	txt.innerHTML = html;
	return txt.value;
}