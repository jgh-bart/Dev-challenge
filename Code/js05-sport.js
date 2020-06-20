// page starter: retrieve team from session data, load content if team already set
$.ajax({
	url: "/getUser",
	complete: function(data) {
		var myTeam = data.responseJSON.leagueTeam;
		if (myTeam) {
			getFootballData(myTeam);
		}
	}
});

// list of all teams
var allTeams = ["Verona", "Napoli", "Atalanta", "Roma", "Bologna", "Torino", "Crotone", "Milan", "Inter", "Fiorentina", 
                "Lazio", "Spal", "Sampdoria", "Benevento", "Sassuolo", "Genoa", "Udinese", "Chievo", "Juventus", "Cagliari"];

// function for enter button
function enterMyTeam() {
	var myTeam = $("#myNewTeam").val();
	if (myTeam.trim().length == 0) {
		alert("No team has been entered.");
	} else {
		// convert dots (A.C.) to spaces (A C), trim whitespace, capitalise first letter of each word
		myTeam = myTeam.replace(/\./g, " ").trim().split(/ +/).map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ");
		// variant names of Inter Milan and A.C. Milan
		if (["Inter", "Inter Milan", "Inter Milano", "Internazionale Milano", "Internazionale"].includes(myTeam)) {
			myTeam = "Inter";
		} else if (["Milan", "Ac", "A C", "Ac Milan", "A C Milan", "Associazione Calcio Milan"].includes(myTeam)) {
			myTeam = "Milan";
		}
		if (! allTeams.includes(myTeam)) {
			alert(`${myTeam} is not a recognised Serie A team.`);
		} else {
			// send new team to /setUser route
			$.ajax({
				url: `/setUser?leagueTeam=${myTeam}`,
			});
			console.log("NEW TEAM", myTeam);
			getFootballData(myTeam);
		}
	}
}

// function for enter key, behaves identically to enter button
$("#myNewTeam").keypress(function() {
	var keycode = event.keyCode || event.which;
	if(keycode == '13') {
		event.preventDefault(); // prevent page from reloading by default
		enterMyTeam();    
	}
});

// function to access Serie A data
function getFootballData(myTeam) {
	// load data
	$.ajax({
		url: "Assets/I1.csv",
		type: "GET",
		datatype: "text",
		success: function (data) {
			var allRows = data.split(/\r?\n|\r/);
			var leagueData = [];
			var matchesPlayed = [];
			var matchData;
			var wins = 0;
			var teamsBeaten = new Set;
			// loop through rows of data, start from second row to exclude title row
			var i;
			for (i=1; i < allRows.length; i++) {
				// parse match data by splitting CSV row
				leagueData.push(allRows[i].split(","));
			}
			for (i=1; i < leagueData.length; i++) {
				matchData = leagueData[i];
				// add i to array of matches played
				if (matchData[2] == myTeam || matchData[3] == myTeam) {
					matchesPlayed.push(i);
				}
				// if a win for myTeam, add opponent to set of teams beaten
				if (matchData[2] == myTeam && matchData[6] == "H") {
					teamsBeaten.add(matchData[3]);
					wins += 1;
				} else if (matchData[3] == myTeam && matchData[6] == "A") {
					teamsBeaten.add(matchData[2]);
					wins += 1;
				}
			}
			// if myTeam hasn't played a match, alert and throw error
			if (matchesPlayed.length == 0) {
				alert(`"${myTeam}" have played no matches.`);
				throw `NO MATCHES: ${myTeam}`;
			}
			// create content of page 05-sport.html
			if (wins == 0) {
				$("#introTeamsBeaten").html(`${displayName(myTeam)} have won no matches.`);
				$("#listTeamsBeaten").empty();
			} else {
				if (wins == 1) {
					$("#introTeamsBeaten").html(`${displayName(myTeam)} have won one match, beating this team:`);
				} else {
					$("#introTeamsBeaten").html(`${displayName(myTeam)} have won ${wins} matches, beating these teams:`)
				}
				$("#listTeamsBeaten").empty();
				teamsBeaten.forEach(function(team) {
					$("#listTeamsBeaten").append($("<li></li>").text(displayName(team)));
				})
			}
			// construct homepage message about myTeam's latest match
			matchData = leagueData[matchesPlayed[matchesPlayed.length - 1]];
			if (matchData[2] == myTeam) {
				var opponent = matchData[3];
				var myGoals  = matchData[4];
				var oppGoals = matchData[5];
				var homeOrAway = "at home";
			} else if (matchData[3] == myTeam) {
				var opponent = matchData[2];
				var myGoals  = matchData[5];
				var oppGoals = matchData[4];
				var homeOrAway = "away";
			}
			var result;
			if (myGoals > oppGoals) {
				result = ["Win", "winning"];
			} else if (myGoals < oppGoals) {
				result = ["Loss", "losing"];
			} else {
				result = ["Draw", "drawing"];
			}
			$("#homeSportHeader").html(`${result[0]} for ${displayName(myTeam, shortForm = true)}`);
			$("#homeSportText").html(`In their latest match on ${convertDate(matchData[1])}, ${displayName(myTeam)} played ${displayName(opponent)} ${homeOrAway}, ${result[1]} ${myGoals}&ndash;${oppGoals}.`);
		},
		error: function (error) {
			console.log(error);
		}
	})
}

// function to convert date in dd/mm/yy format to prose
function convertDate(ddmmyyDate) {
	if (ddmmyyDate.match(/((0?|[1-2])[0-9]|30|31)\/(0?[1-9]|1[0-2])\/[0-9]{2}/)) {
		var dateArray = ddmmyyDate.split("/");
		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		// day without leading 0
		var day = (dateArray[0][0] == "0") ? dateArray[0][1] : dateArray[0]
		return day + " " + months[parseInt(dateArray[1]) - 1] + " " + "20" + dateArray[2];
	} else {
		throw `INVALID DATE INPUT: ${ddmmyyDate}`;
	}
}

// function to convert team name into display form (identical to base form except for Inter Milan and A.C. Milan)
function displayName(team, shortForm = false) {
	var displayTeams = {"Inter": "Inter Milan", "Milan": "A.C. Milan"}
	if (!shortForm && (team == "Inter" || team == "Milan")) {
		return displayTeams[team];
	} else {
		return team;
	}
}