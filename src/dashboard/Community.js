import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import Icon from'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import firebase from 'firebase/app';
import 'firebase/auth';

export default class Community extends Component {
    state = {
        dashboard: {},
    }

    componentDidMount() {
        firebase.database().ref('/dashboard').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let dashboardItems = {...data};
            this.setState({
            dashboard: dashboardItems,
            });
        });
    }

    componentWillUnmount() {
        return firebase.database().ref('/dashboard').off()
    }

    checkTaskProgress = (isInProgress) => {
        if (isInProgress) {
            return {color: '#ff7d1d'}
        } else {
            return {color: '#d10a0a'};
        }
    }

    helpTask = (key) => {

        var user = firebase.auth().currentUser;
        var matric = user.displayName

        var helper
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).once('value', snapshot => {
            helper = snapshot.val().name
        })

        var currRef = firebase.database().ref('dashboard/' + key)

        currRef.update({
            isInProgress: true,
            helper: helper
        })

        var taskData, helpedMatric
        currRef.once('value', snapshot => {
            taskData = snapshot.val(),
            helpedMatric = snapshot.val().matric
        })

        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric + '/dashboard').child(key).set(taskData)
        
        console.warn(helpedMatric)
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ helpedMatric + '/dashboard').child(key).set(taskData)

        currRef.remove()
    }

    helpWithTaskButton = (key) => {
        const item = this.state.dashboard[key]
        var additionalInfo = item.additionalInfo == undefined ? '' : (item.additionalInfo + '\n')
        Alert.alert(
            // think of possible ways to change this
            item.task,
            additionalInfo + 
            'Room Number: ' + item.room,
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Confirm', onPress: () => this.helpTask(key), style: 'default'},
            ]
            // onpress(confirm) change task taskinprogress:true
        );
    }

    showMore = (key) => {
        const item = this.state.dashboard[key]
        var additionalInfo = item.additionalInfo == undefined ? '' : (item.additionalInfo + '\n')
        Alert.alert(
            'Still Looking For Help',
            item.task + '\n' +
            additionalInfo 
            // 'Room Number: ' + item.room + '\n' + // dont need this right?
        );
    }

    deleteTask = (key) => {
        if (this.state.dashboard[key].isInProgress == true) {
            null
        } else {
            Alert.alert(
                'Alert',
                'Would you like to delete this task?',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Confirm', onPress: () => this.confirmDeleteTask(key), style: 'default'},
                ]
                // onpress(confirm) delete the task
            );
        }
        
    }

    confirmDeleteTask = (key) => {
        var user = firebase.auth().currentUser;
        var matric = user.displayName

        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric + '/dashboard/' + key).remove()

        firebase.database().ref('dashboard/' + key).remove()
    }

    checkTaskOwner = (key) => {
        var user = firebase.auth().currentUser;
        var matric = user.displayName

        if (this.state.dashboard[key].matric == matric) {
            return this.ownTask(key)
        } else {
            return this.otherTask(key)
        }
    }

    ownTask = (key) => {
        return (
            <View key = {key}  style = {styles.item}>
                <TouchableOpacity 
                    style={styles.task} 
                    onPress={() => this.showMore(key)}
                    onLongPress={() => this.deleteTask(key)}>
                    <View>
                        <Image style={styles.profilepic} source={{ uri: this.state.dashboard[key].profilePicUrl }} />
                    </View>
                    <View>
                        <Text style={styles.taskHeader}>Me</Text>
                        <Text style={styles.taskBody}>{this.state.dashboard[key].task}</Text>
                    </View>
                    <View style={styles.taskProgress}>
                        <Icon name='circle' size={45} style={this.checkTaskProgress(this.state.dashboard[key].isInProgress)}/>
                    </View>
                </TouchableOpacity>
            </View>  
        )
    }

    otherTask = (key) => {
        return (
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
        )
    }

    render() {

        let dashboardKeys = Object.keys(this.state.dashboard);

        return(
            <View style={styles.container}>
            <ScrollView>

                <View style={styles.taskCon}>
                    <Text style={styles.title}>Current Help Needed</Text>
                    {dashboardKeys.length > 0 ? (
                        <View>{dashboardKeys.map((key) => this.checkTaskOwner(key))}</View>
                    ) : (
                        <View style={styles.empty}>
                            <Text style={{fontSize: 16, color: 'rgba(0,0,0,0.7)'}}>No one needs your help for now.</Text>
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
    iconCon : {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent:'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomColor: '#ff7d1d',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    individualIcon : {
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconPic : {
        width: 105, 
        height: 105,
    },
    iconText : {
        fontSize: 14,
        color: '#616161',
        paddingTop: 10,
        fontWeight: '500',
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