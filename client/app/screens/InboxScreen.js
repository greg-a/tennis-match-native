import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Dimensions, RefreshControl } from 'react-native';
import { localHost } from '../localhost.js';
import { handleTimeStamp } from '../../utils/handleTimeStamp';
import io from 'socket.io-client';

const socket = io(localHost);

const { width, height } = Dimensions.get('window');

const Item = ({ title, sender, timestamp, read, onPress, senderId, myUserId }) => (
    <TouchableOpacity style={styles.message} onPress={onPress}>
        {/* <Text style={read === true ? styles.senderTextRead : styles.senderTextUnread}>{sender}</Text>
        <Text style={read === true ? styles.messageTextRead : styles.messageTextUnread}>{title}</Text>
        <Text style={read === true ? styles.timeStampRead : styles.timeStampUnread}>{timestamp}</Text> */}
        <Text style={read === true || senderId === myUserId ? styles.senderTextRead : styles.senderTextUnread}>{sender}</Text>
        <Text style={read === true || senderId === myUserId ? styles.messageTextRead : styles.messageTextUnread}>{title}</Text>
        <Text style={read === true || senderId === myUserId ? styles.timeStampRead : styles.timeStampUnread}>{timestamp}</Text>
    </TouchableOpacity>
);

const InboxScreen = props => {
    const [myUserId, setMyUserId] = useState();
    const [myUsername, setMyUsername] = useState();
    const [inboxMessages, setInboxMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
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
            .then((res) => {
                const messages = res.results;
                let newArr = [];
                let existing = [];
                messages.forEach(message => {
                    if (!(existing.includes(message.senderId) && existing.includes(message.recipientId))) {
                        newArr.push(message);
                        existing.push(message.senderId, message.recipientId);
                    };
                });
                setInboxMessages(newArr);
                socket.emit('newMatchNotification', res.myUserId);
                console.log("inbox messages: " + JSON.stringify(newArr[0]));
            })
            .catch(err => console.log(err));
    };

    const renderItem = ({ item }) => (
        <Item
            title={item.message}
            sender={item.senderId == myUserId ? item.recipient.username : item.User.username}
            senderId={item.senderId}
            myUserId={myUserId}
            timestamp={handleTimeStamp(item.createdAt)}
            read={item.read}
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
                            searchType: 'message'
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
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
    senderTextUnread: {
        fontSize: 18,
        // fontWeight: 'bold'
    },
    senderTextRead: {
        fontSize: 18
    },
    messageTextUnread: {
        fontSize: 15,
        marginTop: 3,
        color: 'black',
        fontWeight: 'bold'
    },
    messageTextRead: {
        fontSize: 15,
        marginTop: 3,
        color: 'grey'
    },
    timeStampUnread: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginRight: 10,
        color: 'black',
        fontWeight: 'bold'
    },
    timeStampRead: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginRight: 10,
        color: 'grey'
    },
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