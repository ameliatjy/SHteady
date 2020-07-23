import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import firebase from 'firebase/app';
import 'firebase/auth';

import Personal from './Personal';
import Community from './Community';
import SubmitRequest from './SubmitRequest';

const Tab = createMaterialTopTabNavigator()

export default class Dashboard extends Component {
    render() {
        return (
            <Tab.Navigator
                tabBarOptions={{
                    labelStyle: { fontSize: 15, lineHeight:0, width: 100, textTransform:'capitalize', fontWeight:'500', color: '#9e9e9e'},
                    style: { height: 50, justifyContent:'center', alignContent:'center', backgroundColor:'transparent' },
                    indicatorStyle: {backgroundColor: '#ff7d1d'},
                    activeTintColor: '#ff7d1d',
                    inactiveTintColor: '#9e9e9e',
            }}
            >
                <Tab.Screen name='New Request' component={SubmitRequest}/>
                <Tab.Screen name='Personal' component={Personal}/>
                <Tab.Screen name='Community' component={Community}/>
            </Tab.Navigator>
        )
    }
}
