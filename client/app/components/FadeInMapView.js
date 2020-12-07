import React, { useRef, useEffect, useState } from 'react';
import { Animated, Image, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import EventModal from '../components/EventModal';

const FadeInOptions = props => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false
        }).start();
    };

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: false
        }).start();
    };

    useEffect(() => {
        fadeIn();
        return () => {
            fadeOut();
        }
    }, []);

    const handleGetDirections = () => {
        const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${props.lat},${props.lng}`;
        const label = props.eventLocation;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    };

    return (
            <Animated.View
                style={[
                    styles.fadingContainer,
                    {
                        opacity: fadeAnim
                    }
                ]}
            >
                <EventModal
                cancelModal={() => setModalVisible(false)}
                getDirections={handleGetDirections}
                modalVisible={modalVisible}
                title={props.eventLocation}
                subtitle={`near ${props.vicinity}`}
            />
                <TouchableOpacity
                    style={styles.buttonsContainer}
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        source={{ uri: props.imageURL }}
                        style={props.style}
                    />
                </TouchableOpacity>
            </Animated.View>
    )
};

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default FadeInOptions;