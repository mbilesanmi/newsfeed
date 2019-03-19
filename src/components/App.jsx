// LIBRARIES
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// CONFIG
import fire from '../config/Fire';

// STYLING
import './App.css';

// COMPONENTS
import Articles from './Articles/Articles';
import Login from './User/Login';
import Sources from './Sources/Sources';
import Dashboard from './Dashboard/Dashboard';
import TopHeadlines from './Articles/TopHeadlines';

class App extends Component {
  state = {
    user: {},
  }

  componentDidMount = () => {
    this.authListener();
  }

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: {} });
        localStorage.removeItem('user');
      }
    });
  }

  render = () => {
    return (
      <>
        {/* Begin page content */}
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sources" component={Sources} />
        <Route exact path="/source/:sourceId" component={Articles} />
        <Route exact path="/top-headlines" component={TopHeadlines} />
        <Route exact path="/all-news" component={TopHeadlines} />
      </>
    )
  }
}

export default App;
