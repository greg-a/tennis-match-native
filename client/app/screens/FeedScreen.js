import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import FeedItem from '../components/FeedItem';
import { localHost } from '../localhost.js';

const FeedScreen = props => {
    const [confirmedMatches, setConfirmedMatches] = useState([]);
    const [updatedMatches, setUpdatedMatches] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getDates();
    }, []);

    useEffect(() => {
        getDates();
    }, []);

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

    return (

        <View style={styles.container}>
            {/* <Text>Feed</Text> */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {confirmedMatches > 0 ? confirmedMatches.map((item, i) => (
                    <FeedItem
                        organizer={item.User.username}
                        confirmer={item.secondUser.username}
                        month={item.start.substring(5, 7)}
                        day={item.start.substring(8, 10)}
                        hour={moment(item.start).format("h:mm a")}
                    />
                )) : <Text>no scheduled matches</Text>
                }


            </ScrollView>
        </View>


    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
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