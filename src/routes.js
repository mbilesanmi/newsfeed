import React, { Fragment } from 'react';
import {
  BrowserRouter, Switch, Route
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './components/App';

import Sources from './components/Sources/Sources';
import Footer from './components/common/Footer/Footer'
import Navbar from './components/common/Navbar/Navbar';
import store from './store';

const Routes = () => (
    <Provider store={store}>
        <BrowserRouter>
            <Fragment>
                <header>
                    <Navbar />
                </header>
                <Switch>
                    <Route exact path="/" component={Sources}/>
                    <App />
                </Switch>
                <Footer/>
            </Fragment>
        </BrowserRouter>
    </Provider>
);

export default Routes;
