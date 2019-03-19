import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBvkJKjP8pEUvn2KQ7tAn4AA3uktpxCZwc",
    authDomain: "newsglob-845bc.firebaseapp.com",
    databaseURL: "https://newsglob-845bc.firebaseio.com",
    projectId: "newsglob-845bc",
    storageBucket: "newsglob-845bc.appspot.com",
    messagingSenderId: "269838949157"
};

const fire  = firebase.initializeApp(config);
export const db = firebase.firestore(fire);
export default fire;
