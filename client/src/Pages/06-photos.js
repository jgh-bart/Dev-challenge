import React, {Component} from "react";
import Navbar from "./navbar";

class C06Photos extends Component{
	render() {
		return (
			<div>
				<Navbar/>
				<h1 className="white text-center">Photos</h1>
				<form id="uploadForm" action="/uploadPhoto" method="post" enctype="multipart/form-data" onchange="upload();">
					<input id="uploadInput" type="file" name="filetoupload" accept="image/*" style={{opacity: 0}}/>
					<div className="cards cardHolder">
						<div id="photo1" className="card photo-icon"></div>
						<div id="photo2" className="card photo-icon"></div>
						<div id="photo3" className="card photo-icon"></div>
						<div id="photo4" className="card photo-icon"></div>
						<div id="photo5" className="card photo-icon"></div>
						<div id="photo6" className="card photo-icon"></div>
					</div>
				</form>
			</div>
		);
	}
}

export default C06Photos;