import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';

import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMat from 'react-native-vector-icons/MaterialIcons'

import firebase from 'firebase/app';
import { ScrollView } from 'react-native-gesture-handler';

export default class MasterHistory extends Component {

    state = {
        history: {}
    }

    convertTime = (timestamp) => {
        return moment(new Date(timestamp)).format('lll');
    }

    brief = (text) => {
        var lines = text.split(/\r\n|\r|\n/).length
        if (lines > 1) {
            var firstline = text.split('\n')[0]
            return firstline.substring(0,40)+'...'
        } else {
            return text.length > 45 ? text.substring(0,42)+'...' : text
        }
    }

    statusCon = (status) => {
        if (status == 'RECEIVED') {
            return styles.statusReceived
        } else if (status == 'IN PROGRESS') {
            return styles.statusInProgress
        } else {
            return styles.statusCompleted
        }
    }

    handleUndo = (key) => {
        var status = this.state.history[key].status
        if (status == 'IN PROGRESS') {
            Alert.alert(
                'Status: In Progress',
                'Do you wish to undo the status of this report?\n',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'Confirm', onPress: () => this.confirmUndo(key), style: 'default'},
                ]
            )
        }
    }

    confirmUndo = (key) => {
        firebase.database().ref('report/' + key).child('status').set('RECEIVED')
        firebase.database().ref('report/' + key).child('lastUpdatedTime').set(firebase.database.ServerValue.TIMESTAMP)
    }

    handleReport = (key) => {
        var status = this.state.history[key].status
        if (status == 'RECEIVED') {
            return this.handleReceived(key)
        } else if (status == 'IN PROGRESS') {
            return this.handleInProgress(key)
        } else {
            return this.handleCompleted()
        }
    }

    handleReceived = (key) => {
        Alert.alert(
            'Status: Received',
            'Please confirm that relevant personel has been contacted to solve the issue. If needed, please check website for full details.\n',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Confirm', onPress: () => this.handleConfirm(key), style: 'default'},
            ]
        )
    }

    handleInProgress = (key) => {
        Alert.alert(
            'Status: In Progress',
            'Please confirm that the issue has been solved. If needed, please check website for full details.\n',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Confirm', onPress: () => this.handleConfirm(key), style: 'default'},
            ]
        )
    }

    handleCompleted = () => {
        Alert.alert(
            'Status: Completed',
            'This fault report has been resolved.'
        )
    }

    handleConfirm = (key) => {
        var status = this.state.history[key].status
        if (status == 'RECEIVED') {
            firebase.database().ref('report/' + key).child('status').set('IN PROGRESS')
            firebase.database().ref('report/' + key).child('lastUpdatedTime').set(firebase.database.ServerValue.TIMESTAMP)
        } else if (status == 'IN PROGRESS') {
            firebase.database().ref('report/' + key).child('status').set('COMPLETED')
            firebase.database().ref('report/' + key).child('lastUpdatedTime').set(firebase.database.ServerValue.TIMESTAMP)
        }
    }

    // getName = (key) => {
    //     // gsos does not get data fast enough 
    //     var matric = this.state.history[key].reportSubmittedBy
    //     var name 
    //     Promise.all(firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function(snapshot) {
    //         name = snapshot.val().name
    //     }))
    //     return name
    // }

    nullSentence = (type) => {
        if (type == 'RECEIVED') {
            return 'No new reports have been received.'
        } else if (type == 'IN PROGRESS') {
            return 'There are no reports currently in progress.'
        }
    }

    componentDidMount() {

        // need to reorder based on timestamp desc

        firebase.database().ref('/report').orderByChild('status').equalTo(this.props.type).on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let historyItems = {...data}
            this.setState({
                history: historyItems
            })
        });

    }

    componentWillUnmount() {
        return firebase.database().ref('/report').off()
    }

    render() {

        let historyKeys = Object.keys(this.state.history);

        return (
            <View style={styles.container}>
                {historyKeys.length > 0 ? (
                        
                        <ScrollView>
                        {
                            historyKeys.map((key) => (
                                <View key = {key}  style = {styles.item}>
                                    <TouchableOpacity onPress={() => this.handleReport(key)} onLongPress={() => this.handleUndo(key)}>
                                            <View style={styles.status}>
                                                <Text style={styles.taskHeader}>{this.convertTime(this.state.history[key].timeSubmitted)}</Text>
                                                <View style={this.statusCon(this.state.history[key].status)}>
                                                    <Text style={{color: 'white', fontWeight:'500', fontSize:16}}>{this.state.history[key].status}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.histDetails}>
                                                <IconEntypo name='location-pin' size={20} style={{color:'rgb(0, 128, 129)', marginRight:10}}/>
                                                <Text style={styles.taskBody}>{this.state.history[key].location}</Text>
                                            </View>
                                            <View style={styles.histDetails}>
                                                <IconMat name='report-problem' size={20} style={{color:'#fed000', marginRight:10}}/>
                                                <Text style={styles.taskBody}>{this.state.history[key].problem}</Text>
                                            </View>
                                            <View style={styles.histDetails}>
                                                <IconMat name='more' size={20} style={{color:'rgba(76, 81, 120, 0.6)', marginRight:10}}/>
                                                <Text style={styles.taskBody}>{this.state.history[key].otherDetails == '' ? 'No additional details' : this.state.history[key].otherDetails}</Text>
                                            </View>
                                            {/* <View style={styles.histDetails}>
                                                <IconMat name='person' size={20} style={{color:'rgba(0, 0, 0, 0.8)', marginRight:10}}/>
                                                <Text style={styles.taskBody}>{this.getName(key)}</Text>
                                            </View> */}
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                        </ScrollView>
                        
                    ) : (
                        <View style={styles.empty}>
                            <Text style={{fontSize: 18}}>{this.nullSentence(this.props.type)}</Text>
                        </View>
                    )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        alignContent: 'center',
    },
    status : {
        flexDirection: 'row',
        alignItems: 'center',
        width: 350,
        justifyContent: 'space-between'
    },
    statusReceived : {
        height: 30,
        width: 100,
        backgroundColor:'#e54140', 
        borderRadius: 5,
        alignItems: 'center',
        justifyContent:'center'
    },
    statusInProgress : {
        height: 30,
        width: 120,
        backgroundColor:'orange', 
        borderRadius: 5,
        alignItems: 'center',
        justifyContent:'center'
    },
    statusCompleted : {
        height: 30,
        width: 110,
        backgroundColor:'#009b00',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent:'center'
    },
    histDetails : {
        flexDirection: 'row',
        alignItems: 'center',
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
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center'
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 15,
        paddingHorizontal: 20,
        margin: 4,
        backgroundColor: 'white',
        borderRadius: 4,
        width: 390,
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
        fontSize: 18,
        marginVertical: 5,
        flexWrap:'wrap',
        marginRight: 40
    },
    taskProgress : {
        position: 'absolute',
        right: 0,
    },
});