import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { localHost } from '../localhost.js';

const RequestsScreen = props => {

    return (
        <View style={styles.container}>
            <Text styles={styles.baseText}>Requests</Text>
        </View>
    );

};

const styles = StyleSheet.create({
    baseText: {
        fontSize: 16
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
});

export default RequestsScreen;