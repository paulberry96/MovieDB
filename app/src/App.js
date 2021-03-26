import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "./components/Header";

import HomePage from "./pages/HomePage";

import './App.css';

export default class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BrowserRouter>
				<div className="app">

					<Header />

					<div className="contents">
						<Switch>
							<Route exact path="/" component={HomePage} />
						</Switch>
					</div>

				</div>
			</BrowserRouter>
		);
	}
}