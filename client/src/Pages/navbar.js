import React from "react";
import {NavLink} from "react-router-dom";

function Navbar() {
	return (
		<nav className="devNavbar">
			<NavLink to="/home" className="devNavButton" alt="Homepage">HOMEPAGE</NavLink>
			<NavLink to="/logout" className="devNavButton" alt="Log out">LOG OUT</NavLink>
		</nav>
	);
}

export default Navbar;