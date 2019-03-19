import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import toastr from 'toastr';

import fire from '../../../config/Fire';

class Navbar extends Component {
    state = {
        isAuth: localStorage.getItem('user')
    }

    componentDidMount = () => {
        this.setState({ isAuth: localStorage.getItem('user') });
    }
    
    logout = () => {
        fire.auth().signOut()
            .then(() => {
                localStorage.removeItem('user');
                this.setState({ isAuth: localStorage.getItem('user') });
                window.location.replace('/login');
            })
            .catch((error) => toastr.error(error.message));
    }

    render() {
        const { isAuth } = this.state;

        return (
            <nav className="site-header sticky-top py-1 bg-dark">
                <div className="container d-flex flex-column flex-md-row justify-content-between">
                    <Link className="py-2" to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="d-block mx-auto" role="img" viewBox="0 0 24 24" focusable="false">
                            <title>Product</title>
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"/>
                        </svg>
                        Newsglob
                    </Link>
                    <Link className="py-2 d-none d-md-inline-block" to="/sources">Sources</Link>
                    <Link className="py-2 d-none d-md-inline-block" to="/top-headlines">Top headlines</Link>
                    {
                        isAuth ?
                        <>
                            <Link className="py-2 d-none d-md-inline-block" to="/dashboard">Dashboard</Link>
                            <button className="py-2 d-none d-md-inline-block btn-link" onClick={this.logout}>
                                Logout
                            </button>
                        </>
                        : <Link className="py-2 d-none d-md-inline-block" to="/login">Login</Link>
                    }
                </div>
            </nav>
        );
    }
}

export default Navbar;
