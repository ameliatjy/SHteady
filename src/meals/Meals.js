import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Button,
    TouchableOpacity,
    Image,
    Text,
    Alert,
} from 'react-native';

import firebase from 'firebase/app';
import 'firebase/auth';

let unsubscribe;

export default class Meals extends Component {

    state = {
        matric: null,
        mealcredit: null,
        mealresettime: null,
        resetdonationtime: null,
    }

    viewMenu = () => {
        this.props.navigation.navigate('Subpages', { screen: 'Menu', params: { currPage: 'Menu' } });
    }

    confirmdonate = () => {
        var user = firebase.auth().currentUser;

        var matric = user.displayName
        var availcredits, name
        firebase.database().ref('donatedmeals').once('value', function (snapshot) {
            if (snapshot.exists()) {
                firebase.database().ref('donatedmeals').set(snapshot.val() + 1);
            } else {
                firebase.database().ref('donatedmeals').set(1);
            }
        })

        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function (snapshot) {
            availcredits = snapshot.val().mealcredit;
            name = snapshot.val().name;
        })

        var mealsdonatedfrom
        firebase.database().ref('mealsdonatedfrom').once('value', function (snapshot) {
            mealsdonatedfrom = [name]
            snapshot.forEach(function (item) {
                var itemVal = item.val();
                mealsdonatedfrom.push(itemVal);
            })
            firebase.database().ref('mealsdonatedfrom').set(mealsdonatedfrom);
        })

        this.setState({ mealcredit: availcredits - 1 })
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).child('mealcredit').set(availcredits - 1)

        Alert.alert(
            "Successful",
            "Meal credit donated!",
            [
                {
                    text: "Ok"
                }
            ]
        )
    }

    donateMeal = () => {
        if (this.state.mealcredit <= 0) {
            Alert.alert(
                "Unavailable",
                "You do not have any available meal credits left to donate.",
                [
                    {
                        text: "Ok"
                    }
                ]
            )
        } else {
            Alert.alert(
                "Donate meal credit",
                "Click confirm to donate your meal.",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Confirm",
                        onPress: this.confirmdonate
                    }
                ]
            )
            //this.props.navigation.navigate('Subpages', { screen: 'Donate', params: { currPage: 'Donate' } });
        }
    }

    updatedatabase = (newarray) => {
        var donor;
        if (newarray.length === 1) {
            firebase.database().ref('mealsdonatedfrom').set(0);
            donor = newarray.shift();
        } else {
            donor = newarray.shift();
            firebase.database().ref('mealsdonatedfrom').set(newarray);
        }
        Alert.alert(
            "Successful",
            "You have redeemed a meal from " + donor + " !",
            [
                {
                    text: "Ok"
                }
            ]
        )
    }

    confirmsecondmeal = () => {
        var self = this;
        var user = firebase.auth().currentUser;

        var matric = user.displayName
        var availcredits, donatedmeals, mealsdonatedfrom
        firebase.database().ref().once('value', function (snapshot) {
            firebase.database().ref('donatedmeals').set(snapshot.val().donatedmeals - 1);
        })
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function (snapshot) {
            availcredits = snapshot.val().mealcredit;
        })

        var mealsdonatedfrom
        firebase.database().ref('mealsdonatedfrom').once('value', function (snapshot) {
            mealsdonatedfrom = []
            snapshot.forEach(function (item) {
                var itemVal = item.val();
                mealsdonatedfrom.push(itemVal);
            })
            self.updatedatabase(mealsdonatedfrom);
        })

        this.setState({ mealcredit: availcredits + 1 })
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).child('mealcredit').set(availcredits + 1)
    }

    secondMeal = () => {
        var self = this;
        var user = firebase.auth().currentUser;

        var matric = user.displayName
        var donatedmeals
        firebase.database().ref('donatedmeals').once('value', function (snapshot) {
            if (snapshot.exists() === false || snapshot.val() <= 0) {
                Alert.alert(
                    "Unsuccessful",
                    "There are no meals up for redemption.",
                    [
                        {
                            text: "Ok"
                        }
                    ]
                )
            } else {
                Alert.alert(
                    "Extra meal credit",
                    "There are " + snapshot.val() + " donated meals. Are you sure you'd like to have a second serving?",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "YES",
                            onPress: self.confirmsecondmeal
                        }
                    ]
                )
            }
        })
    }

    updatecredit = () => {
        var user = firebase.auth().currentUser;

        var matric = user.displayName
        var availcredits
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).on('value', function (snapshot) {
            availcredits = snapshot.val().mealcredit;
        })

        this.setState({ mealcredit: availcredits - 1 })
        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + matric).child('mealcredit').set(availcredits - 1)
    }

    redeemcredit = () => {
        if (this.state.mealcredit <= 0) {
            Alert.alert(
                "Unavailable",
                "You do not have any available meal credits left.",
                [
                    {
                        text: "Ok"
                    }
                ]
            )
        } else {
            Alert.alert(
                "Use meal credit",
                "Click confirm to redeem your meal.",
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Confirm",
                        onPress: this.updatecredit
                    }
                ]
            )
        }
    }

    getDeets = () => {
        let self = this;
        unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // reset meal credit
                self.setState({ matric: user.displayName })
                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/').child(user.displayName).on('value', function (snapshot) {
                    self.setState({ mealcredit: snapshot.val().mealcredit })
                    self.setState({ mealresettime: snapshot.val().mealresettime })
                    while (self.state.matric == null || self.state.mealcredit == null || self.state.mealresettime == null) {
                        setTimeout(function () { }, 3000);
                        console.log("getting data, setting timeout");
                    }
                })

                // reset donated meals counter and array: should be done when first person log in
                firebase.database().ref('resetdonationtime').on('value', function (snapshot) {
                    if (snapshot.exists()) {
                        self.setState({ resetdonationtime: snapshot.val() })
                    } else {
                        self.setState({ resetdonationtime: 0 }) // when app just launch
                    }
                    while (self.state.resetdonationtime == null) {
                        setTimeout(function () { }, 3000);
                        console.log("getting donationtime");
                    }
                })

                var date = new Date().getDate().toString();
                if (date.length == 1) {
                    date = "0" + date;
                }
                var month = (new Date().getMonth() + 1).toString();
                if (month.length == 1) {
                    month = "0" + month;
                }
                var year = new Date().getFullYear();
                var hours = new Date().getHours().toString();
                if (hours.length == 1) {
                    hours = "0" + hours;
                }

                var currdate = year + month + date;
                var timestamp = currdate + ' ' + hours;

                if (Number(hours) >= 7 && Number(hours) <= 11) { // if current time is breakfast time
                    if (self.state.mealresettime === 0) { // new user
                        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                    } else {
                        var lastmealresetdate = self.state.mealresettime.substring(0, 8);
                        var lastmealresethour = self.state.mealresettime.substring(9, 11);
                        // check if last logged in time is within also
                        if (currdate > lastmealresetdate) {
                            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                        } else { //same day
                            if (Number(lastmealresethour) >= 7 && Number(lastmealresethour) <= 11) {
                                // dont change meal credit
                                console.log('nochange meals')
                            } else {
                                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                            }
                        }
                    }
                    if (self.state.resetdonationtime === 0) { // array haven't been reset
                        firebase.database().ref('resetdonationtime').set(timestamp);
                        firebase.database().ref('mealsdonatedfrom').set(0);
                        firebase.database().ref('donatedmeals').set(0);
                    } else {
                        var lastdonationresetdate = self.state.resetdonationtime.substring(0, 8);
                        var lastdonationresethour = self.state.resetdonationtime.substring(9, 11);
                        if (currdate > lastdonationresetdate) { // need to reset
                            firebase.database().ref('resetdonationtime').set(timestamp);
                            firebase.database().ref('mealsdonatedfrom').set(0);
                            firebase.database().ref('donatedmeals').set(0);
                        } else {
                            if (Number(lastdonationresethour) >= 7 && Number(lastdonationresethour) <= 11) {
                            } else {
                                firebase.database().ref('resetdonationtime').set(timestamp);
                                firebase.database().ref('mealsdonatedfrom').set(0);
                                firebase.database().ref('donatedmeals').set(0);
                            }
                        }
                    }
                } else if (Number(hours) >= 17 && Number(hours) <= 22) { // dinner time
                    if (self.state.mealresettime === 0) { // new user
                        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                        firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                    } else {
                        var lastmealresetdate = self.state.mealresettime.substring(0, 8);
                        var lastmealresethour = self.state.mealresettime.substring(9, 11);
                        // check if last logged in time is within also
                        if (currdate > lastmealresetdate) {
                            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                            firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                        } else { //same day
                            if (Number(lastmealresethour) >= 17 && Number(lastmealresethour) <= 22) {
                                // dont change meal credit
                                console.log('nochange meals')
                                console.log(Number(lastmealresethour))
                            } else {
                                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(1)
                                firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                            }
                        }
                    }
                    if (self.state.resetdonationtime === 0) { // array haven't been reset
                        firebase.database().ref('resetdonationtime').set(timestamp);
                        firebase.database().ref('mealsdonatedfrom').set(0);
                        firebase.database().ref('donatedmeals').set(0);
                    } else {
                        var lastdonationresetdate = self.state.resetdonationtime.substring(0, 8);
                        var lastdonationresethour = self.state.resetdonationtime.substring(9, 11);
                        console.log(lastdonationresethour);
                        if (currdate > lastdonationresetdate) { // need to reset
                            firebase.database().ref('resetdonationtime').set(timestamp);
                            firebase.database().ref('mealsdonatedfrom').set(0);
                            firebase.database().ref('donatedmeals').set(0);
                        } else {
                            if (Number(lastdonationresethour) >= 17 && Number(lastdonationresethour) <= 22) {
                            } else {
                                firebase.database().ref('resetdonationtime').set(timestamp);
                                firebase.database().ref('mealsdonatedfrom').set(0);
                                firebase.database().ref('donatedmeals').set(0);
                            }
                        }
                    }
                } else {
                    firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealcredit').set(0)
                    firebase.database().ref('1F0zRhHHyuRlCyc51oJNn1z0mOaNA7Egv0hx3QSCrzAg/users/' + self.state.matric).child('mealresettime').set(timestamp);
                    firebase.database().ref('resetdonationtime').set(timestamp);
                    firebase.database().ref('mealsdonatedfrom').set(0);
                    firebase.database().ref('donatedmeals').set(0);
                }
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
        return (
            <View style={styles.container}>
                <View style={styles.mealcreditdisplay}>
                    <Text style={styles.mealcreditword}>Meal Credit:   {this.state.mealcredit}</Text>
                    <TouchableOpacity onPress={this.redeemcredit}>
                        <Text style={styles.redeembtn}>Redeem</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btncontainer}>
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={this.viewMenu}>
                                <Image source={require('../images/menu.png')}
                                    style={styles.circlebtns} />
                                <Button title="View Menu" onPress={this.viewMenu} color='#616161' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={this.donateMeal}>
                                <Image source={require('../images/donatemeal.png')}
                                    style={styles.circlebtns} />
                                <Button title="Donate Your Meal" onPress={this.donateMeal} color='#616161' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <View style={{ justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={this.secondMeal}>
                                <Image source={require('../images/secondserving.png')}
                                    style={styles.circlebtns} />
                                <Button title="Second Serving Plz..." onPress={this.secondMeal} color='#616161' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        //justifyContent: 'space-between',
    },
    mealcreditdisplay: {
        backgroundColor: '#ffd4b3',
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'center',
        //paddingVertical: 15,
        flex: 0.1
    },
    mealcreditword: {
        flex: 9,
        marginLeft: 20,
        fontSize: 17
    },
    redeembtn: {
        //flex: 3,
        marginRight: 20,
        fontSize: 17,
        color: '#616161',
    },
    btncontainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 0.9,
        marginTop: 10
    },
    circlebtns: {
        width: 140,
        height: 140,
        alignSelf: 'center'
    }
});
