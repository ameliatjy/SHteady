import React, { Component } from 'react';
import { StyleSheet, Alert, View, Text, Keyboard } from 'react-native';
import { ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { GiftedChat, Bubble, Send, IMessage } from 'react-native-gifted-chat';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

import firebase from 'firebase/app';
import 'firebase/auth';
import { SafeAreaView } from 'react-navigation';

export default class Announcements extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        messages: [],
    };

    // componentDidUpdate(prevProps) {
    //     const { messages, text, inverted } = this.props;

    //     if (this.props !== prevProps) {
    //         this.setMessages(messages || []);
    //     }

    //     if (
    //         inverted === false &&
    //         messages &&
    //         prevProps.messages &&
    //         messages.length !== prevProps.messages.length &&
    //         this.props.scrollToBottom
    //     ) {
    //         setTimeout(() => this.scrollToBottom(false), 200);
    //     }

    //     if (text !== prevProps.text) {
    //         this.setTextFromProp(text);
    //     }
    // }

    // can be changed later to check access different eg based on cca
    checkAccess = () => {
        var curruser = firebase.auth().currentUser
        var matric = curruser.displayName
        var curraccess = []
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).on('value', function(snapshot) {
            // curremail = snapshot.val().email;
            curraccess = snapshot.val().cca ? snapshot.val().cca : [];
        })
        return curraccess.includes('ccajcrc')
    }

    send = (messages) => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };
            return firebase.database().ref('messages').push(message);
        })
    }

    parse = (message) => {
        const { user, text, timestamp } = message.val()
        const { key: _id } = message
        const createdAt = new Date(timestamp)

        return {
            _id, 
            createdAt,
            text,
            user
        }
    }

    get = (callback) => {
        return firebase.database().ref('messages').on('child_added', snapshot => callback(this.parse(snapshot)))
    }

    off = () => {
        return firebase.database().ref('messages').off()
    }

    get user() {
        var curruser = firebase.auth().currentUser
        var matric = curruser.displayName
        var currname
        // curremail
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/'+ matric).on('value', function(snapshot) {
            // curremail = snapshot.val().email;
            currname = snapshot.val().name;
        })
        return {
            _id: curruser.uid,
            name: currname,
            // email: curremail,
            // add in avatar
        };
    }



    componentDidMount() {
        this.get(message =>
            this.setState(previousState => ({
                messages: GiftedChat.prepend(previousState.messages, message), //?
            }))
        );
    }

    componentWillUnmount() {
        this.off();
    }

    renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right : {
                        backgroundColor: '#ffae50'
                    },
                    left : {
                        backgroundColor: '#616161'
                    }
                }}
                textProps={{
                    style: {
                        color: props.position === 'left' ? '#fff' : '#000',  
                    },
                }}
                textStyle={{
                    right : {
                        // color: '#fff',
                        fontSize: 17
                    },
                    left : {
                        // color: '#fff',
                        fontSize: 17
                    }
                }}
            />
        );
    }

    renderSend = (props) => {
        return (
            <Send {...props}>
                {/* <View style={styles.sendingCon}> */}
                <View>
                    <IconMCI name='send-circle' size={45} color='#ff7d1d' />
                </View>
            </Send>
        );
    }

    scrollToBottomComponent = () => {
        return (
            <View>
                <IconMCI name='chevron-double-down' size={36} color='#ff7d1d' />
            </View>
        );
    }

    render() {
        return (
            // <SafeAreaView style={{flex: 1}}>
                <GiftedChat 
                    messages={this.state.messages}
                    onSend={this.send}
                    user={this.user}
                    bottomOffset={0}
                    placeholder={'To all Shearites...'}
                    renderInputToolbar={! this.checkAccess() ? () => null : undefined}
                    renderComposer={! this.checkAccess() ? () => null : undefined}
                    minInputToolbarHeight={! this.checkAccess() ? 0 : undefined}
                    renderUsernameOnMessage={true}
                    scrollToBottom={false} //?
                    scrollToBottomComponent={this.scrollToBottomComponent}
                    keyboardShouldPersistTaps={'never'}
                    renderBubble={this.renderBubble}
                    renderSend={this.renderSend}
                    // listViewProps={{ onRefresh, refreshing: loading }}
                    inverted={false} //?
                    main
                />
            // {/* </SafeAreaView> */}
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10
    },
    item: {
        backgroundColor: '#ECECEC',
        marginTop: 4,
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 15,
    },
    sendingCon: {
        marginLeft: 20,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});