import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

import Logo from '../components/Logo';

import { loginUser } from '../components/auth';
import { ErrorMsg } from '../components/errormsg';

import firebase from 'firebase/app';
import 'firebase/auth';

const Login = ({ navigation }) => {
    const [matric, setMatric] = useState({ value: "", error: "" });
    const [password, setPassword] = useState({ value: "", error: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    console.log('at homepage', firebase.auth().currentUser)

    const onLoginPressed = async () => {
        if (loading) return;

        setLoading(true);

        const response = await loginUser({
            matric: matric.value,
            email: matric.value + '@u.nus.edu',
            password: password.value
        });

        console.log('navigating????')
        console.log('response', response);

        //for wenyu's version:
        // if (typeof response === 'undefined') {
        //     console.log('navigating')
        //     console.log('login current user', firebase.auth().currentUser); // always null
        //     Promise.all([navigation.navigate('SignedIn', { screen: 'Profile' })])
        //         .then(() => navigation.navigate('Profile'));
        // } else if (response.error) {
        //     setError(response.error);
        // }

        //amelia's version
        if (response.error) {
            setError(response.error);
        } else {
            console.log('navigating')
            Promise.all([navigation.navigate('SignedIn', { screen: 'Profile' })])
                .then(() => navigation.navigate('Profile'));
        }

        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Logo />
            <View style={styles.formCon}>
                <View style={styles.inputBox}>
                    <TextInput style={styles.inputBoxText}
                        placeholder='Matric Number'
                        placeholderTextColor='rgba(0,0,0,0.6)'
                        onChangeText={text => setMatric({ value: text.toUpperCase(), error: '' })} />
                </View>
                <View style={styles.inputBox}>
                    <TextInput style={styles.inputBoxText}
                        placeholder='Password'
                        secureTextEntry
                        placeholderTextColor='rgba(0,0,0,0.6)'
                        onChangeText={text => setPassword({ value: text, error: '' })} />
                </View>
                <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <ErrorMsg message={error} onDismiss={() => setError("")} />
        </View>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fffde7',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupTextCont: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 50,
        flexDirection: 'row',
    },
    signupText: {
        color: 'rgba(0,0,0,0.8)',
        fontSize: 18,
    },
    signupButton: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '500',
    },
    formCon: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    inputBox: {
        borderColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        width: 300,
        height: 40,
        borderRadius: 5,
        marginVertical: 5,
    },
    inputBoxText: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 20,
        color: '#000000',
    },
    button: {
        width: 300,
        height: 40,
        backgroundColor: '#ff7d1d',
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#000000',
        textAlign: 'center',
    },


});