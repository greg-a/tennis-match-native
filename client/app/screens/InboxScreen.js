import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Messages } from '../../data/ProfileData';
import { localHost } from '../localhost.js';

const Item = ({ title, sender, timestamp }) => (
    <View style={styles.message}>
        <Text style={styles.senderText}>{sender}</Text>
        <Text style={styles.messageText}>{title}</Text>
        <Text style={styles.timeStamp}>{timestamp}</Text>
    </View>
);

const InboxScreen = props => {
    const [myId, setMyId] = setState();

    useEffect(() => {
        getMessages();
    });

    const getMessages = () => {
        fetch(localHost + "/api/profile")
            .then(res => res.json())
            .then((profileInfo) => {
                setMyId(profileInfo.id);
            })
            .catch(err => console.log(err));

        fetch(localHost + "/api/messages")
            .then(res => res.json())
            .then((messages) => {
                let newArr = [];
                let existing = [];
                messages.forEach(message => {
                    if (!(existing.includes(message.senderId) && existing.includes(message.recipientId))) {
                        newArr.push(message);
                        existing.push(message.senderId, message.recipientId)
                    };
                });
                console.log("new array: " + JSON.stringify(newArr))
                console.log("existing array: " + existing)
            })
            .catch(err => console.log(err));
    };

    const renderItem = ({ item }) => (
        <Item title={item.message} sender={item.sender} timestamp={moment(item.createdAt).format('M/DD/YY h:mm a')} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messagesContainer}
                data={Messages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                inverted={true}
            />
            <View style={styles.sendMessageContainer}>
                <TextInput
                    style={styles.sendMessage}
                    placeholder="Search for user"
                    multiline={true}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => props.navigation.navigate('Messenger')}>
                    <Text>New</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    message: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: .5,
        marginBottom: 5,
        borderRadius: 30,
        padding: 5,
        paddingLeft: 20,
        marginLeft: 5,
        width: '80%'
    },
    senderText: {
        fontSize: 12
    },
    messageText: {
        fontSize: 16,
        marginTop: 3
    },
    timeStamp: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginRight: 10,
        color: 'grey'
    },
    sendMessage: {
        borderColor: 'black',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        height: 40,
        width: '80%',
        borderRadius: 30,
        paddingLeft: 10
    },
    sendMessageContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        justifyContent: 'space-around'
    },
    sendButton: {
        backgroundColor: 'green',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        width: 50
    }
});

export default InboxScreen;