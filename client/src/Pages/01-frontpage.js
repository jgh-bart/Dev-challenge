import React, {Component} from "react";

class C01Frontpage extends Component{
	render() {
		return (
			<div>
				<h1 className="text-center white">Dev Challenge</h1>
		
				{/* text input form to sign in [hidden by signUp()] */}
				<div id="signInDisplay" className="text-center" style={{display: "block"}}>
					<div className="login-form">
						<form action="/login" method="POST">
							<input type="text" name="username" className="frontpageInputField" placeholder="Username" required/>
							<input type="password" name="password" className="frontpageInputField" placeholder="Password" required/>
							<div className="text-center" style={{position: "absolute", bottom: "70px", width: "100%"}}>
								<input type="submit" className="devNavButton" value="LOG IN"/>
							</div>
						</form>
					</div>
				</div>

				{/* text input form to register [hidden by signIn()] */}
				<div id="signUpDisplay" className="text-center" style={{display: "none"}}>
					<div className="login-form">
						<form action="/register" method="POST">
							<div>
								<input type="text" name="username" className="frontpageInputField" placeholder="Username" required/>
								<input type="email" name="email" className="frontpageInputField" placeholder="Email" required/>
							</div>
							<div>
								<input type="password" name="password" className="frontpageInputField" placeholder="Password" required/>
								<input type="password" name="confirmPassword" className="frontpageInputField" placeholder="Confirm Password" required/>
							</div>
							<div className="text-center" style={{position: "absolute", bottom: "70px", width: "100%"}}>
								<input type="submit" className="devNavButton" value="REGISTER"/>
							</div>
						</form>
					</div>
				</div>
				
				{/* Text to switch between log-in and registration form */}
				<p className="text-center" style={{position: "absolute", bottom: "20px", width: "100%"}}>
					<span id="loginSwitchIntro" className="white">
						New to the challenge?&nbsp;
					</span>
					<span id="loginSwitchLink" className="gold orangeHover pointer" onClick="signUp();">
						Sign up
					</span>
				</p>
			</div>
		);
	}
}

export default C01Frontpage;