import React from 'react';
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
            <>
                <header>
                    <Navbar />
                </header>
                <Switch>
                    <main role="main" className="flex-shrink-0 container">
                        <Route exact path="/" component={Sources}/>
                        <App />
                    </main>
                </Switch>
                <Footer/>
            </>
        </BrowserRouter>
    </Provider>
);

export default Routes;
