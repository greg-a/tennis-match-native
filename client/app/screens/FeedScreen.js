import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import FeedItem from '../components/FeedItem';
import { localHost } from '../localhost.js';
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
    const [bottomScrollCount, setBottomScrollCount] = useState(20);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getDates();
    }, []);

    useEffect(() => {
        getNotificationPermission();
    }, []);

    useEffect(() => {
        getDates();
    }, [bottomScrollCount])

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
            const token = { pushToken: response.data, pushEnabled: true };
            
            fetch(localHost + "/api/profileupdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(token)
            })
            .then(res => {
                console.log('token was saved')
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch((err) => {
            return null;
        });
    };

    const getDates = () => {
        fetch(localHost + '/api/confirmed/' + bottomScrollCount)
            .then(res => res.json())
            .then((dates) => {
                setConfirmedMatches(dates);
            })
            .catch(err => console.log(err));

        fetch(localHost + "/api/updates")
            .then(res => res.json())
            .then((dates) => {
                setUpdatedMatches(dates);
            })
            .catch(err => console.log(err));
    };

    const handleBottomScroll = () => {
        setBottomScrollCount(bottomScrollCount + 20);
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
                        organizerPic={item.User.profilePic}
                        confirmerPic={item.secondUser.profilePic}
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
                onScrollEndDrag={handleBottomScroll}
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