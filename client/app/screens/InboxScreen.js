import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { localHost } from '../localhost.js';
import { handleTimeStamp } from '../../utils/handleTimeStamp';

const Item = ({ title, sender, timestamp, onPress }) => (
    <TouchableOpacity style={styles.message} onPress={onPress}>
        <Text style={styles.senderText}>{sender}</Text>
        <Text style={styles.messageText}>{title}</Text>
        <Text style={styles.timeStamp}>{timestamp}</Text>
    </TouchableOpacity>
);

const InboxScreen = props => {
    const [myUserId, setMyUserId] = useState();
    const [myUsername, setMyUsername] = useState();
    const [inboxMessages, setInboxMessages] = useState([]);

    useEffect(() => {
        getProfileInfo();
        getMessages();
    }, []);

    const getProfileInfo = () => {
        fetch(localHost + "/api/profile")
            .then(res => res.json())
            .then((profileInfo) => {
                setMyUserId(profileInfo.id);
                setMyUsername(profileInfo.username);
            })
            .catch(err => console.log(err));
    };

    const getMessages = () => {
        fetch(localHost + "/api/messages")
            .then(res => res.json())
            .then((messages) => {
                let newArr = [];
                let existing = [];
                messages.forEach(message => {
                    if (!(existing.includes(message.senderId) && existing.includes(message.recipientId))) {
                        newArr.push(message);
                        existing.push(message.senderId, message.recipientId);
                    };
                });
                setInboxMessages(newArr);
            })
            .catch(err => console.log(err));
    };

    const renderItem = ({ item }) => (
        <Item
            title={item.message}
            sender={item.senderId == myUserId ? item.recipient.username : item.User.username}
            timestamp={handleTimeStamp(item.createdAt)}
            onPress={() => props.navigation.navigate('Messenger', {
                recipientId: item.senderId == myUserId ? item.recipientId : item.senderId,
                recipientUsername: item.senderId == myUserId ? item.recipient.username : item.User.username,
                myUserId: myUserId,
                myUsername: myUsername,
                getMessages: getMessages
            })}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messagesContainer}
                data={inboxMessages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.sendMessageContainer}>
                <TouchableOpacity
                    style={styles.sendMessage}
                    onPress={() => props.navigation.navigate('User Search', {
                        myUserId: myUserId,
                        myUsername: myUsername,
                        searchType: 'message',
                        getMessages: getMessages
                    })}
                >
                    <Text style={{ color: 'grey' }}>Search for user</Text>
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
        borderTopColor: 'white',
        borderWidth: .5,
        padding: 16
    },
    senderText: {
        fontSize: 18
    },
    messageText: {
        fontSize: 12,
        marginTop: 3,
        color: 'grey'
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
        justifyContent: 'center',
        height: 40,
        width: '80%',
        borderRadius: 30,
        paddingLeft: 10
    },
    sendMessageContainer: {
        flexDirection: 'row',
        marginLeft: 10,
        justifyContent: 'space-around'
    }
});

export default InboxScreen;