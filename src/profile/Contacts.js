import React, { Component, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    Linking,
    Button
} from 'react-native';

import Arrow from 'react-native-vector-icons/AntDesign';

import firebase from 'firebase/app';
import 'firebase/auth';

export default class Contacts extends Component {
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.sheareshallheading}>Sheares Hall</Text>
                    <Text style={styles.address}>20 Heng Mui Keng Terrace, Singapore 119618</Text>
                    <View style={styles.segment}>
                        <Text style={styles.segmentheader}>Hall Office Hours</Text>
                        <Text style={{ paddingBottom: 5 }}>Monday - Thursday: 9AM - 6PM</Text>
                        <Text style={{ paddingBottom: 5 }}>Friday: 9AM - 5.30PM</Text>
                        <Text>Saturday - Sunday: Closed</Text>
                    </View>
                    <View style={styles.segment}>
                        <Text style={styles.segmentheader}>For finance (student activities) matters:</Text>
                        <View style={styles.segmentcontent}>
                            <Text style={{ paddingBottom: 5 }}>Please contact Jamie at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('tel:6601 7191')}>
                                <Text style={styles.link}>6601 7191 </Text>
                            </TouchableOpacity>
                            <Text>or email her at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:jamie@nus.edu.sg')}>
                                <Text style={styles.link}>jamie@nus.edu.sg</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.segment}>
                        <Text style={styles.segmentheader}>For student related matters:</Text>
                        <View style={styles.segmentcontent}>
                            <Text style={{ paddingBottom: 5 }}>Please contact Valli at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('tel:6516 1022')}>
                                <Text style={styles.link}>6516 1022 </Text>
                            </TouchableOpacity>
                            <Text>or email her at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:sshbv@nus.edu.sg')}>
                                <Text style={styles.link}>sshbv@nus.edu.sg</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.segment}>
                        <Text style={styles.segmentheader}>For accomodation, maintenance or finance (hostel fee) matters:</Text>
                        <View style={styles.segmentcontent}>
                            <Text style={{ paddingBottom: 5 }}>Please contact Jamuna (</Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:ohsjk@nus.edu.sg')}>
                                <Text style={styles.link}>ohsjk@nus.edu.sg</Text>
                            </TouchableOpacity>
                            <Text>) or </Text>
                            <Text>Wen Hui (</Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:oshkwh@nus.edu.sg')}>
                                <Text style={styles.link}>oshkwh@nus.edu.sg</Text>
                            </TouchableOpacity>
                            <Text>) at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('tel:6601 7202')}>
                                <Text style={styles.link}>6601 7202</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.segment}>
                        <Text style={styles.segmentheader}>For other matters:</Text>
                        <View style={styles.segmentcontent}>
                            <Text style={{ paddingBottom: 5 }}>Please contact Qi Qi at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('tel:6516 1231')}>
                                <Text style={styles.link}>6516 1231 </Text>
                            </TouchableOpacity>
                            <Text>or email her at </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:sshkqq@nus.edu.sg')}>
                                <Text style={styles.link}>sshkqq@nus.edu.sg</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.websitedisplay}>
                        <Text>For other information, do visit:</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('http://nus.edu.sg/osa/sheareshall')}>
                                <Text style={styles.link}>http://nus.edu.sg/osa/sheareshall</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 12
    },
    sheareshallheading: {
        padding: 10,
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    address: {
        alignSelf: 'center',
        marginBottom: 15
    },
    segment: {
        backgroundColor: '#ffd4b3',
        borderRadius: 10,
        padding: 20,
        marginTop: 10
    },
    segmentheader: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    segmentcontent: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    link: {
        color: 'rgb(25, 125, 280)'
    },
    websitedisplay: {
        paddingTop: 15,
        alignItems:'center'
    }
})
