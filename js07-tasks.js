// function for button to add a new task line
function addTask() {
	var newDiv = document.createElement("div");
	var i = $("#tasksList").children().length + 1;
	$(newDiv).append(`<input type="text" id="task${i}" class="task-text" placeholder="Task ${i}">`);
	$(newDiv).append(`<input type="checkbox" id="task${i}Checkbox" disabled>`);
	$("#tasksList").append(newDiv);
}

// function for button to add a new task line
function buttonAddTask() {
	if(confirm("Do you want to add a line for a new task?")) {
		addTask();
	}
}

// load page with 7 task lines for now
var i;
for (i = 0; i < 7; i++) {
	addTask();
}

// function activated if enter pressed in any of the task inputs
$(".task-text").keypress(function() {
	var keycode = event.keyCode || event.which;
	if(keycode == '13') {
		event.preventDefault(); // prevent page from reloading by default
		var thisCheckbox = $(this).next();
		console.log('K', thisCheckbox.id, thisCheckbox.attr("disabled"));
		if ($(this).val().length == 0) {
			if (confirm("This task is blank. Do you want to save it?")) {
				$(thisCheckbox).attr("disabled", "true");
			}
		} else {
			$(thisCheckbox).attr("disabled", "false");
		}
	}
});