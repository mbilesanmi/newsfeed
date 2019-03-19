import axios from 'axios';

import {
    ERROR_MESSAGE, SOURCES, SUCCESS_MESSAGE
} from './ActionTypes';

const { REACT_APP_news_apiKey } = process.env;

export const passSuccessMessage = successMessage =>
  ({ type: SUCCESS_MESSAGE, successMessage });

export const passErrorMessage = errorMessage =>
  ({ type: ERROR_MESSAGE, errorMessage });

export const getSourcesSuccess = (sources) =>
  ({ type: SOURCES, payload: { sources } });

const resolveErrors = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else if (error.request) {
    return 'An error occured with your request, please try again later.';
  } else {
    return error;
  }
};

export const getSources = (country='', language='', category='') => dispatch => {
    let url = `https://newsapi.org/v2/sources?apiKey=${REACT_APP_news_apiKey}`
    if (country) {
      url = `${url}&country=${country}`
    }
    if (language) {
      url = `${url}&language=${language}`
    }
    if (category) {
      url = `${url}&category=${category}`
    }

    return axios.get(url)
        .then(response => {
          dispatch(getSourcesSuccess(response.data.sources));
        })
        .catch(error => {
            throw dispatch(passErrorMessage(resolveErrors(error)));
        });
}