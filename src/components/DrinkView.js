import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { db, authRef } from '../config/firebase';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";




class DrinkView extends Component {
    constructor(props, { match }) {

        super(props, { match });
        this.userId = authRef.currentUser.uid;
        this.drinkId = db.collection("users").doc(this.userId).collection('drinks').doc(this.props.match.params.id);
        this.state = {
            drinkName: '',
            drinkType: '',
            drinkOtherType: '',
            drinkComments: '',
            drinkDate: '',
            photoUrl: ''
        }
    }




    componentDidMount() {
        this.drinkId.get().then((doc) => {
            this.setState({
                drinkName: doc.data().drinkName,
                drinkType: doc.data().drinkType,
                drinkOtherType: doc.data().drinkOtherType,
                drinkComments: doc.data().drinkComments,
                drinkDate: doc.data().drinkDate,
                photoUrl: doc.data().photoUrl
            });
        });

    }



    render() {

        return (
            <div className="singleDrink cardContainer">
                <img alt="" className="singleDrink_imgContainer" src={this.state.photoUrl} />

                <div className="singleDrink_infos">
                    <h2>{this.state.drinkName}</h2>
                    {this.state.drinkType !== 'other' 
                    ? <span className="singleDrink_type">{this.state.drinkType}</span>  
                    : <span className="singleDrink_type">{this.state.drinkOtherType}</span>
                    }
                    <span className="singleDrink_date"> - {this.state.drinkDate}</span>
                    <p className="singleDrink_comments">{this.state.drinkComments}</p>
                    <Link className="singleDrink_edit" to={`${this.props.match.url}/edit`}><span className="icon mat-icon material-icons">create</span></Link>
                </div>

            </div>



        )
    }

}




function mapStateToProps({ auth }) {
    return { auth };
}

export default withRouter(connect(mapStateToProps)(DrinkView))