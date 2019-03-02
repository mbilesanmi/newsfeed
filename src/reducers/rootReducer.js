import reduceReducers from 'reduce-reducers';
import { combineReducers } from 'redux';

// REDUCERS
import message from './MessageReducer';
import { articles } from './ArticleReducer';
import { sources } from './SourceReducer';

const combinedReducers = combineReducers({
    articles,
    message,
    sources
});

export default reduceReducers(combinedReducers);
