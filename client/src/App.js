import React, {Component} from "react";
import {BrowserRouter, Route} from "react-router-dom";
import C01Frontpage from "./Pages/01-frontpage";
import C02Home      from "./Pages/02-home";
import C04News      from "./Pages/04-news";
import C05Sport     from "./Pages/05-sport";
import C06Photos    from "./Pages/06-photos";
import C07Tasks     from "./Pages/07-tasks";

class App extends Component{
	render() {
		return (
			<BrowserRouter>
				<div className="App">
					<Route exact path="/" component={C01Frontpage}/>
					<Route path="/home"   component={C02Home}/>
					<Route path="/news"   component={C04News}/>
					<Route path="/sport"  component={C05Sport}/>
					<Route path="/photos" component={C06Photos}/>
					<Route path="/tasks"  component={C07Tasks}/>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
