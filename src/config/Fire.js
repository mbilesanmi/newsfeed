import firebase from 'firebase';

const {
    REACT_APP_apiKey,
    REACT_APP_authDomain,
    REACT_APP_databaseURL,
    REACT_APP_projectId,
    REACT_APP_storageBucket,
    REACT_APP_messagingSenderId
} = process.env;

const config = {
    apiKey: REACT_APP_apiKey,
    authDomain: REACT_APP_authDomain,
    databaseURL: REACT_APP_databaseURL,
    projectId: REACT_APP_projectId,
    storageBucket: REACT_APP_storageBucket,
    messagingSenderId: REACT_APP_messagingSenderId
};

const fire  = firebase.initializeApp(config);
export const db = firebase.firestore(fire);
export default fire;
