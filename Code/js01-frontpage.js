var urlParams = new URLSearchParams(window.location.search);

// respond to URL query with alert
if (urlParams.has("login")) {
	alertMessages = {"failed": "This user/password combination was not recognised.",
	                 "blank": "Please enter your username and password."};
	alert(alertMessages[urlParams.get("login")]);
} else if (urlParams.has("registration")) {
	alertMessages = {"invalid_email": "Please enter a valid email address.",
	                 "passwords_unmatched": "Please enter a matching password and password confirmation.",
					 "password_invalid": "Please set a password at least 5 characters long.",
					 "already_exists": "There is already a user registered with this username or email address."};
	alert(alertMessages[urlParams.get("registration")]);
	// show sign-up form
	signUp();
}

// function to show sign-up form (activated by clicking text "Sign up")
function signUp() {
	$("#signInDisplay").attr("style","display: none");
	$("#signUpDisplay").attr("style","display: block");
	$("#loginSwitchIntro").html("Already registered?");
	$("#loginSwitchLink").html("Log in");
	$("#loginSwitchLink").attr("onclick","signIn();");
}
// function to show sign-in form (activated by clicking text "Log in")
function signIn() {
	$("#signInDisplay").attr("style","display: block");
	$("#signUpDisplay").attr("style","display: none");
	$("#loginSwitchIntro").html("New to the challenge?");
	$("#loginSwitchLink").html("Sign up");
	$("#loginSwitchLink").attr("onclick","signUp();");
}