import React, {Component} from "react";
import Navbar from "./navbar";
import Plus_button_small from "../Assets/Plus_button_small.png";

class C07Tasks extends Component{
	render() {
		return (
			<div>
				<Navbar/>
				<h1 className="white">Tasks</h1>
				<div style={{paddingLeft: "10%", paddingRight: "10%"}}>
					<div id="tasksList"></div>
					<img id="addTaskButton"
						 className="pointer"
						 src={Plus_button_small}
						 alt="Add a task line"
						 width="30px"
						 onclick="buttonAddTask();"/>
				</div>
			</div>
		);
	}
}

export default C07Tasks;