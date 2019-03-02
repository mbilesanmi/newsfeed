import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC5xF7un-w_AHDzvztnN0iRUqhUAfDww_o",
    authDomain: "newsfeed-57656.firebaseapp.com",
    databaseURL: "https://newsfeed-57656.firebaseio.com",
    projectId: "newsfeed-57656",
    storageBucket: "newsfeed-57656.appspot.com",
    messagingSenderId: "953434587613"
};

const fire  = firebase.initializeApp(config);
export default fire;
