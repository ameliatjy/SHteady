import React from 'react';
import { Snackbar } from "react-native-paper";
import {
    View, Text
} from 'react-native';

const functions = require('../errormsg')

test('Error Snackbar Message', () => {
    expect(functions.ErrorMsg('test')).toEqual(
        <View style={{ "position": "absolute", "top": 100, "width": "100%" }}>
            <Snackbar duration={2000} style={{ "backgroundColor": "#f13a59" }} visible={false}>
                <Text style={{ "fontWeight": "500" }} />
            </Snackbar>
        </View>
    );
});