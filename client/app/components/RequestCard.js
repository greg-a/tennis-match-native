import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import FadeInOptions from '../components/FadeInOptions';
import FadeInMapView from '../components/FadeInMapView';

function skillConversion(skillLevel) {
    if (skillLevel === 1) {
        return "1.0-1.5 - New Player";
    } else if (skillLevel === 2) {
        return "2.0 - Beginner";
    } else if (skillLevel === 3) {
        return "2.5 - Beginner +";
    } else if (skillLevel === 4) {
        return "3.0 - Beginner-Intermediate";
    } else if (skillLevel === 5) {
        return "3.5 - Intermediate";
    } else if (skillLevel === 6) {
        return "4.0 - Intermediate-Advanced";
    } else if (skillLevel === 7) {
        return "4.5 - Advanced";
    }
};

function RequestCard(props) {
    const fadeAnim = useRef(new Animated.Value(250)).current;

    const expandContainer = () => {
        Animated.timing(fadeAnim, {
            toValue: 400,
            duration: 500,
            useNativeDriver: false
        }).start();
    };

    const collapseContainer = () => {
        Animated.timing(fadeAnim, {
            toValue: 250,
            duration: 0,
            useNativeDriver: false
        }).start();
    };

    return (
        <TouchableOpacity onPress={() => props.handleSelectEvent(props.eventIndex)} >
            <Animated.View style={[props.selectedEvent === props.eventIndex && { backgroundColor: '#d6f2b5' }, styles.container, { maxHeight: fadeAnim }]}>
                <View>
                    {!props.showMap || props.selectedEvent !== props.eventIndex ?
                        <View>
                            <Text style={styles.titleText}>
                                {props.title}
                            </Text>
                            <Text style={[styles.baseText, styles.subTitle]}>
                                {props.userFirstname ? `Username: ${props.username} (${props.userFirstname} ${props.userLastname})` : `Username: ${props.username}`}
                            </Text>
                            <Text style={[styles.baseText, styles.subTitle, styles.skillText]}>
                                Skill level: {props.userSkill ? `${skillConversion(props.userSkill)}` : `n/a`}
                            </Text>
                            <Text style={styles.baseText} numberOfLines={props.selectedEvent !== props.eventIndex ? 1 : 2}>
                                Court: {props.eventLocation}
                            </Text>
                            <Text style={styles.baseText}>
                                Date: {props.date}
                            </Text>
                            <Text style={styles.baseText}>
                                Start Time: {props.starttime}
                            </Text>
                            <Text style={styles.baseText}>
                                End Time: {props.endtime}
                            </Text>
                        </View>
                        :
                        <View>
                            <FadeInMapView
                                imageURL={props.mapLocation}
                                style={styles.bgImage}
                                eventLocation={props.eventLocation}
                                vicinity={props.eventVicinity}
                            />
                        </View>
                    }

                    {props.selectedEvent === props.eventIndex &&
                        <FadeInOptions
                            courtLocations={props.courtLocations}
                            showMap={props.showMap}
                            seeMapClick={props.seeMapClick}
                            eventIndex={props.eventIndex}
                            handleCourt={props.handleCourt}
                            handleClick={props.handleConfirm}
                            handleDeny={props.handleDeny}
                            expand={expandContainer}
                            collapse={collapseContainer}
                            primaryButton={'CONFIRM'}
                            selectCourt={props.eventLocation === 'any' ? true : false}
                        />
                    }
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    baseText: {
        fontSize: 16,
        paddingBottom: 2,
    },
    container: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 25
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
        // paddingLeft: 0,
    },
    skillText: {
        color: 'grey',
        paddingBottom: 6,
    },
    subTitle: {
        fontSize: 18,
    },
    titleText: {
        fontSize: 24,
        paddingBottom: 6
    },
    bgImage: {
        width: '95%',
        height: 192
    }
});

export default RequestCard;