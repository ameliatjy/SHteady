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

                    labelStyle: { fontSize: 15, lineHeight:0, width: 100, textTransform:'capitalize', fontWeight:'500'},
                    // tabStyle: { width: 140,},
                        //  borderRadius:100, backgroundColor: 'grey',  },
                    // contentContainerStyle: {width: 50},
                    style: {height: 50, justifyContent:'center', alignContent:'center'},
                    // activeTintColor: 'orange'
                    indicatorStyle: {backgroundColor: '#ffae50'},
                    activeTintColor: '#ffae50',
                    inactiveTintColor: 'grey'
                    
        
            }}
            >
                <Tab.Screen name='New Request' component={SubmitRequest}/>
                <Tab.Screen name='Personal' component={Personal}/>
                <Tab.Screen name='Community' component={Community}/>
            </Tab.Navigator>
        )
    }
}
