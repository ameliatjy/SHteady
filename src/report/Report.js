import React, { Component } from 'react';
import { Animated, TouchableOpacity, View } from "react-native"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import SubmitReport from './SubmitReport'
import History from './History'
import MasterHistory from './MasterHistory'
import ReceivedHistory from './ReceivedHistory';
import InProgressHistory from './InProgressHistory'

import firebase from 'firebase/app';
import 'firebase/auth';


const Tab = createMaterialTopTabNavigator()

export default class Report extends Component {

    checkAccess = () => {
        var curruser = firebase.auth().currentUser
        var matric = curruser.displayName
        var curraccess = []
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).on('value', function(snapshot) {
            curraccess = snapshot.val().cca ? snapshot.val().cca : [];
        })
        return curraccess.includes('ccajcrc')
    }

    render() {
        return (
            <Tab.Navigator
                tabBarOptions={{
                    labelStyle: { fontSize: 15, lineHeight:0, width: 100, textTransform:'capitalize', fontWeight:'500'},
                    style: {height: 50, justifyContent:'center', alignContent:'center', backgroundColor:'#fff'},
                    indicatorStyle: {backgroundColor: '#ff7d1d'},
                    activeTintColor: '#ff7d1d',
                    inactiveTintColor: '#9e9e9e'
            }}
            >
                <Tab.Screen name='New Report' component={SubmitReport}/>
                {
                    this.checkAccess() ? 
                    <Tab.Screen name='Received' component={ReceivedHistory}/>
                    :
                    <Tab.Screen name='Past Reports' component={History}/>
                }
                {
                    this.checkAccess() ? 
                    <Tab.Screen name='In Progress' component={InProgressHistory}/> 
                    :
                    null
                }
            </Tab.Navigator>
        )
    }
}