import {
    SOURCES
} from '../actions/ActionTypes';

const initialState = {
    sources: []
};

export const sources = (state = initialState.sources, action) => {
    switch (action.type) {
        case SOURCES:
            return action.payload.sources;

        default:
            return state;
    }
};
