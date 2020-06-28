import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";

class C02Home extends Component{
	render() {
		return (
			<div>
				<nav className="devNavbar">
					<NavLink to="/logout" className="devNavButton" alt="Log out">LOG OUT</NavLink>
				</nav>
				{/* welcome message */}
				<h1 id="welcome" className="white text-center"></h1>
				{/* app icons */}
				<div className="cards cardHolder">
					{/* Weather */}
					<div className="card homepage-icon">
						<h5 className="card-header homepage-icon-header">
							Weather
						</h5>
						<div className="card-body black">
							<div className="text-center">
								<img id="weather-icon"/>
								<span><span id="weather-temp"></span>&deg;C</span>
							</div>	
							<p id="weather-city" className="text-center"></p>
						</div>
					</div>
					{/* News */}
					<div className="card homepage-icon pointer">
						<h5 className="card-header homepage-icon-header icon-link">
							News
						</h5>
						<div className="card-body black" style={{padding: "0.8em", margin: "0 auto"}}>
							<h6 className="text-center">Latest from NY Times</h6>
							<p id="homeNewsHeadline" className="homepage-body-text"></p>
						</div>
						<Link to="/news" className="stretched-link"></Link>
					</div>
					{/* Sport */}
					<div className="card homepage-icon pointer">
						<h5 className="card-header homepage-icon-header icon-link">
							Sport
						</h5>
						<div className="card-body black" style={{padding: "0.8em", margin: "0 auto"}}>
							<h6 id="homeSportHeader" className="text-center">Follow a Serie A team</h6>
							<p id="homeSportText" className="homepage-body-text"></p>
						</div>
						<Link to="/sport" className="stretched-link"></Link>
					</div>
					{/* Photos */}
					<div className="card homepage-icon pointer">
						<h5 className="card-header homepage-icon-header icon-link">
							Photos
						</h5>
						<div className="card-body black" style={{padding: "3px"}}>
							<div className="cards home-photo-cardHolder">
								<div id="homePhoto1" className="card home-photo-icon"></div>
								<div id="homePhoto2" className="card home-photo-icon"></div>
								<div id="homePhoto3" className="card home-photo-icon"></div>
								<div id="homePhoto4" className="card home-photo-icon"></div>
							</div>
						</div>
						<Link to="/photos" className="stretched-link"></Link>
					</div>
					{/* Tasks */}
					<div className="card homepage-icon pointer">
						<h5 className="card-header homepage-icon-header icon-link">
							Tasks
						</h5>
						<div className="card-body black">
							<div id="homepageTasks" className="homepage-body-text"></div>
						</div>
						<Link to="/tasks" className="stretched-link"></Link>
					</div>
					{/* Clothes */}
					<div className="card homepage-icon">
						<h5 className="card-header homepage-icon-header">
							Clothes
						</h5>
						<div className="card-body" style={{padding: "0"}}>
							<div id="clothesPiechart" className="centre-img" style={{margin: "0 auto"}}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default C02Home;