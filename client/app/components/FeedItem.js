import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const FeedItem = props => {
    return (
        <View style={styles.feedItem}>
            <TouchableOpacity onLongPress={props.onSelectEvent}>
                <View>
                    <View>
                        <Text>{props.organizer} scheduled a match with {props.confirmer}
                        on {props.month}/{props.day} at {props.hour}.</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    feedItem: {
        height: 200,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 0
    },
});

export default EventCard;