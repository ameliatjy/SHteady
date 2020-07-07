// import React from 'react';
// import renderer from 'react-test-renderer'

// import Dashboard from '../Dashboard';

// //import firebase from 'firebase/app';
// import 'firebase/database'

// const firebase = require('firebase');
// //const admin = require('firebase-admin');
// // Initialize Firebase
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

// jest.useFakeTimers();

// test('Renders snapshot as expected', () => {
//     const tree = renderer.create(<Dashboard />).toJSON();
//     expect(tree).toMatchSnapshot();
// });

// import functions from '../History'

const functions = require('../History')

test('actual time', () => {
    expect(functions.convertTime(1593163553579)).toBe('Jun 26, 2020 5:25 PM')
})

test('status container', () => {
    expect(functions.statusCon('COMPLETED')).toStrictEqual({
        height: 30,
        width: 110,
        backgroundColor:'#009b00', 
        borderRadius: 5,
        alignItems: 'center',
        justifyContent:'center'
    })
})