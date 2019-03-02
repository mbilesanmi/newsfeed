import {
    ARTICLES
} from '../actions/ActionTypes';

const initialState = {
    articles: []
};

export const articles = (state = initialState.articles, action) => {
    switch (action.type) {
        case ARTICLES:
            return action.payload.articles;

        default:
            return state;
    }
};
