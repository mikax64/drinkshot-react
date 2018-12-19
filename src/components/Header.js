import React, { Component } from 'react';
import { signOut } from "../actions";
import { connect } from "react-redux";
import { withRouter } from 'react-router';

class Header extends Component {
    constructor(props){
        super(props);
        this.goBack = this.goBack.bind(this); // i think you are missing this
     }
     
     goBack(){
         this.props.history.goBack();
     }

    render() {
        return (
            <header className="header">

{this.props.location.pathname !=='/drink-list' && 
<span onClick={this.goBack} className="md-36 iconBack mat-icon material-icons">arrow_back_ios</span>
        }

     
                <span className="md-36 iconDisconnect mat-icon material-icons" onClick={this.props.signOut}>power_settings_new</span>
            </header>
        );
    }

}

function mapStateToProps({ auth }) {
    return { auth };
}

export default withRouter(connect(mapStateToProps, { signOut })(Header));




