import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationBadge = props => {
    return (
        <View style={styles.badge}>
            <Text>{props.count}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    badge: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        minHeight: 25,
        minWidth: 25,
        paddingLeft: 5,
        paddingRight: 5,
        position: 'absolute',
        right: '15%',
        top: '40%',
        backgroundColor: '#6CE631',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
})

export default NotificationBadge;