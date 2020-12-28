import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    SafeAreaView,
    Platform,
    Dimensions,
    NativeModules
}
    from 'react-native';
import io from 'socket.io-client';
import { handleTimeStamp } from '../../utils/handleTimeStamp';
import { localHost } from '../localhost.js';
import { createRoom } from '../../utils/createRoom';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar, Accessory } from 'react-native-elements';

const socket = io(localHost);

const { width, height } = Dimensions.get('window');

// const Item = ({ title, sender, timestamp }) => (
//     <View style={styles.message}>
//         <Text style={styles.senderText}>{sender}</Text>
//         <Text style={styles.messageText}>{title}</Text>
//         <Text style={styles.timeStamp}>{timestamp}</Text>
//     </View>
// );

const { StatusBarManager } = NativeModules;

const MessengerScreen = props => {
    const recipientId = props.route.params.recipientId;
    const recipientUsername = props.route.params.recipientUsername;
    const recipientPushToken = props.route.params.recipientPushToken;
    const recipientPushEnabled = props.route.params.recipientPushEnabled;
    const myUserId = props.route.params.myUserId;
    const myUsername = props.route.params.myUsername;
    // const updateInbox = props.route.params.getMessages;
    const thisRoom = createRoom(myUserId, recipientId);
    const profilePic = props.route.params.profilePic;
    const [recId, updateRecId] = useState(recipientId);
    const [messages, setMessages] = useState();
    const [newMessage, setNewMessage] = useState();
    const [statusBarHeight, setStatusBarHeight] = useState(0);

    const renderItem = ({ item }) => {
        // <Item title={item.message} sender={item.User.username} timestamp={handleTimeStamp(item.createdAt)} />
        if (item.senderId == myUserId) {
            return (
                <View style={styles.rightMsg} >
                    <View style={styles.rightBlock}>
                        <Text style={styles.rightTxt}>{item.message}</Text>
                        <Text style={styles.rightTime}>{handleTimeStamp(item.createdAt)}</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={styles.leftMsg}>
                    <View style={styles.leftBlock}>
                        <Text style={styles.leftTxt}>{item.message}</Text>
                        <Text style={styles.leftTime}>{handleTimeStamp(item.createdAt)}</Text>
                    </View>
                </View>
            )
        }
    };

    const headerImageName = (username, userPic) => {
        return (
            <View style={styles.headerContent}>
                <View style={styles.avatarContainer}>
                    <Avatar
                        rounded
                        // onPress={openImagePickerAsync}
                        // title="MD"
                        title={username[0]}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={profilePic && { uri: "data:image/png;base64, " + profilePic }}
                        // style={{ width: 200, height: 200 }}
                        size="small"
                        activeOpacity={0.7}
                        overlayContainerStyle={{ backgroundColor: 'silver' }}

                    />
                </View>
                <View>
                    <Text style={styles.headerName}>{username}</Text>
                </View>

            </View>
        )

    }

    useEffect(() => {
        getMessages(recipientId);
        connectToSocket();
        console.log("line 111: " + profilePic);
        // setStatusBarHeight() {
        //     statusBarHeight = isIOS ? 20 : StatusBarManager.HEIGHT;
        //     if (isIOS) {
        //       // override guesstimate height with the actual height from StatusBarManager
        //       StatusBarManager.getHeight(data => (statusBarHeight = data.height));
        //     }
        // }
        if (Platform.OS === "ios") {
            console.log("is iOS");
            StatusBarManager.getHeight((statusBarFrameData) => {
                setStatusBarHeight(statusBarFrameData.height);
                console.log("statusBarFrameData: " + statusBarFrameData.height);
            });
        }

        return () => {
            socket.emit('unsubscribe', thisRoom)
        };
    }, []);

    useFocusEffect(useCallback(() => {
        let isActive = true;
        if (isActive) {
            updateNotifications(recipientId);
        };

        return () => {
            isActive = false;
        }
    }, []));

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
                props.navigation.setOptions({ headerTitle: headerImageName(recipientUsername, profilePic) });
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
                updateNotifications(recipientId);
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
                    // title: 'TennisMatch',
                    body: `Message from ${myUsername}`
                })
            });
            console.log("sent push notification to: " + recipientPushToken);
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

    // const keyboardVerticalOffset = Platform.OS === 'ios' ? 60 : 0

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""} style={styles.keyboardViewStyle} keyboardVerticalOffset={44 + statusBarHeight}>
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
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    keyboardViewStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ECECEB'
    },
    headerContent: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    avatarContainer: {
        padding: 5 
    },
    headerName: {
        color: 'white'
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
        // paddingBottom: 20
    },
    input: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        padding: 10,
        height: 40,
        width: width - 20,
        backgroundColor: '#fff',
        marginLeft: 10,
        marginRight: 10
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
    leftMsg: {
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
    leftBlock: {
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
        backgroundColor: '#f0f590',
        padding: 10,
        shadowColor: '#3d3d3d',
        shadowRadius: 2,
        shadowOpacity: 0.5,
        shadowOffset: {
            height: 1,
        },
    },
    leftTxt: {
        fontSize: 15,
        // color: '#555',
        fontWeight: '600',
    },
    rightTxt: {
        fontSize: 15,
        color: '#202020',
        fontWeight: '600',
    },
    leftTime: {
        color: 'grey',
    },
    rightTime: {
        color: '#b1b567'
    }
});

export default MessengerScreen;
