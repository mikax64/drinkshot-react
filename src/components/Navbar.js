
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

//import PropTypes from "prop-types";

class Navbar extends Component {

    onFileSelectedNavbar = event => {
        this.props.dispatch({ type: 'FILE', payload: event.target.files[0] });      
        this.props.history.push("/add-drink");

    }


    render() {
        return (
            <div>
                <ul className="navbar">
                    <li><Link to={`/drink-list`}><span className="icon mat-icon material-icons">grid_on</span> </Link></li>


                    <li>
                        <div className="addDrink_byPhoto">
                            <label htmlFor="cameraInputNav">
                                <span className="icon mat-icon material-icons">add_a_photo</span>
                            </label>
                            <input type="file" capture="camera" accept="image/*" id="cameraInputNav" name="cameraInputNav" onChange={(event) => {
                                this.onFileSelectedNavbar(event)
                                event.target.value = null
                            }} />
                        </div>
                    </li>


                    <li>
                        <div className="addDrink_byFile">
                            <label htmlFor="fileInputNav">
                                <span className="icon mat-icon material-icons">image_search</span>
                            </label>
                            <input type="file" accept="image/*" id="fileInputNav" name="fileInputNav" onChange={(event) => {
                                this.onFileSelectedNavbar(event)
                                event.target.value = null  }} />
                        </div>
                    </li>
                </ul></div>
        );
    }
}

function mapStateToProps({ uploadFile }) {
    return {
        uploadFile
    };
}


export default withRouter(connect(mapStateToProps)(Navbar))



