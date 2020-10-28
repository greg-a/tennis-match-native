import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { localHost } from '../localhost.js';
import { handleTimeStamp } from '../../utils/handleTimeStamp';

// user list: [{"username":"Patrick","firstname":null,"lastname":null,"id":2}]

const Item = ({ username, name, onPress }) => (
    <TouchableOpacity style={styles.message} onPress={onPress}>
        <Text style={styles.senderText}>{username}</Text>
        <Text style={styles.messageText}>{name}</Text>
    </TouchableOpacity>
);

const UserSearchScreen = props => {
    const myUserId = props.route.params.myUserId;
    const myUsername = props.route.params.myUsername;
    const [userSearchList, setUserList] = useState();

    const handleUserSearch = search => {
        fetch(localHost + "/api/username?username=" + search)
            .then(res => res.json())
            .then((users) => {
                setUserList(users);
                console.log("user list: " + JSON.stringify(users))
            })
            .catch(err => console.log(err));
    };

    const handleUserSearchClear = () => {
        setUserList([]);
    };

    const renderItem = ({ item }) => (
        <Item
            username={`@${item.username}`}
            name={`${item.firstname === null ? '' : item.firstname} ${item.lastname === null ? '' : item.lastname}`}
            onPress={() => props.navigation.navigate('Messenger', {
                recipientId: item.id,
                recipientUsername: item.username,
                myUserId: myUserId,
                myUsername: myUsername
            })}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.messagesContainer}
                data={userSearchList}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            <View style={styles.sendMessageContainer}>
                <TextInput
                    style={styles.sendMessage}
                    placeholder="Search for user"
                    multiline={true}
                    onChangeText={handleUserSearch}
                    onKeyPress={handleUserSearchClear}
                    autoFocus={true}
                />
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

export default UserSearchScreen;