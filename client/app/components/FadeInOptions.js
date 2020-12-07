import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

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
            duration: 0,
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
    },[])

    return (
            <Animated.View
                style={[
                    styles.fadingContainer,
                    {
                        // transform: [
                        //     {
                        //         opacity: fadeAnim
                        //     }
                        // ] 
                        opacity: fadeAnim
                    }
                ]}
            >
        <View style={styles.buttonsContainer}>
                <Text
                    style={[styles.baseText, styles.linkText]}
                    onPress={() => props.handleClick(props.eventIndex)}
                >
                    PROPOSE MATCH
                        </Text>
                <Text
                    style={[styles.baseText, styles.linkText]}
                    onPress={() => props.seeMapClick(props.eventIndex)}
                >
                    {props.showMap ? 'SEE DETAILS' : 'SEE ON MAP'}
                </Text>
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
        fontSize: 16,
        paddingBottom: 2,
    },
    linkText: {
        color: '#269bee',
        paddingTop: 10,
    }
});

export default FadeInOptions;