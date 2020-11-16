import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const FeedItem = props => {
    return (
        <View style={styles.feedItem}>
            <TouchableOpacity onLongPress={props.onSelectEvent}>
                <View>
                    <View>
                        <Text style={styles.feedText}><Text style={styles.feedNames}>{props.organizer}</Text> scheduled a match with <Text style={styles.feedNames}>{props.confirmer} </Text>on {props.month}/{props.day} at {props.hour}.</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    feedItem: {
        height: 100,
        width: '100%',
        backgroundColor: '#f5f5f5',
        // borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        overflow: 'hidden',
        marginTop: 0
    },
    feedText: {
        fontSize: 15,
        // paddingLeft: 5,
        // paddingRight: 5
    },
    feedNames: {
        fontWeight: 'bold',
    }
});

export default FeedItem;