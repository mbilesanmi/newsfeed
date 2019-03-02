// LIBRARIES
import React, { Component } from 'react';
import toastr from 'toastr';

// STYLING
import './Login.css';

// CONFIG
import fire from '../../config/Fire';

class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    componentDidMount = () => {
        if (localStorage.getItem('user')) {
            this.props.history.push('/');
        }
    }

    login = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        fire.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                toastr.success('Login successful');
                setTimeout(window.location.reload(), 6000);
            })
            .catch(error => toastr.error(error.message));
        }
        
        signup = (e) => {
            e.preventDefault();
            const { email, password } = this.state;
            
            fire.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                toastr.success('Account created successfully');
                setTimeout(window.location.reload(), 6000);
            })
            .catch(error => toastr.error(error.message));
    }

    updateLoginForm = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    }

    render = () => {
        return (
            <>
                <div className="position-relative overflow-hidden p-2 p-md-3 m-md-4 text-center bg-light">
                    <div className="col-md-5 mx-auto my-3">
                        <h4 className="display-5 font-weight-normal">Login/Signup</h4>
                    </div>
                </div>

                <form className="form-signin">
                    <label htmlFor="inputEmail" className="sr-only">Email address</label>
                    <input
                        type="email"
                        name="email"
                        onChange={this.updateLoginForm}
                        value={this.state.email}
                        id="inputEmail"
                        className="form-control"
                        placeholder="Email address"
                        required
                        autoFocus />
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input
                        type="password"
                        name="password"
                        onChange={this.updateLoginForm}
                        value={this.state.password}
                        id="inputPassword"
                        className="form-control"
                        placeholder="Password"
                        required />
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        onClick={this.login}
                        type="submit">
                        Login
                    </button>
                    <button
                        className="btn btn-lg btn-primary btn-block"
                        onClick={this.signup}
                        type="submit">
                        Signup
                    </button>
                </form>
            </>
        );
    }
}

export default Login;
