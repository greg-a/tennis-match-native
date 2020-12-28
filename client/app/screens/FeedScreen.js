import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, FlatList, RefreshControl, Switch, Alert } from 'react-native';
import { HeaderButtons } from 'react-navigation-header-buttons';
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
    const [myMatches, setMyMatches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [bottomScrollCount, setBottomScrollCount] = useState(20);
    const [filterFeed, setFilterFeed] = useState(true);

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
    }, [bottomScrollCount]);

    useEffect(() => {
        if (updatedMatches.length > 0) {
            Alert.alert(
                updatedMatches[0].title,
                `Match that was scheduled for ${updatedMatches[0].start.substring(5 ,7)}/${updatedMatches[0].start.substring(8, 10)} at ${moment(updatedMatches[0].start).format("h:mm a")} was declined.`,
                [{ text: "OK", onPress: () => handleDeleteEvent(updatedMatches[0].id) }]
            );
        }
    }, [updatedMatches]);

    const handleDeleteEvent = id => {
        fetch(localHost + "/api/event/delete/" + id, {
            method: "DELETE"
        })
        .then(res => {
            console.log("event was deleted");
            const newUpdatedMatches = updatedMatches.filter(match => match.id != id);

            setUpdatedMatches(newUpdatedMatches);
        })
        .catch(err => console.log(err));
    };

    const toggleSwitch = () =>{
        setFilterFeed(previousState => !previousState);
    };

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons>
                    <Text style={{color: 'white', paddingRight: 10}}>{filterFeed ? 'Me' : 'Everyone'}</Text>
                    <Switch
                        style={{marginRight: 20}}
                        trackColor={{ false: "#767577", true: "#bbf7e7" }}
                        thumbColor={filterFeed ? "#24ad9d" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={filterFeed}
                    />
                </HeaderButtons>
            ),
        });
    }, [filterFeed]);

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
            .then((data) => {
                setConfirmedMatches(data.events);
                getMyDates(data.myUserId);
            })
            .catch(err => console.log(err));

        fetch(localHost + "/api/updates")
            .then(res => res.json())
            .then((dates) => {
                setUpdatedMatches(dates);
            })
            .catch(err => console.log(err));
    };

    const getMyDates = id => {
        fetch(localHost + '/api/confirmed/' + bottomScrollCount + '/' + id)
        .then(res => res.json())
        .then((data) => {
            setMyMatches(data.events);
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
                data={filterFeed ? myMatches : confirmedMatches}
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