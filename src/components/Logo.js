import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

export default class Logo extends Component {
    render() {
        return(
            <View style={styles.container}>
                <Image style={styles.image}
                    source={require('../images/6.png')}/>
                <Text style={styles.logoText}>Hey there, Shearite!</Text>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image : {
        width: Dimensions.get('window').width,
        height: 200,
    },
    logoText : {
        marginVertical: 15,
        fontSize: 25,
    }
});