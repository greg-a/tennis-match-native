import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FadeInOptions from '../components/FadeInOptions';
import FadeInMapView from '../components/FadeInMapView';
import { Avatar } from 'react-native-elements';

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

function SearchDateCard(props) {
    const fadeAnim = useRef(new Animated.Value(280)).current;

    const expandContainer = () => {
        Animated.timing(fadeAnim, {
            toValue: 400,
            duration: 500,
            useNativeDriver: false
        }).start();
    };

    const collapseContainer = () => {
        Animated.timing(fadeAnim, {
            toValue: 280,
            duration: 0,
            useNativeDriver: false
        }).start();
    };

    return (
        <TouchableOpacity onPress={() => props.handleSelectEvent(props.eventIndex)}>
            <Animated.View style={[props.selectedEvent === props.eventIndex && { backgroundColor: '#d6f2b5' }, styles.container, { maxHeight: fadeAnim }]}>
                <View>
                    {!props.showMap || props.selectedEvent !== props.eventIndex ?
                        <View>
                            <Text style={styles.titleText}>
                                {props.title}
                            </Text>
                            <View style={styles.picAndUsername}>
                                <View style={styles.avatarContainer}>
                                    <Avatar
                                        rounded
                                        // onPress={openImagePickerAsync}
                                        // title="MD"
                                        // title={sender ? sender[0] : ''}
                                        icon={{ name: 'user', type: 'font-awesome' }}
                                        source={props.profilePic && { uri: "data:image/png;base64, " + props.profilePic }}
                                        // style={{ width: 200, height: 200 }}
                                        size="medium"
                                        activeOpacity={0.7}
                                        overlayContainerStyle={{ backgroundColor: 'silver' }}

                                    />
                                </View>
                                <View style={styles.usernameContainer}> 
                                    <Text style={[styles.baseText, styles.subTitle]}>
                                        {props.userFirstname ? `@${props.username} (${props.userFirstname} ${props.userLastname})` : `@${props.username}`}
                                    </Text>
                                </View>

                            </View>



                            <Text style={[styles.baseText, styles.subTitle]}>
                                Date: {props.date}
                            </Text>
                            <Text style={[styles.baseText, styles.subTitle, styles.skillText]}>
                                Skill level: {props.userSkill ? `${skillConversion(props.userSkill)}` : `n/a`}
                            </Text>
                            <Text style={styles.baseText} numberOfLines={props.selectedEvent !== props.eventIndex ? 1 : 2}>
                                Court Location: {props.eventLocation}
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
                </View>
                {props.selectedEvent === props.eventIndex &&
                    <FadeInOptions
                        showMap={props.showMap}
                        seeMapClick={props.seeMapClick}
                        eventIndex={props.eventIndex}
                        handleClick={props.handleClick}
                        expand={expandContainer}
                        collapse={collapseContainer}
                        primaryButton='PROPOSE MATCH'
                    />
                }
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
        width: '85%'
        // flex: 1
    },
    picAndUsername: {
        flexDirection: 'row'
    },
    avatarContainer: {
        flex: 1,
        alignSelf: 'center',
        padding: 10,
        marginRight: 20
    },
    usernameContainer: {
        flex: 5,
        alignSelf: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    linkText: {
        color: '#269bee',
        paddingTop: 10,
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
        height: 192
    }
});

export default SearchDateCard;