import React, {Component} from 'react';
import firebase from "../Firebase";

class UserDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}
	componentWillMount() {
		firebase.database().ref(`/groups/${this.props.match.params.groupId}/results`).orderByChild("name").equalTo(this.props.match.params.userId).on(
				'value',
				(snap) => {
					let state = this.state;
					state.user = snap.val()
					state.user = Object.values(state.user)[0]
					state.user.name = state.user.name.charAt(0).toUpperCase() + state.user.name.slice(1);
					state.user.selected = state.user.selected.charAt(0).toUpperCase() + state.user.selected.slice(1);
					this.setState(state);
				});
		console.log("Hello");
	}

	render() {
		return (
				<div className={"container"}>
				<div className={"jumbotron"}>
					{this.state.user.name &&
						<>
							<h1 className="display-3">{`${this.state.user.name}, congratulations.`}</h1>
							<h1 className="display-4">{`You have selected ${this.state.user.selected}`}</h1>
						</>
					}
				</div>
				</div>
		);
	}
}

export default UserDetails;