import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, SafeAreaView, ScrollView, Platform, Alert, Button, Dimensions } from 'react-native';
import io from 'socket.io-client';
import { handleTimeStamp } from '../../utils/handleTimeStamp';
import { localHost } from '../localhost.js';
import { createRoom } from '../../utils/createRoom';

const socket = io(localHost);

const { width, height } = Dimensions.get('window');

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
    const recipientPushToken = props.route.params.recipientPushToken;
    const recipientPushEnabled = props.route.params.recipientPushEnabled;
    const myUserId = props.route.params.myUserId;
    const myUsername = props.route.params.myUsername;
    // const updateInbox = props.route.params.getMessages;
    const thisRoom = createRoom(myUserId, recipientId);
    const [recId, updateRecId] = useState(recipientId);
    const [messages, setMessages] = useState();
    const [newMessage, setNewMessage] = useState();

    const renderItem = ({ item }) => {
        // <Item title={item.message} sender={item.User.username} timestamp={handleTimeStamp(item.createdAt)} />
        if (item.senderId == myUserId) {
            return (
                <View style={styles.rightMsg} >
                    <View style={styles.rightBlock}>
                        <Text style={styles.rightTxt}>{item.message}</Text>
                    </View>
                </View>
            );
        }
        else {
            return (

                <View style={styles.eachMsg}>
                    <View style={styles.msgBlock}>
                        <Text style={styles.msgTxt}>{item.message}</Text>
                    </View>
                </View>
            )
        }
    };

    useEffect(() => {
        getMessages(recipientId);
        updateNotifications(recipientId);
        connectToSocket();

        return () => {
            socket.emit('unsubscribe', thisRoom)
        };
    }, []);

    const updateNotifications = id => {
        fetch(localHost + "/api/messages/read/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
    };

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
                if (data.senderId == recipientId || data.recipientId == recipientId) {
                    setMessages(oldMessages => [data, ...oldMessages]);
                    // updateInbox();
                };

                return () => {
                    socket.disconnect()
                }
            });
    };

    const triggerNotificationHandler = () => {
        if (recipientPushEnabled) {
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: recipientPushToken,
                    // data: {},
                    title: 'Message',
                    body: `Message from ${myUsername}`
                })
            })
        }
        else {
            console.log('recipient has push notifications disabled');
        }
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
                    triggerNotificationHandler();
                })
                .catch(err => console.log(err));
            setNewMessage('')
        };
    };

    const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0

    return (
        // <View style={styles.container}>
        //     <FlatList
        //         style={styles.messagesContainer}
        //         data={messages}
        //         renderItem={renderItem}
        //         keyExtractor={item => item.id.toString()}
        //         inverted={true}
        //     />
        //     <View style={styles.sendMessageContainer}>
        //         <TextInput
        //             style={styles.sendMessage}
        //             placeholder="Type a message"
        //             multiline={true}
        //             onChangeText={setNewMessage}
        //             value={newMessage}
        //         />
        //         <TouchableOpacity style={styles.sendButton} onPress={handleMessageSend} disabled={newMessage === '' ? true : false}>
        //             <Text>SEND</Text>
        //         </TouchableOpacity>
        //     </View>
        // </View>

        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView behavior="padding" style={styles.keyboard} keyboardVerticalOffset={keyboardVerticalOffset}>
                <FlatList
                    style={styles.list}
                    data={messages}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    inverted={true}
                />
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <TextInput
                            style={{ flex: 1 }}
                            value={newMessage}
                            onChangeText={setNewMessage}
                            onSubmitEditing={handleMessageSend}
                            multiline={true}
                            blurOnSubmit={false}
                            placeholder="Enter Text"
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleMessageSend}
                            disabled={newMessage === '' ? true : false}
                        >
                            <Text>SEND</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // justifyContent: 'flex-end'
    // },
    // message: {
    //     backgroundColor: 'white',
    //     borderColor: 'black',
    //     borderStyle: 'solid',
    //     borderWidth: .5,
    //     marginBottom: 5,
    //     borderRadius: 30,
    //     padding: 5,
    //     paddingLeft: 20,
    //     marginLeft: 5,
    //     width: '80%'
    // },
    // senderText: {
    //     fontSize: 12
    // },
    // messageText: {
    //     fontSize: 16,
    //     marginTop: 3
    // },
    // timeStamp: {
    //     fontSize: 12,
    //     alignSelf: 'flex-end',
    //     marginRight: 10,
    //     color: 'grey'
    // },
    // sendMessage: {
    //     borderColor: 'black',
    //     backgroundColor: 'white',
    //     justifyContent: 'flex-end',
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
    // sendMessageContainer: {
    //     height: 40,
    //     width: '100%',
    //     backgroundColor: '#fff',
    //     paddingLeft: 10,
    //     justifyContent: 'flex-end',
    //     color: '#fff'
    // },
    // sendButton: {
    //     backgroundColor: '#6CE631',
    //     padding: 5,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderRadius: 30,
    //     width: 50
    // },
    keyboard: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width,
        height,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        flexDirection: 'row',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        // margin: 10,
        paddingBottom: 20
    },
    input: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        padding: 10,
        height: 40,
        width: width - 20,
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        // shadowColor: '#3d3d3d',
        // shadowRadius: 2,
        // shadowOpacity: 0.5,
        // shadowOffset: {
        //     height: 1,
        // },
        // borderColor: '#696969',
        // borderWidth: 1,
    },
    eachMsg: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 5,
    },
    rightMsg: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        margin: 5,
        alignSelf: 'flex-end',
    },
    msgBlock: {
        width: 220,
        borderRadius: 5,
        backgroundColor: '#ffffff',
        padding: 10,
        shadowColor: '#3d3d3d',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
        },
    },
    rightBlock: {
        width: 220,
        borderRadius: 5,
        backgroundColor: 'rgb(233,245,174)',
        padding: 10,
        shadowColor: '#3d3d3d',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
        },
    },
    msgTxt: {
        fontSize: 15,
        color: '#555',
        fontWeight: '600',
    },
    rightTxt: {
        fontSize: 15,
        color: '#202020',
        fontWeight: '600',
    },
});

export default MessengerScreen;