import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
    Alert,
    TextInput,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import { Button } from 'native-base';
import Arrow from 'react-native-vector-icons/AntDesign';

import { Snackbar } from "react-native-paper";

import * as ImagePicker from 'expo-image-picker';

import { StatusButton } from '../components/statusbutton';

import Dialog from 'react-native-dialog';

let unsubscribe;

export default class Profile extends Component {

    state = {
        matric: null,
        currname: null,
        currroom: null,
        status: null,
        msgVisible: false,
        avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/shteady-b81ed.appspot.com/o/defaultsheares.png?alt=media&token=95e0cee4-a5c0-4000-8e9b-2c258f87fe2d',
    };

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                resolve(xhr.response);
            };

            xhr.onerror = function () {
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
                    const { height, width, type, uri } = result;
                    this.setState({ avatarUrl: uri })
                    firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + this.state.matric).child('profilePicUrl').set(uri);
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

    viewContacts = () => {
        this.props.navigation.navigate('Subpages', { screen: 'Important Contacts' });
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
        console.log('currentuser top', firebase.auth().currentUser) //always null
        unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            console.log('Profile chunk')
            if (user) {
                self.setState({ matric: user.displayName })
                console.log('displayname:', user.displayName)
                console.log('currentuser', firebase.auth().currentUser.displayName)
                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/').child(user.displayName).on('value', function (snapshot) {
                    self.setState({ currname: snapshot.val().name })
                    self.setState({ currroom: snapshot.val().room })
                    self.setState({ status: snapshot.val().status })
                    snapshot.val().profilePicUrl === 'default'
                        ? self.setState({ avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/shteady-b81ed.appspot.com/o/defaultsheares.png?alt=media&token=95e0cee4-a5c0-4000-8e9b-2c258f87fe2d' })
                        : self.setState({ avatarUrl: snapshot.val().profilePicUrl })
                    // snapshot.val().room === 'Enter room number'
                    //     ? self.setState({ msgVisible: true })
                    //     : self.setState({ msgVisible: false })
                    while (self.state.matric == null || self.state.currname == null ||
                        self.state.currroom == null || self.state.status == null) {
                        setTimeout(function () { }, 3000);
                        console.log("getting data, setting timeout");
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

    render() {

        console.log("avatarurl:", this.state.avatarUrl);

        // const editProfile = () => {
        //     this.props.navigation.navigate('Subpages', {
        //         screen: 'EditProfile'
        //     });
        // }

        const showDialog = () => {
            this.setState({ dialog: true });
        };

        const handleCancel = () => {
            this.setState({ dialog: false });
        };

        const handleConfirm = () => {
            if (this.state.password1 == this.state.password2) {
                var user = firebase.auth().currentUser;
                user.updatePassword(this.state.password1).then(function () {
                    //do nth
                }).catch(function (error) {
                    console.log(error);
                })
                Alert.alert(
                    'Successful',
                    'Password updated!',
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.setState({ dialog: false }),
                        }
                    ]
                )
            } else {
                alert("New passwords mismatch!");
            }
        };

        return (
            <View style={{ flexDirection: 'column', paddingTop: 20, paddingBottom: 20 }} >
                <View>
                    <TouchableOpacity onPress={this.handleOnPress}>
                        <Image style={styles.profilepic} source={{ uri: this.state.avatarUrl }} />
                    </TouchableOpacity>
                    <Text style={styles.name}>{this.state.currname}</Text>
                    <Text style={styles.details}>{this.state.currroom} | {this.state.matric}</Text>
                    <TouchableOpacity>
                        <Button bordered dark
                            style={styles.changpasswordbtn}
                            onPress={showDialog}>
                            <Text style={{ fontSize: 12, color: '#616161' }}>Change Password</Text>
                        </Button>
                    </TouchableOpacity>

                    <Dialog.Container visible={this.state.dialog}>
                        <Dialog.Title>Change Password</Dialog.Title>
                        <Dialog.Description>
                            Please enter current password and new password.
                        </Dialog.Description>
                        <Dialog.Input
                            placeholder="New Password"
                            secureTextEntry
                            onChangeText={(inputText) => this.setState({ password1: inputText })} />
                        <Dialog.Input
                            placeholder="Confirm New Password"
                            secureTextEntry
                            onChangeText={(inputText) => this.setState({ password2: inputText })} />
                        <Dialog.Button label="Cancel" onPress={handleCancel} />
                        <Dialog.Button label="Confirm" onPress={handleConfirm} />
                    </Dialog.Container>
                </View>

                <View>
                    <TouchableOpacity onPress={this.statusUpdate}>
                        <View style={{ flexDirection: 'row', paddingTop: 30, marginLeft: 50, marginRight: 50 }}>
                            <Text style={styles.statussubpage}>Status</Text>
                            <StatusButton type={this.state.status} />
                            <Arrow name="right" size={40} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={this.viewCommunities}>
                        <View style={styles.orangeline}></View>
                        <View style={{ flexDirection: 'row', paddingTop: 8, marginLeft: 50, marginRight: 50 }}>
                            <Text style={styles.communitysubpage}>Communities</Text>
                            <Arrow name="right" size={40} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={this.viewContacts}>
                        <View style={styles.orangeline}></View>
                        <View style={{ flexDirection: 'row', paddingTop: 8, marginLeft: 50, marginRight: 50 }}>
                            <Text style={styles.contactssubpage}>Important Contacts</Text>
                            <Arrow name="right" size={40} style={styles.arrow} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.signOut}>
                        <View style={styles.orangeline}></View>
                        <Text style={styles.signoutbtn}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
                {/* <Snackbar
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
                </Snackbar> */}
            </View >

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
    profilepic: {
        width: 180,
        height: 180,
        borderRadius: 100,
        alignSelf: 'center'
    },
    changpasswordbtn: {
        width: 120,
        height: 27.5,
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        borderColor: '#616161',
    },
    name: {
        alignSelf: 'center',
        paddingTop: 15,
        fontSize: 20
    },
    details: {
        alignSelf: 'center',
        paddingTop: 10,
        fontSize: 15
    },
    orangeline: {
        borderBottomColor: 'orange',
        borderBottomWidth: 1,
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 50,
        marginRight: 50
    },
    statussubpage: {
        flex: 5,
        fontSize: 16,
        justifyContent: 'flex-start',
        color: '#616161',
        marginTop: 10
    },
    statusdisplay: {
        flex: 4,
        fontSize: 10,
        textAlign: 'right',
        marginRight: 9,
        color: '#616161'
    },
    communitysubpage: {
        flex: 6,
        fontSize: 16,
        justifyContent: 'flex-start',
        color: '#616161',
        marginTop: 9
    },
    contactssubpage: {
        flex: 6,
        fontSize: 16,
        justifyContent: 'flex-start',
        color: '#616161',
        marginTop: 9
    },
    arrow: {
        flex: 1,
        justifyContent: 'flex-end',
        color: '#616161'
    },
    signoutbtn: {
        marginLeft: 50,
        paddingTop: 16,
        color: '#616161',
        fontSize: 16,
    }
});