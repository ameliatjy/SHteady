import React from 'react';
import renderer from 'react-test-renderer'

import 'firebase/database'
import DonateMeal from '../DonateMeal';

const firebase = require('firebase');
//const admin = require('firebase-admin');
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB1oyaDAneBvtqpJJqYN_o13jWDExpRDq0",
    authDomain: "shteady-b81ed.firebaseapp.com",
    databaseURL: "https://shteady-b81ed.firebaseio.com",
    projectId: "shteady-b81ed",
    storageBucket: "gs://shteady-b81ed.appspot.com",
    messagingSenderId: "749591564782",
    appId: "1:749591564782:web:73f597ecbcf1edd21dfeff",
    measurementId: "G-CBS54V1147"
};
firebase.initializeApp(firebaseConfig);

jest.useFakeTimers();

test('Donate Meals page renders snapshot as expected', () => {
    const tree = renderer.create(<DonateMeal/>).toJSON();
    expect(tree).toMatchSnapshot();
});