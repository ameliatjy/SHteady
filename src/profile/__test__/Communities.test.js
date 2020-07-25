import Communities from '../Communities';

import 'firebase/database'
import Contacts from '../Contacts';

// const firebase = require('firebase');
// const firebaseConfig = {
//     apiKey: "AIzaSyB1oyaDAneBvtqpJJqYN_o13jWDExpRDq0",
//     authDomain: "shteady-b81ed.firebaseapp.com",
//     databaseURL: "https://shteady-b81ed.firebaseio.com",
//     projectId: "shteady-b81ed",
//     storageBucket: "gs://shteady-b81ed.appspot.com",
//     messagingSenderId: "749591564782",
//     appId: "1:749591564782:web:73f597ecbcf1edd21dfeff",
//     measurementId: "G-CBS54V1147"
// };
// firebase.initializeApp(firebaseConfig);

test('Announcements page state messages array should be empty', () => {
    expect(new Communities().state).toEqual({
        groups: [],
        groupsById: [],
        activeSections: [],
        members: []
    });
});