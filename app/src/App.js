import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import './App.css';

import rootStoreInstance, { RootStoreContext } from "./stores/RootStore";

export default class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BrowserRouter>
				<RootStoreContext.Provider value={rootStoreInstance}>
					<div className="app">

						<Header />

						<div className="contents">
							<Switch>
								<Route exact path="/" component={HomePage} />
							</Switch>
						</div>

					</div>
				</RootStoreContext.Provider>
			</BrowserRouter>
		);
	}
}