import React, {Component} from 'react';
import firebase from "../Firebase";
import {Link, Route, Switch, withRouter, Redirect} from 'react-router-dom';

class GroupsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			groups: props.groups
		}
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.groups !== prevProps.groups) {
			let state = this.state;
			state.groups = this.props.groups;
			this.setState(state);
		}
	}

	render() {
		return (
								<div className="container" style={{paddingTop: 30}}>
									<div className="col" /*Centers the next col*/ />
									<div className="col-6-lg">
										<div className="list-group">
											<Group groupName={"New Group"} className={"active"} key={-1} url={`${this.props.match.url}/new`} />
											{this.state.groups && Object.entries(this.state.groups).map((e, i) => {
												return (
														<Group groupName={e[0]} key={i} url={`${this.props.match.url}/${e[0]}`} />
												)
											})}
										</div>
									</div>
								</div>
		);
	}
}

const Group = ({groupName, url, k, className}) => {
	return (
			<Link key={k} className={`list-group-item list-group-item-action ${className ? className : ""}`} to={url}>{groupName}</Link>
	);
};

export default withRouter(GroupsPage);