import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, TextInput, StyleSheet } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

const FadeInOptions = props => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false
        }).start();
    };

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
        }).start();
    };

    useEffect(() => {
        fadeIn();
        props.expand()
        return () => {
            fadeOut();
            props.collapse();
        }
    }, [])

    return (
        <Animated.View
            style={[
                styles.fadingContainer,
                {
                    opacity: fadeAnim
                }
            ]}
        >
            <View style={styles.buttonsContainer}>
                {props.selectCourt ?
                    <ModalSelector
                        data={props.courtLocations}
                        onChange={(option) => props.handleCourt(option)}>
                        <TextInput
                            style={styles.modalButton}
                            editable={false}
                            value='SELECT COURT'
                            multiline={true}
                        />
                    </ModalSelector>
                    :
                    <Text
                        style={[styles.baseText, styles.linkText]}
                        onPress={() => props.handleClick(props.eventIndex)}
                    >
                        {props.primaryButton}
                    </Text>
                }
                <Text
                    style={[styles.baseText, styles.linkText]}
                    onPress={() => props.seeMapClick(props.eventIndex)}
                >
                    {props.showMap ? 'SEE DETAILS' : 'SEE ON MAP'}
                </Text>
                {
                    props.handleDeny &&
                    <Text
                        style={[styles.baseText, styles.linkTextDeny]}
                        onPress={() => props.handleDeny(props.eventIndex)}
                    >
                        DENY
                </Text>
                }
            </View>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    baseText: {
        fontSize: 14,
        paddingBottom: 2,
    },
    linkText: {
        color: '#269bee',
        paddingTop: 10
    },
    linkTextDeny: {
        color: '#f50057',
        paddingTop: 10,
    },
    modalButton: {
        color: '#269bee',
        fontSize: 14,
        paddingTop: 6
    }
});

export default FadeInOptions;