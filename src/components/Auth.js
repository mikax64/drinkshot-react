import React, { Component } from 'react';
import { connect } from "react-redux";
import { signInEmail, signInGoogle, signUp } from "../actions";
import PropTypes from "prop-types";
import SimpleReactValidator from 'simple-react-validator';

import Button from 'muicss/lib/react/button';
import Input from 'muicss/lib/react/input';
import Panel from 'muicss/lib/react/panel';
import logo from '../assets/drinkshot-logo.png'


class Auth extends Component {
  constructor() {
    super();
    this.validatorLogin = new SimpleReactValidator();
    this.validatorRegister = new SimpleReactValidator();
    this.state = {
      isLogin: true,
      allValidLogin: false,
      email: '',
      password: '',
      registerEmail: '',
      registerPassword: ''
    }
  }



  static contextTypes = {
    router: PropTypes.object
  };

  componentWillUpdate(nextProps) {
    if (nextProps.auth) {
      this.context.router.history.push("/drink-list");
    }
  }


  toggleAuth = () => {
    this.setState(prevState => ({
      isLogin: !prevState.isLogin
    }))
  }
  setEmail = event => {
    this.setState({
      email: event.target.value
    });
  }

  setPassword = event => {
    this.setState({
      password: event.target.value
    });
  }
  setRegisterEmail = event => {
    this.setState({
      registerEmail: event.target.value
    });
  }

  setRegisterPassword = event => {
    this.setState({
      registerPassword: event.target.value
    });
  }

  submitLogin = event => {
    event.preventDefault();
    if (this.validatorLogin.allValid()) {
      const email = this.state.email;
      const password = this.state.password;
      this.props.signInEmail(email, password);
       
    } else {
      this.validatorLogin.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }
  }

  submitRegister = event => {
    event.preventDefault();

    if (this.validatorRegister.allValid()) {
      const email = this.state.registerEmail;
      const password = this.state.registerPassword;
      this.props.signUp(email, password);
    } else {
      this.validatorRegister.showMessages();
      // rerender to show messages for the first time
      this.forceUpdate();
    }
  }

  render() {

    return (
      <div className={"loginPage " + (this.state.isLogin ? 'is-login' : '')}>


        <img className="logo" alt="logo drinkshot" src={logo} />

        <Panel className="loginCard">
          <h3>Login page</h3>
          <form >
            <div className="form-group">
              <Input type="text"
                id="emailLogin"
                className="form-control"
                placeholder="Email address"
                value={this.state.email} onChange={this.setEmail}
              />


            </div>
            <div className="error-message"> {this.validatorLogin.message('email', this.state.email, 'required|email')}</div>
            <div className="form-group">


              <Input type="text"
                id="passwordLogin"
                className="form-control"
                placeholder="Password"
                value={this.state.password} onChange={this.setPassword} />

            </div>
            <div className="error-message"> {this.validatorLogin.message('password', this.state.password, 'required|min:6|max:20')}</div>

            <Button color="primary"
              type="submit"
              onClick={this.submitLogin}
            >Login</Button>
          </form>


          <a className="loginGoogle_bt" onClick={this.props.signInGoogle}></a>

        </Panel>

        <div className="createAccount"  >
          <p className="createAccount_text">Not yet registered ?</p>
          <Button color="primary" className="createAccount_bt" onClick={this.toggleAuth}> Create an account</Button >
        </div>


        <div className="registerCard">
          <Panel>
            <h3>Account creation</h3>
            <form>
              <div className="form-group">

                <Input type="text"
                  id="email"
                  className="form-control"
                  placeholder="Email address"
                  value={this.state.registerEmail} onChange={this.setRegisterEmail} />

                <div className="error-message"> {this.validatorRegister.message('email', this.state.registerEmail, 'required|min:5|max:120')}</div>

              </div>
              <div className="form-group">

                <Input type="password"
                  id="password"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.registerPassword} onChange={this.setRegisterPassword} />
                <div className="error-message"> {this.validatorRegister.message('email', this.state.registerPassword, 'required|min:5|max:120')}</div>
              </div>


              <Button color="primary"
                type="submit"
                onClick={this.submitRegister}
              >Create my account</Button>
            </form>

          </Panel>
          <p className="backToLogin" onClick={this.toggleAuth}> <span className="md-36 darkPrimaryColor mat-icon material-icons">keyboard_arrow_left</span> <span>Back to login</span> </p >

        </div >
      </div >


    );
  }

}


function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, { signUp, signInEmail, signInGoogle })(Auth);