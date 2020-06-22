// page starter: retrieve taks from session data, load page content
function loadPage() {
	$.ajax({
		url: "/getUser",
		complete: function(data) {
			var tasks = data.responseJSON.tasks;
			console.log(tasks);
			$("#tasksList").empty();
			var i = 1;
			tasks.forEach(function(taskItem) {
				var newDiv = document.createElement("div");
				// task text
				$(newDiv).append(`<input type="text" id="task${i}" class="task-text"
				                  placeholder="Task ${i}" value="${taskItem.task}" onkeypress="enterText(${i});">`);
				// task checkbox, disabled if task text is blank
				if (taskItem.task.length == 0) {
					$(newDiv).append(`<input type="checkbox" id="task${i}Checkbox" disabled=true>`);
				} else {
					if (taskItem.tick == true) {
						var checked = "checked";
					} else {
						var checked = "";
					}
					$(newDiv).append(`<input type="checkbox" id="task${i}Checkbox" ${checked} onclick="clickCheckbox(${i});">`);
				}
				$("#tasksList").append(newDiv);
				i += 1;
			});
		}
	});
}
loadPage();

// function for button to add a new task line
function buttonAddTask() {
	if(confirm("Do you want to add a line for a new task?")) {
		var taskToAdd = {"task": "", "tick": false};
		var i = $("#tasksList").children().length;
		// send to /setUser to update data
		$.ajax({
			url: `/setUser?tasks.${i}=${JSON.stringify(taskToAdd)}`,
		});
		loadPage(); // reload page
	}
}

// function activated if enter pressed in any of the task inputs
function enterText(inputIDNumber) {
	var keycode = event.keyCode || event.which;
	if(keycode == '13') {
		event.preventDefault(); // prevent page from reloading by default
		var taskText = $("#task" + inputIDNumber).val();
		if (taskText.length > 40) {
			alert("That's a big task! Try a task of 40 or fewer characters.");
		} else if (taskText.length != 0) {
			// send to /setUser to update data
			$.ajax({
				url: `/setUser?tasks.${inputIDNumber - 1}.task=${taskText}`,
			});
			loadPage(); // reload page
		} else if (taskText.length == 0 && confirm("This task is blank. Do you want to save it?")) {
			var taskToAdd = {"task": "", "tick": false};
			// send to /setUser to update data
			$.ajax({
				url: `/setUser?tasks.${inputIDNumber - 1}=${JSON.stringify(taskToAdd)}`,
			});
			loadPage(); // reload page
		}
	}
}

// function activated if any checkbox clicked
function clickCheckbox(inputIDNumber) {
	var checked = $("#task" + inputIDNumber + "Checkbox").prop("checked");
	// send to /setUser to update data
	$.ajax({
		url: `/setUser?tasks.${inputIDNumber - 1}.tick=${checked}`,
	});
}