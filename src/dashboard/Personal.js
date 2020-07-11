import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, RefreshControl } from 'react-native';
import Icon from'react-native-vector-icons/FontAwesome';

import firebase from 'firebase/app';
import 'firebase/auth';

export default class Personal extends Component {

    state = {
        dabaoDialogVisible: false,
        groceriesDialogVisible: false,
        othersDialogVisible: false,
        datetimePickerVisibility: false,
        dabaoText: '',
        groceriesText: '',
        othersText: '',
        dashboard: {},
        // presentdb???
    }

    

    componentDidMount() {
        setInterval(() => {
            var user = firebase.auth().currentUser;
            var matric = user.displayName

            var currDashboard = []

            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).on('value', snapshot => {
                currDashboard = snapshot.val().dashboard ? snapshot.val().dashboard : [];
            })

            firebase.database().ref('/dashboard').on('value', querySnapShot => {
                let data = querySnapShot.val() ? querySnapShot.val() : {};
                // console.log(data)
                let keys = Object.keys(data)
                var key
                // console.log(currKey)
                for (key of keys) {
                    // console.log(key)
                    if (currDashboard.includes(key)) {
                        // console.log(data[key])
                        let dashboardItems = this.state.dashboard
                        dashboardItems[key] = data[key]
                        this.setState({
                            dashboard: dashboardItems,
                        });
                    }
                }
            });
        }, 5000);
    }

    componentWillUnmount() {
        var user = firebase.auth().currentUser;
        var matric = user.displayName

        firebase.database().ref('/dashboard').off()
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).off()
    }

    checkTaskProgress = (isInProgress) => {
        if (isInProgress) {
            return {color: '#ff7d1d'}
        } else {
            return {color: '#d10a0a'};
        }
    }

    helpTask = (key) => {
        firebase.database().ref('dashboard/' + key).update({
            isInProgress: true
        })
    }

    completeTask = (key) => {
        firebase.database().ref('dashboard/' + key).remove()
    }

    helpWithTaskButton = (key) => {
        const item = this.state.dashboard[key]
        if (item.isInProgress) {
            Alert.alert(
                'Help On The Way!',
                'Thank you for offering your help!\n' +
                'Please confirm that the task has been completed!',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Confirm', onPress: () => this.completeTask(key), style: 'default'},
                ]
                // onpress(confirm) delete the task
            );
        } else {
            Alert.alert(
                // think of possible ways to change this
                item.task,
                item.addionalInfo + '\n' + 'Room Number: ' + item.room,
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Confirm', onPress: () => this.helpTask(key), style: 'default'},
                ]
                // onpress(confirm) change task taskinprogress:true
            );
        }
    }

    render() {

        let dashboardKeys = Object.keys(this.state.dashboard);

        return(
    
            <View style={styles.container}>
            <ScrollView>
                <View style={styles.taskCon}>
                    <Text style={styles.title}>Ongoing Activities</Text>
                    {dashboardKeys.length > 0 ? (
                        <View>
                        {/* <ScrollView> */}
                        {
                            dashboardKeys.map((key) => (
                                <View key = {key}  style = {styles.item}>
                                    <TouchableOpacity style={styles.task} onPress={() => this.helpWithTaskButton(key)}>
                                        <View>
                                            <Image style={styles.profilepic} source={{ uri: this.state.dashboard[key].profilePicUrl }} />
                                        </View>
                                        <View>
                                            <Text style={styles.taskHeader}>{this.state.dashboard[key].name}</Text>
                                            <Text style={styles.taskBody}>{this.state.dashboard[key].task}</Text>
                                        </View>
                                        <View style={styles.taskProgress}>
                                            <Icon name='circle' size={45} style={this.checkTaskProgress(this.state.dashboard[key].isInProgress)}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                        {/* </ScrollView> */}
                        </View>
                    ) : (
                        <View style={styles.empty}>
                            <Text style={{fontSize: 16, color: 'rgba(0,0,0,0.7)'}}>You do not have any ongoing activities at the moment.</Text>
                            {/* <Text style={{fontSize: 18}}>Thank you! :)</Text> */}
                        </View>
                    )}
                </View>
            </ScrollView> 
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignContent: 'center',
    },
    taskCon : {
        flex: 0.5,
        alignContent: 'flex-end',
    }, 
    title : {
        fontSize: 20,
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 10,
        fontWeight: '500',
        color: '#ff7d1d',
    },
    empty : {
        paddingHorizontal: 20,
        alignItems: 'flex-start', 
        // paddingTop: 100
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 15,
        paddingHorizontal: 20,
        margin: 2,
        backgroundColor: '#ffd4b3',
        borderRadius: 20,
        width: 380,
        alignSelf: 'center'
    }, 
    task : {
        flexDirection: 'row',
        width: 340,
    },
    taskHeader : {
        fontWeight: '500',
        fontSize: 18,
        paddingBottom: 5,
    },
    taskBody : {
        fontSize: 16
    },
    taskProgress : {
        position: 'absolute',
        right: 0,
    },
    profilepic: {
        width:40,
        height:40,
        borderRadius:20,
        marginRight:10
    }
});