import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditProfile from './EditProfile';
import Status from './Status';
import Communities from './Communities';
import Contacts from './Contacts';


const ProfileSubpagesStack = createStackNavigator();

export default function ProfileSubpagesScreen() {
    return (
        <ProfileSubpagesStack.Navigator> 
            <ProfileSubpagesStack.Screen 
                name='EditProfile' 
                component={EditProfile}
                options={{
                    headerStyle: {
                        backgroundColor: '#ff7d1d',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    gestureEnabled: false
                }}
            />
            <ProfileSubpagesStack.Screen 
                name='Status' 
                component={Status}
                options={{
                    headerStyle: {
                        backgroundColor: '#ff7d1d',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <ProfileSubpagesStack.Screen 
                name='Communities' 
                component={Communities}
                options={{
                    headerStyle: {
                        backgroundColor: '#ff7d1d',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <ProfileSubpagesStack.Screen 
                name='Important Contacts' 
                component={Contacts}
                options={{
                    headerStyle: {
                        backgroundColor: '#ff7d1d',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </ProfileSubpagesStack.Navigator>
    );
}

