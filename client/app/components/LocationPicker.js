import React, { useState } from 'react';
import { View, Button, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Modal } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const LocationPicker = props => {
    const [isFetching, setIsFetching] = useState(false);
    const [zipcode, setZipcode] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this function.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        try {
            setIsFetching(true);
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            props.handleLocation(location.coords.latitude, location.coords.longitude);
            console.log("coords: " + JSON.stringify(location))
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later or manually enter a zip code.',
                [{ text: 'Okay' }]
            );
        }
        setIsFetching(false);
    };
    
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.buttonContainer}>
                            {isFetching ? (
                                <ActivityIndicator size="large" color='black' />
                            ) : (
                                    <Button 
                                    title='Use current location' 
                                    onPress={getLocationHandler}
                                    />
                                )}
                        </View>
                        <Text>Or</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder='Enter ZIP'
                                keyboardType="numeric"
                                onChangeText={text => setZipcode(text)}
                                value={zipcode}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.button} onPress={props.cancelModal}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={props.handleSubmit}>
                                <Text style={styles.buttonText} onPress={() => props.handleZip(zipcode)}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    button: {
        paddingVertical: 15,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 5,
        width: 60,
        margin: 20,
        marginTop: 30
    },
    buttonText: {
        alignSelf: 'center'
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        fontSize: 20
    },
    inputContainer: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 15,
        width: '80%'
    },
    buttonContainer: {
        marginBottom: 15
    }
});

export default LocationPicker;