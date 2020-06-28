import React, {Component} from "react";
import Navbar from "./navbar";

function C04News(props) {
	return (
		<div>
			<Navbar/>
			<h1 className="white">News</h1>
			<div id="newsImageHolder">{this.props.newsImage}</div>
			<h3 id="newsHeadline" className="white text-center">{this.props.newsHeadline}</h3>
			<p id="newsBody" className="white devBodyText">{this.props.newsBody}</p>
		</div>
	);
}

export default C04News;