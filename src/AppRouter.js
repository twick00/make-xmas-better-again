import React, {Component} from 'react';
import {BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import './App.css';
import MainPage from './pages/MainPage';
import firebase from "./Firebase"
import GroupsPage from "./pages/GroupsPage";
import PageNotFound from "./pages/PageNotFound";
import NewGroupPage from "./pages/NewGroupPage";
import GroupDetails from "./pages/GroupDetails";
import UserDetails from "./pages/UserDetails";

class AppRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: {}
		}
	}

	componentDidMount() {
		firebase.database().ref("/groups/").on('value', (snap) => {
			let state = this.state;
			state.groups = snap.val()
			this.setState(state);
		})
	}

	render() {
		return (
				<BrowserRouter>
					<Switch>
						<Route path="/" exact render={() => {
							return (<Redirect to={"/main"}/>)
						}}/>
						<Route path="/main" exact component={MainPage}/>
						<Route path="/main/groups/new" exact render={() => <NewGroupPage
								groups={this.state.groups}/>}/>
						<Route path="/main/groups/:groupId" exact render={(router) => {
							return (<GroupDetails group={router.match.params} />)
						}}/>
						<Route path="/main/groups/:groupId/:userId" exact component={UserDetails}/>
						<Route path="/main/groups/" exact render={() => {
							return (<GroupsPage groups={this.state.groups} />)
						}}/>
						<Route path="/main/404" component={PageNotFound}/>
						<Route path="/*" render={() => {
							return (<Redirect to={"/main/404"}/>)
						}}/>
					</Switch>
				</BrowserRouter>
		)
	}
}

export default AppRouter;
