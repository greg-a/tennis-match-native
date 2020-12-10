import * as firebase from 'firebase';
import { firebaseApiKey } from '../app/localhost';

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: "tennismatch-294318.firebaseapp.com",
    projectId: "tennismatch-294318",
    storageBucket: "tennismatch-294318.appspot.com",
    messagingSenderId: "1050764562696",
    appId: "1:1050764562696:web:0edab5895b4393d5fb9cbd",
    measurementId: "G-0XZTX9LN5Q"
};


if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
};

export default firebase;


