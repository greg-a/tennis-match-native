import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import FeedItem from '../components/FeedItem';
import { localHost } from '../localhost.js';
import { AuthContext } from './../../context';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true        
        };
    }
});

const FeedScreen = props => {
    const [confirmedMatches, setConfirmedMatches] = useState([]);
    const [updatedMatches, setUpdatedMatches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { handlePushToken } = React.useContext(AuthContext);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getDates();
    }, []);

    useEffect(() => {
        getNotificationPermission();
        getDates();
    }, []);

    // useEffect(() => {
    //     console.log(JSON.stringify(confirmedMatches));
    // });

    // example of a notification
    const triggerNotificationHandler = () => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: 'So Refreshed',
                body: 'You refreshed the feed screen!',
            },
            trigger: {
                seconds: 1
            }
        })
    };

    const getNotificationPermission = () => {
        Permissions.getAsync(Permissions.NOTIFICATIONS)
        .then((statusObj) => {
            if (statusObj.status !== 'granted') {
                return Permissions.askAsync(Permissions.NOTIFICATIONS)
            }
            return statusObj;
        })
        .then((statusObj) => {
            if (statusObj.status !== 'granted') {
                throw new Error('Permission not granted!');
            }
        })
        .then(() => {
            console.log("getting token");
            return Notifications.getExpoPushTokenAsync();
        })
        .then(response => {
            const token = response.data;
            handlePushToken(token);
        })
        .catch((err) => {
            return null;
        });
    };

    const getDates = () => {
        fetch(localHost + '/api/confirmed')
            .then(res => res.json())
            .then((dates) => {
                setConfirmedMatches(dates);
                console.log("Confirmed matches: " + dates);
            })
            .catch(err => console.log(err));

        fetch(localHost + "/api/updates")
            .then(res => res.json())
            .then((dates) => {
                setUpdatedMatches(dates);
                console.log("Updated matches: " + dates)
            })
            .catch(err => console.log(err));
    };

    const renderItem = ({ item }) => {

        if (confirmedMatches.length > 0) {
            return (
                <View style={styles.container}>
                    <FeedItem
                        organizer={item.User.username}
                        confirmer={item.secondUser.username}
                        month={item.start.substring(5, 7)}
                        day={item.start.substring(8, 10)}
                        hour={moment(item.start).format("h:mm a")}
                    />
                </View>
            )
        }

        else {
            return (
                <Text>no scheduled matches</Text>
            )
        }
    }

    return (

        <View style={styles.container}>
            <FlatList
                data={confirmedMatches}
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


        // {confirmedMatches.length > 0 ? confirmedMatches.map((item, i) => (
        //         <FeedItem
        //             key={i}
        //             organizer={item.User.username}
        //             confirmer={item.secondUser.username}
        //             month={item.start.substring(5, 7)}
        //             day={item.start.substring(8, 10)}
        //             hour={moment(item.start).format("h:mm a")}
        //         />
        //     )) : <Text>no scheduled matches</Text>
        //     }


    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 15
    },
    text: {
        fontSize: 20,
        alignSelf: 'center',
        margin: 50
    }
});

export default FeedScreen;