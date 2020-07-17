import React, { Component } from 'react';
import MasterHistory from "./MasterHistory";

export default class ReceivedHistory extends Component {
    render() {
        return (
            <MasterHistory type='RECEIVED'/>
        )
    }
}