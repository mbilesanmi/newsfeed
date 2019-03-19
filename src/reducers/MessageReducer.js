import {
    SUCCESS_MESSAGE, ERROR_MESSAGE
} from '../actions/ActionTypes';

const initialState = {
    message: ''
};

export default (state = initialState.message, action) => {
    switch (action.type) {
        case SUCCESS_MESSAGE:
            return action.successMessage;

        case ERROR_MESSAGE:
            return action.errorMessage;

        default:
            return state;
    }
};
