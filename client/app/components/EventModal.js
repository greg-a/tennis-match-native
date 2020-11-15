import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';

const EventModal = props => {
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
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text>{props.subtitle}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={props.getDirections}>
                                <Text style={styles.buttonText}>Get Directions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.buttonText}>Edit Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={props.deleteEvent}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.cancelContainer} onPress={props.cancelModal}>
                            <Text style={styles.buttonText, styles.cancelButton}>Cancel</Text>
                        </TouchableOpacity>
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
    titleContainer: {
        marginBottom: 5,
        alignItems: 'center'
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        paddingTop: 25,
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
        marginTop: 8,
        width: 130
    },
    buttonText: {
        color: '#269bee',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18,
        borderColor: 'black'
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
    buttonContainer: {
        borderColor: '#e0e0e0',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        width: 165,
        marginTop: 15,
        alignItems: 'center'
    },  
    cancelContainer: {
        marginTop: 5,
        alignItems: 'center',
        padding: 10
    },
    cancelButton: {
        color: 'red'
    }
});

export default EventModal;