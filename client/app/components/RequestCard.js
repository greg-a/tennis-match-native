import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

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
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {props.title}
            </Text>
            <Text style={[styles.baseText, styles.subTitle]}>
                {props.userFirstname ? `Username: ${props.username} (${props.userFirstname} ${props.userLastname})` : `Username: ${props.username}`}
            </Text>
            <Text style={[styles.baseText, styles.subTitle, styles.skillText]}>
                Skill level: {props.userSkill ? `${skillConversion(props.userSkill)}` : `n/a`}
            </Text>
            <Text style={styles.baseText}>
                Court Location: {props.eventLocation}
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
            <View style={styles.rowContainer}>
                {/* {props.eventLocation === 'any' ?
                    <Text style={[styles.baseText, styles.linkText]}
                        onPress={() => props.handleLocation(props.eventIndex)}
                    >
                        Choose Location
                    </Text>
                    :
                    <Text style={[styles.baseText, styles.linkText]}
                        onPress={() => props.handleConfirm(props.eventIndex)}
                    >
                        CONFIRM
                    </Text>
                } */}
                <Text style={[styles.baseText, styles.linkText]}
                    onPress={() => props.handleConfirm(props.eventIndex)}
                >
                    CONFIRM
                    </Text>
                <Text style={[styles.baseText, styles.linkTextDeny]}
                    onPress={() => props.handleDeny(props.eventIndex)}
                >
                    DENY
                </Text>
            </View>
        </View>
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
        width: '90%',
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
    }
});

export default RequestCard;