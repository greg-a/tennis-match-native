import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { localHost } from '../localhost.js';

const { width, height } = Dimensions.get('window');

const Item = ({ username, name, onPress }) => (
    <TouchableOpacity style={styles.searchResultContainer} onPress={onPress}>
        <Text style={styles.usernameText}>{username}</Text>
        <Text style={styles.nameText}>{name}</Text>
    </TouchableOpacity>
);

const UserSearchScreen = props => {
    const myUserId = props.route.params ? props.route.params.myUserId : '';
    const myUsername = props.route.params ? props.route.params.myUsername : '';
    const getMessages = props.route.params ? props.route.params.getMessages : '';
    const searchType = props.route.params.searchType;
    const setUserInfo = props.route.params.setUserInfo;
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
            onPress={searchType === 'message' ? () => props.navigation.replace('Messenger', {
                recipientId: item.id,
                recipientUsername: item.username,
                pushToken: item.pushToken,
                pushEnabled: item.pushEnabled,
                myUserId: myUserId,
                myUsername: myUsername,
                getMessages: getMessages
            })
                :
                () => {
                    setUserInfo(item.id, item.username, item.pushToken, item.pushEnabled);
                    props.navigation.goBack();
                }
            }
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.input}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for user"
                        multiline={true}
                        onChangeText={handleUserSearch}
                        onKeyPress={handleUserSearchClear}
                        autoFocus={true}
                    />
                </View>
            </View>
            <FlatList
                style={styles.messagesContainer}
                data={userSearchList}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            {/* <View style={styles.searchInputContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for user"
                    multiline={true}
                    onChangeText={handleUserSearch}
                    onKeyPress={handleUserSearchClear}
                    autoFocus={true}
                />
            </View> */}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    searchResultContainer: {
        backgroundColor: 'white',
        // borderColor: 'black',
        // borderStyle: 'solid',
        // borderTopColor: 'white',
        // borderWidth: .5,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    usernameText: {
        fontSize: 18
    },
    nameText: {
        fontSize: 12,
        marginTop: 3,
        color: 'grey'
    },
    searchInput: {
        borderColor: 'black',
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        height: 40,
        width: '80%',
        borderRadius: 30,
        paddingLeft: 10
    },
    searchInputContainer: {
        alignItems: 'center'
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

export default UserSearchScreen;