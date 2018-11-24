import React, { Component } from 'react'
import { Link } from "react-router-dom"
 
class MainPage extends Component {
  render() {
    return (
       <div className="container" >
            <div className="jumbotron">
                <h1 className="text-center">Merry F*%$ing Christmas!</h1>
                    <br />
                <p>I created this tool to assist people in setting up 'Secret Santa' drawings. Anyone can do the following:
                    <br />
                    <br />
                    <ol>
                        <li>Create a group/family.</li>
                        <li>Add members to the group/family.</li>
                        <li>Declare people who shouldn't be selected by eachother. E.x. significant other, spouse, person you hate.</li>
                        <li>After you are done adding members (or not, as detailed soon) you can run the application to pair people up</li>
                    </ol>
                </p>
            </div>
            <div>
                <Link to="/main/groups" className="btn btn-success">Start!</Link>
            </div>
       </div>
    )
  }
}
export default MainPage;