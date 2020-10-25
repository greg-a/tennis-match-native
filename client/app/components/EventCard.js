import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const EventCard = props => {
    return (
        <View style={styles.eventItem}>
            <TouchableOpacity onLongPress={props.onSelectEvent}>
                <View>
                    <View style={{ ...styles.eventRow, ...styles.eventHeader }}>
                        <ImageBackground source={{ uri: props.image }} style={styles.bgImage}>
                            <View style={styles.titleContainer}>
                                <Text lines={1} style={styles.title}>{props.title}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{ ...styles.eventRow, ...styles.eventDetail }} >
                        <Text>Start: {props.start}</Text>
                        <Text>End: {props.end}</Text>
                        <Text>Status: {props.status}</Text>
                    </View>
                    <View style={{ ...styles.eventRow, ...styles.eventDetail }} >
                        <Text>{props.players}</Text>
                        <Text>{props.location}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    eventItem: {
        height: 200,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 20
    },
    eventRow: {
        flexDirection: 'row'
    },
    eventHeader: {
        height: '75%'
    },
    eventDetail: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bgImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    titleContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 5,
        paddingHorizontal: 12
    },
    title: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    }
});

export default EventCard;