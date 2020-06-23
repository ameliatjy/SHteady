import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';

import Arrow from 'react-native-vector-icons/AntDesign';

import firebase from 'firebase/app';
import 'firebase/auth';

import Accordion from 'react-native-collapsible/Accordion';
import { StatusButton } from '../components/statusbutton';

let unsubscribe;

export default class Communities extends Component {

    state = {
        groups: [],
        activeSections: [],
        members: []
    }

    test = []
    status = new Map();

    goToCommunity = () => {
        Alert.alert('Going to check members of this community');
    }

    getDeets = () => {
        let self = this;
        unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            console.log('Communities chunk')
            if (user) {
                self.setState({ matric: user.displayName })
                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/').child(user.displayName).on('value', function (snapshot) {
                    var grps = snapshot.val().cca
                    typeof grps === 'undefined'
                        ? self.setState({ groups: [] })
                        : self.setState({ groups: snapshot.val().cca })
                    while (self.state.matric == null || self.state.groups == null) {
                        setTimeout(function () { }, 3000);
                    }
                })
            } else {
                console.log('user not signed in')
            }
        })
    }

    componentDidMount() {
        this.getDeets();
    }

    componentWillUnmount() {
        unsubscribe()
    }

    _renderSectionTitle = section => {
        return (
            <View style={styles.container}>
                <Text style={styles.ccaname}>{section}</Text>
            </View>
        );
    };

    _renderHeader = () => {
        return (
            <View style={styles.viewmembersBtn}>
                <Text style={styles.viewmembersWord}>Click to view members</Text>
            </View>
        );
    };

    addmemberstoarray = (ccaname, key) => {
        var membersarray = this.test
        var statusmap = this.status
        firebase.database().ref('CCA/' + ccaname + '/' + key).on('value', function (snapshot) {
            var matric = snapshot.val().matric;
            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function (snapshot) {
                // curremail = snapshot.val().email;
                var name = snapshot.val().name;
                var status = snapshot.val().status;
                membersarray.push(name)
                statusmap.set(name, status)
                console.log('statusmap', statusmap)
            })
        })
    }

    _renderContent = section => {
        const ccaIndex = this.state.activeSections[0]
        console.log(ccaIndex)
        const ccaname = this.state.groups[ccaIndex]
        console.log(ccaname) // Sports Management Board
        if (typeof ccaname !== 'undefined') {
            firebase.database().ref('CCA/' + ccaname).on('value', querySnapShot => {
                let data = querySnapShot.val() ? querySnapShot.val() : {};
                console.log(data)
                let keys = Object.keys(data)
                console.log(keys)
                var key
                for (key of keys) {
                    this.addmemberstoarray(ccaname, key)
                }
            })
            console.log('testarray', this.test)
        } else {
            this.test = []
            console.log('testarray', this.test)
        }
        return (
            <View style={styles.membersDisplay}>
                {this.test.map((item) => (
                    <View style={styles.membersdetails}>
                        <Text style={styles.membersname}>{item}</Text>
                        <StatusButton type={this.status.get(item)} />
                    </View>
                ))}
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        console.log(this.state.activeSections)
        return (
            <Accordion
                sections={this.state.groups}
                activeSections={this.state.activeSections}
                renderSectionTitle={this._renderSectionTitle}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
                onChange={this._updateSections}
            />
        );
    }
}

// <Arrow name="right" size={20} style={{flex: 1, alignSelf:"flex-end"}}/>


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingLeft: 20,
        marginTop: 10,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
    text: {
        color: '#808080',
        flex: 12
    },
    viewmembersBtn: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        paddingLeft: 20,
        paddingBottom: 20,
        paddingTop: 10
    },
    viewmembersWord: {
        color: '#bdbdbd'
    },
    membersDisplay: {
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        paddingLeft: 35,
        paddingBottom: 20,
        flexDirection: 'column'
    },
    ccaname: {
        fontWeight: 'bold',
    },
    membersname: {
        flex: 5,
        alignSelf: 'center'
    },
    membersdetails: {
        flexDirection: 'row',
        paddingBottom: 5
    }
});