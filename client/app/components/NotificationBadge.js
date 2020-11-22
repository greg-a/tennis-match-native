import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationBadge = props => {
    return (
        <View style={styles.badge}>
            <Text style={styles.text}>{props.count}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        minHeight: 5,
        minWidth: 5,
        paddingLeft: 5,
        paddingRight: 5,
        left: 15,
        top: -5,
        position: 'absolute',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    text: {
        color: '#6CE631'
    }
})

export default NotificationBadge;