import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Dialog from "react-native-dialog";
import Icon from'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import firebase from 'firebase/app';
import 'firebase/auth';

export default class SubmitRequest extends Component {

    state = {
        dabaoDialogVisible: false,
        groceriesDialogVisible: false,
        othersDialogVisible: false,
        datetimePickerVisibility: false,
        dabaoText: '',
        groceriesText: '',
        othersText: '',
    }

    addMinutes =  (minutes)  => {
        var curr = new Date()
        return new Date(curr.getTime() + minutes*60000).getTime();
    }

    oneTimeTaskConfirmation = (currtask, moreInfo, priority, autoDelete) => {
        var user = firebase.auth().currentUser;

        var matric = user.displayName
        var currroom, currname, currprofilepic, block
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function(snapshot) {
            currroom = snapshot.val().room;
            currname = snapshot.val().name;
            currprofilepic = snapshot.val().profilePicUrl;
            // block = currroom.substring(0, 1);
        })
        
        var newRequest = firebase.database().ref('dashboard/').push();
        newRequest.setWithPriority({
            matric: matric,
            name: currname,
            room: currroom,
            profilePicUrl: currprofilepic === 'default' ? 'https://firebasestorage.googleapis.com/v0/b/shteady-b81ed.appspot.com/o/defaultsheares.png?alt=media&token=95e0cee4-a5c0-4000-8e9b-2c258f87fe2d' : currprofilepic,
            task: currtask,
            additionalInfo: moreInfo,
            isInProgress: false,
            helper: null,
            priority: priority,
            autoDeleteAt: autoDelete
        }, priority)

        var key = newRequest.getKey()
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric + '/dashboard').child(key).setWithPriority({
            matric: matric,
            name: currname,
            room: currroom,
            profilePicUrl: currprofilepic === 'default' ? 'https://firebasestorage.googleapis.com/v0/b/shteady-b81ed.appspot.com/o/defaultsheares.png?alt=media&token=95e0cee4-a5c0-4000-8e9b-2c258f87fe2d' : currprofilepic,
            task: currtask,
            additionalInfo: moreInfo,
            isInProgress: false,
            helper: null,
            priority: priority,
            autoDeleteAt: autoDelete
        }, priority)
    }

    closeMyWindowsButton() {
        var autoDelete = this.addMinutes(60)
        Alert.alert(
            'Send Help Please!',
            'Please help me close my windows!!!',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Confirm', onPress: () => this.oneTimeTaskConfirmation('Please close my windows!', '', 1, autoDelete), style: 'default'},
            ]
        );
    }

    dabaoShowDialog = () => {
        this.setState({ dabaoDialogVisible: true });
    }
     
    dabaoHandleConfirm = () => {
        var autoDelete = this.addMinutes(1440)
        this.oneTimeTaskConfirmation('Please help me dabao commhall!',  this.state.dabaoText, 3, autoDelete)
        this.setState({ 
            dabaoDialogVisible: false, 
            dabaoText: ''
        });
    }
     
    dabaoHandleClose = () => {
        this.setState({ 
            dabaoDialogVisible: false,
            dabaoText: '' 
        });
    }

    showDatetimePicker = () => {
        this.setState({datetimePickerVisibility: true});
    }
     
    hideDatetimePicker = () => {
        this.setState({datetimePickerVisibility: false});
    }
     
    wakeupHandleConfirm = (datetime) => {
        var autoDelete = datetime.getTime()
        this.oneTimeTaskConfirmation('Please wake me up!', moment(datetime).format('llll'), 4, autoDelete)
        this.hideDatetimePicker();
    }

    hideAirconButton() {
        var autoDelete = this.addMinutes(60)
        Alert.alert(
            'Send Help Please!',
            'Halim coming!!! Help me hide my aircon PLEASE!!!',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Confirm', onPress: () => this.oneTimeTaskConfirmation('Please hide my aircon!', '', 2, autoDelete), style: 'default'},
            ]
        );
    }

    groceriesShowDialog = () => {
        this.setState({ groceriesDialogVisible: true });
    }
     
    groceriesHandleConfirm = () => {
        var autoDelete = this.addMinutes(2880)
        this.oneTimeTaskConfirmation('Please help me get groceries!', this.state.groceriesText, 5, autoDelete)
        this.setState({ 
            groceriesDialogVisible: false,
            groceriesText: '' 
        });
    }
     
    groceriesHandleClose = () => {
        this.setState({ 
            groceriesDialogVisible: false,
            groceriesText: ''
        });
    }

    othersShowDialog = () => {
        this.setState({ othersDialogVisible: true });
    }
     
    othersHandleConfirm = () => {
        var autoDelete = this.addMinutes(2880)
        this.oneTimeTaskConfirmation('Please help me with something!', this.state.othersText, 6, autoDelete)
        this.setState({ 
            othersDialogVisible: false,
            othersText: ''
        });
    }
     
    othersHandleClose = () => {
        this.setState({ 
            othersDialogVisible: false,
            othersText: ''
        });
    }

    render() {

        return(
            <View style={styles.container}>
                <View style={styles.iconCon}>

                    <TouchableOpacity style={styles.individualIcon} onPress={() => this.closeMyWindowsButton()}>
                        <Image style={styles.iconPic}
                            source={require('../images/closemywindows.png')}/>
                        <Text style={styles.iconText}>Close My Windows</Text>
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity style={styles.individualIcon} onPress={this.dabaoShowDialog}>
                            <Image style={styles.iconPic}
                                source={require('../images/dabao.png')}/>
                            <Text style={styles.iconText}>Dabao Comm Hall</Text>
                        </TouchableOpacity>
                        <Dialog.Container visible={this.state.dabaoDialogVisible}>
                            <Dialog.Title>Send Help Please!</Dialog.Title>
                            <Dialog.Description>
                                Help me dabao please!!! I don't want to starve :')
                            </Dialog.Description>
                            <Dialog.Input 
                                placeholder={'Input dishes to dabao'}
                                onChangeText={(inputText) => this.setState({dabaoText: inputText})}/>
                            <Dialog.Button label="Cancel" onPress={this.dabaoHandleClose} style={{fontWeight: '500'}}/>
                            <Dialog.Button label="Confirm" onPress={this.dabaoHandleConfirm}/>
                        </Dialog.Container>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.individualIcon} onPress={this.showDatetimePicker}>
                            {/* onpress open datetimepicker */}
                            <Image style={styles.iconPic}
                                source={require('../images/morningcall.png')}/>
                            <Text style={styles.iconText}>Wake Me Up</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={this.state.datetimePickerVisibility}
                            mode="datetime"
                            headerTextIOS={'Please wake me up at'}
                            onConfirm={this.wakeupHandleConfirm}
                            onCancel={this.hideDatetimePicker}
                            date={new Date()}
                        />
                    </View>

                    <TouchableOpacity style={styles.individualIcon} onPress={() => this.hideAirconButton()}>
                        <Image style={styles.iconPic}
                            source={require('../images/hideaircon.png')}/>
                        <Text style={styles.iconText}>Shift Aircon</Text>
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity style={styles.individualIcon} onPress={this.groceriesShowDialog}>
                            <Image style={styles.iconPic}
                                source={require('../images/groceries.png')}/>
                            <Text style={styles.iconText}>Buy Groceries</Text>
                        </TouchableOpacity>
                        <Dialog.Container visible={this.state.groceriesDialogVisible}>
                            <Dialog.Title>Send Help Please!</Dialog.Title>
                            <Dialog.Description>
                                Please help me restore my personal pantry :')
                            </Dialog.Description>
                            <Dialog.Input 
                                placeholder={'Input groceries to be bought'}
                                onChangeText={(inputText) => this.setState({groceriesText: inputText})}/>
                            <Dialog.Button label="Cancel" onPress={this.groceriesHandleClose} style={{fontWeight: '500'}}/>
                            <Dialog.Button label="Confirm" onPress={this.groceriesHandleConfirm}/>
                        </Dialog.Container>
                    </View>

                    <View>
                        <TouchableOpacity style={styles.individualIcon} onPress={this.othersShowDialog}>
                            <Image style={styles.iconPic}
                                source={require('../images/others.png')}/>
                            <Text style={styles.iconText}>Others</Text>
                        </TouchableOpacity>
                        <Dialog.Container visible={this.state.othersDialogVisible}>
                            <Dialog.Title>Send Help Please!</Dialog.Title>
                            <Dialog.Description>
                                Please help me ...
                            </Dialog.Description>
                            <Dialog.Input 
                                placeholder={'Input help needed'}
                                onChangeText={(inputText) => this.setState({othersText: inputText})}/>
                            <Dialog.Button label="Cancel" onPress={this.othersHandleClose} style={{fontWeight: '500'}}/>
                            <Dialog.Button label="Confirm" onPress={this.othersHandleConfirm}/>
                        </Dialog.Container>
                    </View>

                </View>
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
        // flex: 0.5,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent:'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
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
});