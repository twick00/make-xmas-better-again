import React, {Component} from 'react';
import firebase from "../Firebase";
import {Link, Redirect, withRouter} from "react-router-dom";

class NewGroupPage extends Component {
	constructor(props, match) {
		super(props);
		this.state = {
			groups: null,
			group: {
				groupName: ""
			},
			errorMessage: ""
		}
	}

	componentDidMount() {
		firebase.database().ref("/groups/").on('value', (snap) => {
			this.updateGroups(snap.val());
		})
	}

	updateGroups(val) {
		let state = this.state;
		state.groups = val;
		this.setState(state);
	}

	onInputChange = (e) => {
		let state = this.state;
		state.group.groupName = e.target.value.toLowerCase();
		state.errorMessage = "";
		this.setState(state);
		this.handleDuplicate(e.target.value)
	}

	async handleNewSave() {
		if (this.handleDuplicate(this.state.group.groupName)) {
			await firebase.database().ref(
					'/groups/' + this.state.group.groupName).set({
				"groupName": this.state.group.groupName
			})
			this.props.history.push("/main/groups")
		}
	}

	handleDuplicate(val) {
		if (this.state.groups && Object.keys(this.state.groups).some((e) => {
			return e === val
		})) {
			let state = this.state;
			state.errorMessage = "That group already exists.";
			this.setState(state);
			return false;
		} else {
			return true;
		}
	}
	render() {
		return (
				<div className={"container"}>
					<div className={"jumbotron"}>
						<h1 className="text-center text-capitalize">{this.state.group.groupName
								? this.state.group.groupName : "No name set"}</h1>
					</div>
					{this.state.errorMessage &&
					<div className="alert alert-danger" role="alert">
						{this.state.errorMessage}
					</div>
					}
					<div className="form-group">
						<label>Enter a group name: </label>
						<input onChange={this.onInputChange
						} className="form-control"
						       placeholder="Enter group name..." value={this.state.group.groupName}/>
						<small>lowercase only</small>
					</div>
					<div>
						<button onClick={() => this.handleNewSave()}
						        className={"btn btn-primary"} disabled={!!this.state.errorMessage}>Save
						</button>
						<Link to={"/main/groups"} className={"btn btn-danger mx-3"}>Back</Link>
					</div>
				</div>
		)
	}
}

export default withRouter(NewGroupPage);