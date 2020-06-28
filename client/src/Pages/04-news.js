import React, {Component} from "react";
import Navbar from "./navbar";

class C04News extends Component{
	// Initialize the state
	constructor(props){
		super(props);
		this.state = {
			newsImage: null,
			newsHeadline: "",
			newsBody: "",
		}
	}

	// fetch parameters from back end
	componentDidMount() {
		fetch('/api/getNews')
			.then(res => res.json())
			.then(item => this.setState(item));
	}

	render() {
		return (
			<div>
				<Navbar/>
				<h1 className="white">News</h1>
				<div id="newsImageHolder">{this.state.newsImage}</div>
				<h3 id="newsHeadline" className="white text-center">{this.state.newsHeadline}</h3>
				<p id="newsBody" className="white devBodyText">{this.state.newsBody}</p>
			</div>
		);
	}
}

export default C04News;