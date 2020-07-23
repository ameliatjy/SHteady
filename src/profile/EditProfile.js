import firebase from 'firebase/app';
import 'firebase/auth';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Alert,
    TouchableOpacity,
} from 'react-native';

import Dialog from 'react-native-dialog';

import * as ImagePicker from 'expo-image-picker';

let unsubscribe;

export default class EditProfile extends Component {

    state = {
        matric: null,
        profilePicUrl: null,
    }

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
        //Alert.alert("This may take a few seconds.")
        return new Promise((resolve, reject) => {
            var storageRef = firebase.storage().ref();
            var self = this;

            storageRef.child('uploads/' + this.state.matric + '.jpg').put(blob, {
                contentType: 'image/jpeg'
            }).then((snapshot) => {
                blob.close();
                resolve(snapshot);
            }).catch((error) => {
                reject(error);
            }).then(async function () {
                var link = await firebase.storage().ref().child('uploads/' + self.state.matric + '.jpg').getDownloadURL();
                await firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('profilePicUrl').set(link)
            }).then(() => {
                Alert.alert(
                    "Successful",
                    "Profile picture changed!",
                    [
                        { text: "Ok", onPress: () => this.getDeets() }
                    ])
            })
        }).catch(error => {
            // do nothing when user does not select an image to upload.
        });
    }

    handleOnPress = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        let newPermission = await ImagePicker.getCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        } else {
            ImagePicker.launchImageLibraryAsync({
                mediaTypes: "Images"
            }).then((result) => {
                if (!result.cancelled) {
                    Alert.alert("This may take a few seconds. Click OK to continue.")
                    const { height, width, type, uri } = result;
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

    getDeets = () => {
        let self = this;
        unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                self.setState({ matric: user.displayName })
                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/').child(user.displayName).on('value', function (snapshot) {
                    self.setState({ profilePicUrl: snapshot.val().profilePicUrl })
                    while (self.state.matric == null || self.state.profilePicUrl == null) {
                        setTimeout(function () { }, 3000);
                        console.log("getting data, setting timeout");
                    }
                })
            } else {
                console.log('user not signed in')
            }
        })
    }

    confirmDelete = () => {
        firebase.storage().ref().child('uploads/' + this.state.matric + '.jpg').delete().then(function () {
        }).catch(function (error) {
        })
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + this.state.matric).child('profilePicUrl').set('default')
    }

    deletePicture = () => {
        if (this.state.profilePicUrl === 'default') {
            Alert.alert("Default profile picture cannot be deleted.")
        } else {
            Alert.alert(
                "Delete Profile Picture",
                "Please confirm deletion of profile picture. Your profile picture will be set to default. This action is irreversible.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Confirm", onPress: () => this.confirmDelete() }
                ]
            )
        }
    }

    componentDidMount() {
        this.getDeets();
    }

    componentWillUnmount() {
        unsubscribe()
    }

    render() {
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
            <View style={styles.container}>
                <TouchableOpacity style={styles.textbtn} onPress={this.handleOnPress}>
                    <Text style={styles.textstyle}>Change Profile Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deletebtn} onPress={this.deletePicture}>
                    <Text style={styles.deleteword}>Delete Current Profile Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textbtn} onPress={showDialog}>
                    <Text style={styles.textstyle}>Change Password</Text>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'column',
    },
    deleteword: {
        color: '#ff0000',
        fontSize: 16
    },
    deletebtn: {
        flexDirection: 'row',
        backgroundColor: '#ffd4b3',
        height: 80,
        width: 380,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 15
    },
    textbtn: {
        backgroundColor: '#ffd4b3',
        height: 80,
        width: 380,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginTop: 15
    },
    textstyle: {
        fontSize: 16
    }
});