import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    SectionList
} from "react-native";
import Constants from "expo-constants";
import firebase from 'firebase/app';
import 'firebase/auth';

const Item = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

class viewMenu extends Component {
    state = {
        menu: null
    }

    componentDidMount() {
        var self = this;
        firebase.database().ref('menu').once('value', function(snapshot) {
            self.setState({menu: snapshot.val()})
            while(self.state.menu == null) {
                setTimeout(function() { }, 3000)
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={this.state.menu}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => <Item title={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                />
            </SafeAreaView>
        );
    }
}

export default viewMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        marginBottom: 10,
        marginHorizontal: 16
    },
    item: {
        backgroundColor: "#ffd4b3",
        paddingVertical: 20,
        paddingLeft: 25,
        marginVertical: 8,
        borderRadius: 10
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 14,
    }
});