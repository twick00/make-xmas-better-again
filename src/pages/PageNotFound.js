import React, {Component} from 'react';
import filthy_animal from "../images/filthy_animal.jpg"
import {Link} from "react-router-dom";

class PageNotFound extends Component {
	render() {
		return (
				<div className={"container"}>
					<div className={"jumbotron"}>
						<h1 className={"display-4 text-center"}>404: Page not found, you
							filthy animal</h1>
							<img className={"mx-auto d-block pt-5"} src={filthy_animal}
							     alt={"filthy animal image"}/>
					</div>
					<div>
						<Link to="/main/groups" className="btn btn-success">Back to groups</Link>
					</div>
				</div>
		);
	}
}

export default PageNotFound;