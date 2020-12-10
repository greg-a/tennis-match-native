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
                                <Text lines={1} style={styles.title}>{props.title}: {props.location}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{ ...styles.eventRow, ...styles.eventDetail }} >
                        <Text>Start: {props.start}</Text>
                        <Text>End: {props.end}</Text>
                    </View>
                    <View style={{ ...styles.eventRow, ...styles.eventDetail }} >
                        <Text>Invited: {props.players ? props.players : 'public'}</Text>
                        <Text>Status: {props.status}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    eventItem: {
        height: 180,
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3
    },
    eventRow: {
        flexDirection: 'row',
        paddingLeft: 5,
        paddingRight: 5
    },
    eventHeader: {
        height: '75%'
    },
    eventDetail: {
        paddingHorizontal: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        // paddingRight: 40,
        // paddingLeft: 15
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