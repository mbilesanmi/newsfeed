import axios from 'axios';

import {
    ARTICLES, ERROR_MESSAGE, SUCCESS_MESSAGE
} from './ActionTypes';

// const { REACT_APP_apiUrl } = process.env;

export const passSuccessMessage = successMessage =>
  ({ type: SUCCESS_MESSAGE, successMessage });

export const passErrorMessage = errorMessage =>
  ({ type: ERROR_MESSAGE, errorMessage });

export const getArticlesSuccess = (articles) =>
  ({ type: ARTICLES, payload: { articles } });

const resolveErrors = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else if (error.request) {
    return 'An error occured with your request, please try again later.';
  } else {
    return error;
  }
};

export const getArticles = (sourceId = '', category='', country='') => dispatch => {
  let url = 'https://newsapi.org/v2/top-headlines?apiKey=74b2693e67c3460c81423e7d1d6d1508';

  if (sourceId) {
    url = `${url}&sources=${sourceId}`
  } else {
    if (category) {
      url = `${url}&category=${category}`
    }
    if (country) {
      url = `${url}&country=${country}`
    }
  }
  return axios.get(url)
    .then(response => {
        dispatch(getArticlesSuccess(response.data.articles));
    })
    .catch(error => {
        throw dispatch(passErrorMessage(resolveErrors(error)));
    });
}