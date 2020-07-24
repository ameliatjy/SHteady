import React from 'react';
import {
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'

const functions = require('../statusbutton')

test('Status button (Available)', () => {
    expect(functions.StatusButton({type: 'yo hmu i am in'})).toEqual(
        <View style={{ "flex": 1 }}>
            <Icon allowFontScaling={false} name="circle" size={38} style={{ "color": "#39ff14", "opacity": 0.8 }} />
        </View>
    )
});

test('Status button (Busy)', () => {
    expect(functions.StatusButton({type: 'busy... do not find me'})).toEqual(
        <View style={{ "flex": 1 }}>
            <Icon allowFontScaling={false} name="circle" size={38} style={{ "color": "#fed000", "opacity": 0.8 }} />
        </View>
    )
});

test('Status button (Not In Hall)', () => {
    expect(functions.StatusButton({type: 'i am out of hall'})).toEqual(
        <View style={{ "flex": 1 }}>
            <Icon allowFontScaling={false} name="circle" size={38} style={{ "color": "#ff0000", "opacity": 0.8 }} />
        </View>
    )
});

test('Status button (Account not initialized yet)', () => {
    expect(functions.StatusButton({type: 'uninitialized account'})).toEqual(
        <View style={{ "flex": 1 }}>
            <Icon allowFontScaling={false} name="circle" size={38} style={{ "color": "#b9beb9", "opacity": 0.8 }} />
        </View>
    )
});