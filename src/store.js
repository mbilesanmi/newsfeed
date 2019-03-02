import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers/rootReducer';

/* eslint-disable no-underscore-dangle */
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    || compose;

/* eslint-disable */
const finalCreateStore = composeEnhancers(
    applyMiddleware(...middleware)
  )(createStore);

export default finalCreateStore(reducers);
