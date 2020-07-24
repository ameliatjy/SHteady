import React, { Component } from 'react';
import { StyleSheet, View, StatusBar} from 'react-native';

import * as firebase from 'firebase';

import OverallNav from './src/OverallNav';

import Navbar from './src/Navbar';
import { NavigationContainer } from '@react-navigation/native';


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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} else {
    firebase.app().delete().then(function() {
        firebase.initializeApp(firebaseConfig);
    });
}

export default class App extends Component {

  render() {
      // console.disableYellowBox = true; // code to supress yellow box warning
    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content'/>
        <OverallNav/>
        {/* uncomment to avoid login page, test dashboard only */}
        {/* <NavigationContainer>
        <Navbar/>
        </NavigationContainer> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    // backgroundColor:'#fffde7',
    flex: 1,
  }
});
