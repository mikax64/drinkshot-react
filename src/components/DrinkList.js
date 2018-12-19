import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db, authRef } from '../config/firebase';
import * as loadImage from 'blueimp-load-image'



class DrinkList extends Component {
    constructor(props, { match }) {
        super(props, { match });
        this.userId = authRef.currentUser.uid;
        this.drinkCollection = db.collection("users").doc(this.userId).collection('drinks');

        this.state = {
            listDrink: []
        }
    }




    componentDidMount() {

        this.drinkCollection.orderBy('timestamp')
            .onSnapshot((querySnapshot) => {
                this.setState({
                    listDrink: []
                });
                let options = {
                    canvas: false,
                    pixelRatio: window.devicePixelRatio,
                    downsamplingRatio: 0.5,
                    orientation: true
                }
                querySnapshot.forEach((doc) => {
                    const file = doc.data().photoUrl;
      
                    loadImage(file, this.updateResults, options);
                    this.setState({
                        listDrink: [...this.state.listDrink, doc.data()]
                    });

                    


                });
            });

    }

    render() {

        const listItems = this.state.listDrink.map((item) =>
             <Link key={item.drinkId} to={`/drink-list/${item.drinkId}`} style={{ backgroundImage: 'url(' + item.photoUrl + ')',order: -1*item.drinkId }}></Link>

        );


        return (
            <div className="cardContainer">
                {this.state.listDrink.length === 0 &&
                    <div className="emptyList">Your list is empty !<br />Add some files or take photos</div>
                }

                <ul className="drinkList">
                    {listItems}
                </ul>

            </div>
        )
    };


}


export default DrinkList;
