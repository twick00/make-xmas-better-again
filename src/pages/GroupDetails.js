import React, {Component} from 'react';
import firebase from "../Firebase";
import _ from 'lodash'
import {Link, withRouter} from "react-router-dom";

class GroupDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newPersonName: "",
			notSelect: "",
			errorMessage: "",
			divisibleByTwoMessage: "",
			successMessage: "",
			results: [],
			group: {}
		}

	}

	componentWillMount() {
		firebase.database().ref(`/groups/${this.props.group.groupId}/names`).on(
				'value',
				(snap) => {
					let state = this.state;
					state.group = snap.val()
					this.setState(state);
					this.handleOddCount()
				})
		firebase.database().ref(`/groups/${this.props.group.groupId}/results`).on('value',
				(snap) => {
					let state = this.state;
					state.results = snap.val()
					this.setState(state);
					this.handleOddCount()
				})
	}

	componentWillUnmount() {
		firebase.database().ref(`/groups/${this.props.group.groupId}/names`).off();
		firebase.database().ref(`/groups/${this.props.group.groupId}/results`).off();
	}

	componentDidUpdate(prevProps) {
		// Typical usage (don't forget to compare props):
		if (this.props.groups !== prevProps.groups) {
			let state = this.state;
			state.groups = this.props.groups;
			this.setState(state);
		}
	}

	handleNameChange = (e) => {
		let state = this.state;
		state.newPersonName = e.target.value.toLowerCase();
		state.errorMessage = "";
		state.successMessage = "";
		this.handleDuplicate(e.target.value.toLowerCase())
		this.setState(state);
	}
	handleNotChange = (e) => {
		let state = this.state;
		state.notSelect = e.target.value.toLowerCase();
		this.setState(state);
	}

	handleNewSave = async () => {
		if (this.handleDuplicate(this.state.newPersonName)) {
			let state = this.state;
			state.notSelect += `, ${this.state.newPersonName}`;
			this.setState(state);
			await firebase.database().ref(
					`/groups/${this.props.group.groupId}/names/${this.state.newPersonName}`).set(
					{
						cannotSelect: this.state.notSelect ? this.state.notSelect.split(",")
						.map((e) => {
							return e.trim()
						}) : "N/A"
					}).then(() => {
				let state = this.state;
				state.successMessage = "Successfully saved new person."
				state.newPersonName = "";
				state.notSelect = "";
				this.setState(state);
			})
			this.handleOddCount()
		}
	}
	handleOddCount = () => {
		let state = this.state;
		if(this.state.group && Object.keys(this.state.group).length % 2 !== 0) {
			state.divisibleByTwoMessage = "Number of people must be divisible by two or someone wont get a partner. 🙁"
		} else {
			state.divisibleByTwoMessage = "";
		}
		this.setState(state);
	}

	handleDuplicate = (val) => {
		if (this.state.group && Object.keys(this.state.group).includes(val)) {
			let state = this.state;
			state.errorMessage = "That person already exists";
			return false
		} else {
			return true;
		}
	}

	render() {
		return (
				<div className="container" style={{paddingTop: 30}}>
					<div className={"jumbotron"}>
						<h1 className="text-center">{this.props.group
						&& this.props.group.groupId}</h1>
					</div>
					<div className="col" /*Centers the next col*/ />
					{this.state.divisibleByTwoMessage &&
					<div className="alert alert-warning" role="alert">
						{this.state.divisibleByTwoMessage}
					</div>
					}
					<div className="col-6-lg">
						<div id="accordion">
							<div className="card">
								<div className="card-header">
									<button className="btn btn-success" data-toggle="collapse"
									        data-target="#newPerson">
										Show Add New
									</button>
								</div>
								<div id="newPerson" className="collapse"
								     data-parent="#accordion">
									<div className={"container pt-3"}>
										{this.state.errorMessage &&
										<div className="alert alert-danger" role="alert">
											{this.state.errorMessage}
										</div>
										}
										{this.state.successMessage &&
										<div className="alert alert-success" role="alert">
											{this.state.successMessage}
										</div>
										}
										<div className="form-group row">
											<label
													className="col-sm-2 col-form-label">Name:</label>
											<div className="col-sm-10">
												<input type="text" className="form-control"
												       placeholder="Enter a name... E.x. 'tyler'"
												       onChange={this.handleNameChange}
												       value={this.state.newPersonName}/>
											</div>
										</div>
										<div className="form-group row">
											<label className="col-sm-2 col-form-label">Can't
												have:</label>
											<div className="col-sm-10">
												<input type="text" className="form-control"
												       placeholder="E.x. 'lacey, april'"
												       onChange={this.handleNotChange}
												       value={this.state.notSelect}/>
											</div>
										</div>
										<div className="form-group row">
											<div className="col-12">
												<small>Note: All text is saved as lowercase.</small>
												<button onClick={this.handleNewSave}
												        className={"btn btn-primary float-right"}
												        disabled={!!this.state.errorMessage}>Save!
												</button>
											</div>
										</div>
									</div>


								</div>
							</div>
							<div className="card">
								<div className="card-header" id="headingOne">
									<button className="btn btn-primary" data-toggle="collapse"
									        data-target="#collapseOne" aria-expanded="true"
									        aria-controls="collapseOne"
									        disabled={!this.state.group}>
										Show Names
									</button>
								</div>
								<div id="collapseOne" className={this.state.results ? "collapse":"collapse show"}
								     data-parent="#accordion">
									<ul className="list-group">
										{this.state.group && Object.entries(this.state.group).map(
												(e, i) => {
													return (
															<li key={_.uniqueId()}
															    className={"list-group-item d-flex justify-content-between align-items-center"}>{e[0]}
																{e[1] && e[1].cannotSelect &&
																<span
																		className="badge badge-pill badge-primary">
																	Can't have: [{e[1].cannotSelect.map((e) => {
																	return ` ${e} `
																}).toString()}]
																</span>
																}
																<button
																		className={"btn btn-sm btn-danger"}
																		onClick={() => this.handleDelete(
																				e[0])}>&#10005;</button>
															</li>)
												})}
									</ul>
								</div>
								{this.state.results &&
								<div className={"card"}>
									<div className="card-header">
										<button className="btn btn-primary" data-toggle="collapse"
										        data-target="#resultsTab"
										        disabled={!this.state.results || !this.state.group}>
											Show Results
										</button>
									</div>
									<div id="resultsTab" className={this.state.results ? "collapse show":"collapse"}
									     data-parent="#accordion">
										<div className="list-group">
											{this.state.results.map((e, i) => {
												return (<Link to={`${this.props.match.url}/${e.name}`} key={i}
												            className={"list-group-item d-flex justify-content-between align-items-center"}>

													{e.name}
												</Link>)
											})}
										</div>
									</div>
								</div>
								}
							</div>
						</div>
						<div className={"container pt-3"}>
							<div className="form-group row">
								<div className="col-12">

										<button onClick={this.runStart}
										        className={this.state.results ? "btn btn-warning" : "btn btn-primary"}
										        disabled={!!this.state.errorMessage
										        || !this.state.group || Object.keys(
												        this.state.group).length % 2 !== 0
										        }>{this.state.results ? "Reset!" : "RUN!"}
										</button>

									<button onClick={this.deleteGroup}
									        className={"btn btn-danger mx-3"}>Delete Group!
									</button>
							</div>
							</div>
						</div>
					</div>
				</div>

		);
	}

	handleDelete = async (person) => {
		await firebase.database().ref(
				`/groups/${this.props.group.groupId}/names/${person}`).remove();
	}

	runStart = async () => {
		if (this.state.group) {
			let list = Object.entries(this.state.group);
			let results
			let count = 0;
			while(!results) {
				count++;
				results = this.shuffleAndFind(list);
				console.log("Looping... "+count)
			}
			console.log("Looping done!")
			let state = this.state
			results = results.map((e) => {
				let out = {
					name: e[0],
					selected: e[2].selected[0],
					cannotSelect: e[1].cannotSelect

				}
				return out;
			})
			state.results = results;
			await this.setState(state);
			this.handleResultsSave();
		}
	};
	checkForUndefined = (list) => {
		return list.filter((el) => {
			if(typeof el[2].selected === "undefined") return true
		}).length > 0
	}
	shuffleAndFind = (list, counter = 0) => {
		counter++;
		list = _.shuffle(list);
		let tempArr = _.concat(list);
		let finishedArr = [];
		list.forEach((el1,) => {
			let selectedIndex = _.findIndex(tempArr, (el2) => {
				if (!el2[1].cannotSelect.includes(el1[0])) {
					return el2;
				}
			});
			el1[2] = {selected: tempArr[selectedIndex]};
			finishedArr.push(el1);
			tempArr.splice(selectedIndex, 1);
		});
		if(this.checkForUndefined(finishedArr)){
			console.log(counter)
			this.shuffleAndFind(list, counter);
		} else {
			return finishedArr;
		}
	}

	handleResultsSave = async () => {
		await firebase.database().ref(
				`/groups/${this.props.group.groupId}/results`).set(this.state.results);
	}

	deleteGroup = () => {
		firebase.database().ref(`/groups/${this.props.group.groupId}`).remove();
		this.props.history.push("/main/groups")
	}
}

export default withRouter(GroupDetails);