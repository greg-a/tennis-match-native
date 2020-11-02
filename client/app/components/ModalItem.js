import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ModalItem = props => {
    return (
        <View>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    title: {
        fontSize: 16
    },
    subtitle: {
        fontSize: 10,
        color: 'grey'
    }
});

export default ModalItem;