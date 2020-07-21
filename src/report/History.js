import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import IconEntypo from 'react-native-vector-icons/Entypo'
import IconMat from 'react-native-vector-icons/MaterialIcons'

import firebase from 'firebase/app';
import { ScrollView } from 'react-native-gesture-handler';

const functions = {
    add : (num1, num2) => {
        return num1 + num2
    },
    convertTime : (timestamp) => {
        return moment(new Date(timestamp)).format('lll');
    },
    statusCon : (status) => {
        if (status == 'RECEIVED') {
            return styles.statusReceived
        } else if (status == 'IN PROGRESS') {
            return styles.statusInProgress
        } else {
            return styles.statusCompleted
        }
    }
}

// for testing purposes
// module.exports = functions


export default class History extends Component {

    state = {
        history: {}
    }

    componentDidMount() {

        // need to set interval to check or something 


        var user = firebase.auth().currentUser;
        var matric = user.displayName

        var currReports = []
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).on('value', function(snapshot) {
            currReports = snapshot.val().submittedReports ? snapshot.val().submittedReports : [];
        })

        firebase.database().ref('/report').on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            // console.log(data)
            let keys = Object.keys(data)
            var key
            // console.log(currKey)
            for (key of keys) {
                console.log(key)
                if (currReports.includes(key)) {
                    console.log(data[key])
                    let historyItems = this.state.history
                    historyItems[key] = data[key]
                    this.setState({
                        history: historyItems,
                    });
                }
            }
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
                                    <View style={styles.status}>
                                        <Text style={styles.taskHeader}>{functions.convertTime(this.state.history[key].timeSubmitted)}</Text>
                                        <View style={functions.statusCon(this.state.history[key].status)}>
                                            <Text style={{color: 'white', fontWeight:'700', fontSize:16}}>{this.state.history[key].status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.histDetails}>
                                        <IconEntypo name='location-pin' size={20} style={{color: 'rgb(0, 128, 129)', marginRight:10}}/>
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
                                </View>
                            ))
                        }
                    </ScrollView>
                        
                ) : (
                    <View style={styles.empty}>
                        <Text style={{fontSize: 18}}>There are no previous fault reports made by you!</Text>
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