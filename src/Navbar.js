//split this file when the time comes :))

import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Badge } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';

import IconAnt from 'react-native-vector-icons/AntDesign';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconSLI from 'react-native-vector-icons/SimpleLineIcons';

import DashboardStackScreen from './dashboard/DashboardStack'
import MealsStackScreen from './meals/MealsStack'
import AnnouncementsStackScreen from './announcements/AnnouncementsStack'
import ReportStackScreen from './report/ReportStack'
import ProfileStackScreen from './profile/ProfileStack'

import firebase from 'firebase/app';

const Tab = createBottomTabNavigator();

export default class Navbar extends Component {

    state = {
        taskCount: 0,
    }

    // numDashboardTasks() {
    //     var count = 0
    //     firebase.database().ref('dashboard/').on('value', function(snapshot) {
    //         count = snapshot.numChildren()
    //     })
    //     return count
    // }

    // componentDidMount() {
    //     setInterval(() => {
    //         this.setState({taskCount: this.numDashboardTasks()})
    //     }, 3000)
    // }

    // componentWillUnmount() {
    //     return firebase.database().ref('/dashboard').off()
    // }

    render() {
        return (
            <Tab.Navigator
                initialRouteName='Dashboard'
                tabBarOptions={{
                    activeTintColor: '#ff7d1d',
                    inactiveTintColor: '#9e9e9e',
                }}
            >
                <Tab.Screen 
                    name="Dashboard" 
                    component={DashboardStackScreen} 
                    options={{ 
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color }) => (
                            <View style={styles.badgeCon}>
                            <IconAnt name={'profile'} size={29} color={color}/>
                            {/* <Badge value={this.state.taskCount} status={'error'} containerStyle={styles.dashboardBadge}/> */}
                            </View>
                        )
                    }}
                />
                <Tab.Screen 
                    name="Meals" 
                    component={MealsStackScreen}
                    options={{ 
                        tabBarLabel: 'Meals',
                        tabBarIcon: ({ color }) => (
                            <IconMCI name={'silverware-variant'} color={color} size={32}/>
                        )
                    }}
                />
                <Tab.Screen 
                    name="Announcements" 
                    component={AnnouncementsStackScreen}
                    options={{ 
                        tabBarLabel: 'Announcements',
                        tabBarIcon: ({ color }) => (
                            <IconAnt name={'notification'} color={color} size={29}/>
                        )
                    }}
                />
                <Tab.Screen 
                    name="Report" 
                    component={ReportStackScreen}
                    options={{ 
                        tabBarLabel: 'Report',
                        tabBarIcon: ({ color }) => (
                            <IconSLI name={'wrench'} color={color} size={26}/>
                        )
                    }}
                />
                <Tab.Screen 
                    name="Profile" 
                    component={ProfileStackScreen}
                    options={{ 
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => (
                            <IconAnt name={'user'} color={color} size={29}/>
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    dashboardBadge : {
        position: 'absolute',
        top: -2,
        right: -6,
    },
    badgeCon : {
        flexDirection: 'row'
    }
})

