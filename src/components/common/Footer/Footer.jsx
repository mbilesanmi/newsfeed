// LIBRARIES
import React, { Component } from 'react';

// STYLING
import './Footer.scss';

// COMPONENTS

class Footer extends Component {
    render() {
        return (
            <footer className="footer fixed-bottom mt-auto py-3">
                <div className="container">
                    <span className="text-muted">Place sticky footer content here.</span>
                </div>
            </footer>
        );
    }
}

export default Footer;
