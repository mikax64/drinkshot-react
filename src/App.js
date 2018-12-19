import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
// import firebase from "./firestore";
import Auth from './components/Auth';
import requireAuth from "./components/requireAuth";
import DrinkList from './components/DrinkList';
import DrinkView from './components/DrinkView';
import AddDrink from './components/AddDrink';
import EditDrink from './components/EditDrink';
import { connect } from "react-redux";
import { fetchUser } from "./actions";
import Navbar from './components/Navbar';
import Header from './components/Header';




class App extends Component {


  componentWillMount() {
    this.props.fetchUser();

  }




  render() {
    const { auth } = this.props;


    return (
      <div className="App">
        <Router>

          <div>
            {auth && <Header /> }
            {auth && <Navbar /> }
           
            <Switch>

              <Redirect exact from="/" to="/auth" />
              <Route exact path="/auth" component={Auth} />
              <Route exact path="/drink-list" component={requireAuth(DrinkList)} />
              <Route path="/add-drink" component={requireAuth(AddDrink)} />
              <Route exact path={`/drink-list/:id`} component={requireAuth(DrinkView)} />
              <Route exact path={`/drink-list/:id/edit`} component={requireAuth(EditDrink)} />


            </Switch>

          </div>
        </Router>

      </div>
    );
  }
}

function mapStateToProps({ auth, uploadFile }) {
  return { auth, uploadFile  };
}

export default connect(mapStateToProps, { fetchUser })(App);




