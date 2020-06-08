import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Alert,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { Container, Content, Button } from 'native-base';
import Arrow from 'react-native-vector-icons/AntDesign';

import { ErrorMsg } from '../components/errormsg';
import { Snackbar } from "react-native-paper";

import * as ImagePicker from 'expo-image-picker';

export default class Profile extends Component {

    state = {
        matric: null,
        currname: null,
        curremail: null,
        currroom: null,
        status: null,
        msgVisible: false,
        avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/shteady-b81ed.appspot.com/o/defaultsheares.png?alt=media&token=95e0cee4-a5c0-4000-8e9b-2c258f87fe2d',
    };

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = function() {
                resolve(xhr.response);
            };

            xhr.onerror = function() {
                reject(new Error('uriToBlob failed'));
            };

            xhr.responseType = 'blob';

            xhr.open('GET', uri, true);
            xhr.send(null);
        }).catch(alert);
    }

    uploadToFirebase = (blob) => {
        return new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref();

            storageRef.child('uploads/' + this.state.matric + '.jpg').put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                blob.close();
                resolve(snapshot);
            }).catch((error) => {
                reject(error);
            });
        }).catch(error => {
            // do nothing when user does not select an image to upload.
        });
    }

    handleOnPress = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult === false) {
            alert("Permission to access camera roll is required!");
            return;
        } else {
            ImagePicker.launchImageLibraryAsync({
                mediaTypes: "Images"
            }).then((result) => {
                if (!result.cancelled) {
                    const {height, width, type, uri} = result;
                    this.setState({ avatarUrl: uri })
                    firebase.database().ref('users/' + this.state.matric).child('profilePicUrl').set(uri);
                    return this.uriToBlob(uri)
                }
            }).then((blob) => {
                return this.uploadToFirebase(blob);
            }).then((snapshot) => {
                console.log("File uploaded");
            }).catch((error) => {
                throw error;
            });
        }
    }

    statusUpdate = () => {
        this.props.navigation.navigate('Subpages', {
            screen: 'Status'
        });
    }

    viewCommunities = () => {
        this.props.navigation.navigate('Subpages', { screen: 'Communities' });
    }

    signOut = () => {
        Alert.alert(
            'Sign Out',
            'Sign out of SHteady?',
            [
                {
                    text: 'Cancel',
                    onPress: () => this.props.navigation.navigate('Profile'),
                },
                {
                    text: 'Confirm',
                    onPress: () => firebase.auth().signOut().then(() => this.props.navigation.navigate('SignedOut', { screen: 'Login' })),
                }
            ],
            { cancelable: false }
        );
    }

    getDeets = () => {
        let self = this;
        firebase.auth().onAuthStateChanged(function (user) {
            console.log('Profile chunk')
            if (user) {
                self.setState({ matric: user.displayName })
                firebase.database().ref('users/').child(user.displayName).on('value', function (snapshot) {
                    self.setState({ currname: snapshot.val().name })
                    self.setState({ curremail: snapshot.val().email })
                    self.setState({ currroom: snapshot.val().room })
                    self.setState({ status: snapshot.val().status })
                    self.setState({ avatarUrl: snapshot.val().profilePicUrl })
                    console.log("inner avatar link:", snapshot.val().profilePicUrl);
                    snapshot.val().room === 'Enter room number'
                        ? self.setState({ msgVisible: true })
                        : self.setState({ msgVisible: false })
                    while (self.state.matric == null || self.state.curremail == null || self.state.currname == null || self.state.currroom == null || self.state.status == null) {
                        setTimeout(function () { }, 3000);
                        console.log("getting data, setting timeout");
                    }
                    console.log("outer avatarurl:", self.state.avatarUrl);
                })
            } else {
                console.log('user not signed in')
            }
        })
    }

    componentDidMount() {
        this.getDeets();
    }

    render() {

        console.log("avatarurl:", this.state.avatarUrl); 

        const editProfile = () => {
            this.props.navigation.navigate('Subpages', {
                screen: 'EditProfile'
            });
        }

        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, paddingTop: 30 }}>
                    <TouchableOpacity onPress={this.handleOnPress}>
                    <Image style={styles.images} source={{ uri: this.state.avatarUrl }} />
                    </TouchableOpacity>
                    {/* <Button onPress={this.handleOnPress}>
                        <Text>Choose photo</Text>
                    </Button> */}
                    <Text style={{ alignSelf: 'center', paddingTop: 30, fontSize: 20 }}>{this.state.currname}</Text>
                    <Text style={{ alignSelf: 'center', paddingTop: 10, fontSize: 15 }}>{this.state.currroom} | {this.state.matric}</Text>
                    <TouchableOpacity>
                        <Button bordered dark
                            style={{ width: 90, height: 26, alignSelf: 'center', marginTop: 10, justifyContent: 'center', borderColor: '#616161' }}
                            onPress={editProfile}>
                            <Text style={{ fontSize: 12, color: '#616161' }}>Edit Profile</Text>
                        </Button>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.statusUpdate}>
                        <View style={{ flexDirection: 'row', paddingTop: 30, marginLeft: 50, marginRight: 50 }}>
                            <Text style={{ flex: 5, fontSize: 16, justifyContent: 'flex-start', color: '#616161' }}>Status</Text>
                            <Text style={{ flex: 4, fontSize: 10, textAlign: 'right', marginRight: 10, color: '#616161' }}>{this.state.status}</Text>
                            <Arrow name="right" size={40} style={{ flex: 1, justifyContent: 'flex-end', color: '#616161' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.viewCommunities}>
                        <View style={{ borderBottomColor: 'orange', borderBottomWidth: 1, marginTop: 10, marginBottom: 10, marginLeft: 50, marginRight: 50 }}></View>
                        <View style={{ flexDirection: 'row', paddingTop: 8, marginLeft: 50, marginRight: 50 }}>
                            <Text style={{ flex: 9, fontSize: 16, justifyContent: 'flex-start', color: '#616161' }}>Communities</Text>
                            <Arrow name="right" size={40} style={{ flex: 1, justifyContent: 'flex-end', color: '#616161' }} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.signOut}>
                        <View style={{ borderBottomColor: 'orange', borderBottomWidth: 1, marginTop: 10, marginBottom: 10, marginLeft: 50, marginRight: 50 }}></View>
                        <Text style={{ marginLeft: 50, paddingTop: 16, color: '#616161', fontSize: 16 }}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
                <Snackbar
                    visible={this.state.msgVisible}
                    duration={Snackbar.DURATION_LONG}
                    onDismiss={() => this.setState({ msgVisible: false })}
                    style={{ backgroundColor: '#f13a59', position: 'absolute' }}
                    action={{
                        label: 'Ok',
                        onPress: editProfile
                    }}
                >
                    <Text style={{ fontSize: 15 }}>Please edit profile</Text>
                </Snackbar>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    images: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignSelf: 'center'
    }
});