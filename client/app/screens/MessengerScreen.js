import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import io from 'socket.io-client';
import { handleTimeStamp } from '../../utils/handleTimeStamp';
import { localHost } from '../localhost.js';
import { createRoom } from '../../utils/createRoom';
import { AuthContext } from './../../context';
import * as Notifications from 'expo-notifications';

const socket = io(localHost);

const Item = ({ title, sender, timestamp }) => (
    <View style={styles.message}>
        <Text style={styles.senderText}>{sender}</Text>
        <Text style={styles.messageText}>{title}</Text>
        <Text style={styles.timeStamp}>{timestamp}</Text>
    </View>
);

const MessengerScreen = props => {
    const recipientId = props.route.params.recipientId;
    const recipientUsername = props.route.params.recipientUsername;
    const myUserId = props.route.params.myUserId;
    const myUsername = props.route.params.myUsername;
    const updateInbox = props.route.params.getMessages;
    const thisRoom = createRoom(myUserId, recipientId);
    const [recId, updateRecId] = useState(recipientId);
    const [messages, setMessages] = useState();
    const [newMessage, setNewMessage] = useState();

    const { pushToken } = React.useContext(AuthContext);

    const renderItem = ({ item }) => (
        <Item title={item.message} sender={item.User.username} timestamp={handleTimeStamp(item.createdAt)} />
    );

    useEffect(() => {
        getMessages(recipientId);
        connectToSocket();
        console.log("my push token: " + pushToken)
    }, []);

    const getMessages = recipient => {
        fetch(localHost + "/api/conversation/" + recipient)
            .then(res => res.json())
            .then((messages) => {

                props.navigation.setOptions({ title: recipientUsername });
                setMessages(messages);
            })
            .catch(err => console.log(err));
    };

    const connectToSocket = () => {
        socket.emit('joinRoom', { username: myUsername, room: thisRoom, userId: myUserId });

        socket.on("output", data => {
            data.createdAt = new Date();
            data.id = new Date();
            console.log("socket data: " + JSON.stringify(data));
            if (data.senderId == recipientId || data.recipientId == recipientId) {
                setMessages(oldMessages => [data, ...oldMessages]);
                updateInbox();
            };
        });

        return () => {
            socket.disconnect()
        };
    };

    const triggerNotificationHandler = () => {
        // Notifications.scheduleNotificationAsync({
        //     content: {
        //         title: 'So Refreshed',
        //         body: 'You refreshed the feed screen!',
        //     },
        //     trigger: {
        //         seconds: 1
        //     }
        // })
        // fetch('https://exp.host/--/api/v2/push/send', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Accept-Encoding': 'gzip, deflate',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         to: 
        //     })
        // })
    };

    const handleMessageSend = () => {
        if (newMessage !== '') {
            socket.emit("input", {
                User: {
                    username: myUsername
                },
                message: newMessage,
                room: thisRoom,
                senderId: myUserId,
                recipientId: recipientId,
                recipient: recipientUsername
            });

            fetch(localHost + "/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: newMessage,
                    secondUser: recipientId,
                    read: false
                })
            })
                .then(res => {
                    console.log("Your message was sent!");
                })
                .catch(err => console.log(err));
            setNewMessage("")
        };
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messagesContainer}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                inverted={true}
            />
            <View style={styles.sendMessageContainer}>
                <TextInput
                    style={styles.sendMessage}
                    placeholder="Type a message"
                    multiline={true}
                    onChangeText={setNewMessage}
                    value={newMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend} disabled={newMessage === '' ? true : false}>
                    <Text>SEND</Text>
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
        backgroundColor: '#6CE631',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        width: 50
    }
});

export default MessengerScreen;