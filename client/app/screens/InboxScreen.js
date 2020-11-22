import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { localHost } from '../localhost.js';
import { handleTimeStamp } from '../../utils/handleTimeStamp';

const { width, height } = Dimensions.get('window');

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
    }, []);

    useFocusEffect(useCallback(() => {
        let isActive = true;
        if (isActive) {
            getMessages();
        };

        return () => {
            isActive = false;
        }
    }, []));

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
                recipientPushToken: item.senderId == myUserId ? item.recipient.pushToken : item.User.pushToken,
                recipientPushEnabled: item.senderId == myUserId ? item.recipient.pushEnabled : item.User.pushEnabled,
                myUserId: myUserId,
                myUsername: myUsername
            })}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.input}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
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
            <FlatList
                style={styles.messagesContainer}
                data={inboxMessages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            {/* <View style={styles.sendMessageContainer}>
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
            </View> */}
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
        // borderColor: 'black',
        // borderStyle: 'solid',
        // borderTopColor: 'white',
        // borderWidth: .5,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
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
    // sendMessage: {
    //     borderColor: 'black',
    //     backgroundColor: 'white',
    //     justifyContent: 'center',
    //     height: 40,
    //     width: '80%',
    //     borderRadius: 30,
    //     paddingLeft: 10
    // },
    // sendMessageContainer: {
    //     flexDirection: 'row',
    //     marginLeft: 10,
    //     justifyContent: 'space-around'
    // },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        // margin: 10,
        // paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    input: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        padding: 10,
        height: 40,
        width: width - 20,
        backgroundColor: '#fff',
        margin: 10,
        // marginLeft: 10,
        // marginRight: 10,
        // marginBottom: 10,
        // shadowColor: '#3d3d3d',
        // shadowRadius: 2,
        // shadowOpacity: 0.5,
        // shadowOffset: {
        //     height: 1,
        // },
        // borderColor: '#696969',
        // borderWidth: 1,
    },
});

export default InboxScreen;