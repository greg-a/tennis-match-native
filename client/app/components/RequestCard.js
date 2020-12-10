import React from 'react';
import { Linking, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

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
    return (
        <TouchableOpacity onPress={() => props.handleSelectEvent(props.eventIndex)} style={[props.selectedEvent === props.eventIndex && { backgroundColor: '#d6f2b5' }, styles.container]}>
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
                        <ImageBackground source={{ uri: props.mapLocation }} style={styles.bgImage} />
                    </View>
                }
                {props.selectedEvent === props.eventIndex &&
                    <View style={styles.rowContainer}>
                        {props.eventLocation === 'any' ?
                            <ModalSelector
                                data={props.courtLocations}
                                onChange={(option) => props.handleCourt(option)}>
                                <TextInput
                                    style={[styles.baseText, styles.linkText]}
                                    editable={false}
                                    value='SELECT COURT'
                                    multiline={true}
                                />
                            </ModalSelector>
                            :
                            <Text style={[styles.baseText, styles.linkText]}
                                onPress={() => props.handleConfirm(props.eventIndex)}
                            >
                                CONFIRM
                            </Text>
                        }
                        <Text
                            style={[styles.baseText, styles.linkText]}
                            onPress={() => props.seeMapClick(props.eventIndex)}
                        >
                            {props.showMap ? 'SEE DETAILS' : 'SEE MAP'}
                        </Text>
                        <Text style={[styles.baseText, styles.linkTextDeny]}
                            onPress={() => props.handleDeny(props.eventIndex)}
                        >
                            DENY
                        </Text>
                    </View>
                }
            </View>
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
        width: '90%'
    },
    linkText: {
        color: '#269bee',
        paddingTop: 10,
        marginRight: 30,
    },
    linkTextDeny: {
        color: '#f50057',
        paddingTop: 10,
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
        width: '100%',
        height: 200
    }
});

export default RequestCard;