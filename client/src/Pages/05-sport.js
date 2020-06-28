import React, {Component} from "react";
import Navbar from "./navbar";

class C05Sport extends Component{
	// constructor(props) {
		// super(props);
		// this.state = {team: ""};
	// }
	// state = {team: ""};
	// inputMyTeam = (event) => {
		// this.setState({this.state.team});
	// }
	// enterMyTeam = (event) => {
		// event.preventDefault();
		// console.log("SUBMITTED", this.state.team);
	// }
	render() {
		//const {introTeamsBeaten, teamsBeaten} = this.props;
		var introTeamsBeaten = "These teams"
		var teamsBeaten = ["a", "b"];
		const listTeamsBeaten = teamsBeaten.map(team => <li key={team}>{team}</li>);
		
		return (
			<div>
				<Navbar/>
				<h1 className="white">Champions League Challenge</h1>
				<form className="text-center" onSubmit={this.enterMyTeam}>
					<label className="gold">Set my team:</label>
					<input type="text" id="myNewTeam" onChange={this.inputMyTeam}/>
					<button type="submit" id="enterTeamButton">Enter</button>
				</form>
				<p id="introTeamsBeaten" className="devBodyText">{introTeamsBeaten}</p>
				<ul id="listTeamsBeaten" className="devBodyText overflow-autoscroll">{listTeamsBeaten}</ul>
			</div>
		);
	}
}

export default C05Sport;