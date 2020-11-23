import React, { useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native';
import RequestCard from '../components/RequestCard.js';
import moment from "moment";
import { localHost } from '../localhost.js';

const RequestsScreen = props => {

    const [searchResults, setSearchResults] = React.useState([]);
    const [userid, setUserid] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        getRequests();
    }, []);

    const wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(1000).then(() => setRefreshing(false));
        getRequests();
    }, []);

    const getRequests = () => {
        fetch(localHost + "/api/calendar/requests")
            .then(res => res.json())
            .then(res => {
                setSearchResults(res.results);
                setUserid(res.userid);
            })
            .catch(err => console.log(err));
    }

    const handleConfirm = (index) => {
        const eventId = index;
        const eventStart = eventObj.start;
        const eventEnd = eventObj.end;
        const eventTitle = eventObj.title;
        const titleArr = (eventTitle).split("-");
        const updateObj = {
            id: eventId,
            title: "Confirmed -" + titleArr[1]
        };
        const recipientPushToken = eventObj.User.pushToken;
        const recipientPushEnabled = eventObj.User.pushEnabled;

        // console.log(JSON.stringify(updateObj));

        const confirmedEventInfo = {
            id: eventId,
            start: eventStart,
            end: eventEnd
        };

        // console.log(JSON.stringify(confirmedEventInfo));

        fetch(localHost + "/api/calendar/requests", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
            .then(res => {
                fetch(localHost + "/api/overlap/destroy", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(confirmedEventInfo)
                })
                    .then(res => {
                        // Do we need this?
                        // socket.emit("newMatchNotification", this.state.userid);
                        console.log(JSON.stringify(res));

                        if (recipientPushEnabled) {
                            triggerNotificationHandler(recipientPushToken);
                        }
                        else {
                            console.log('recipient disabled push notifications');
                        };

                        getRequests();
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err));
    };

    const handleDeny = (index) => {
        const eventId = index;

        const updateObj = {
            id: eventId
        }

        fetch(localHost + "/api/event/deny", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
            .then(res => {
                // Do we need this?
                // socket.emit("newMatchNotification", this.state.userid);
                getRequests();
            })
            .catch(err => console.log(err));
    };

    const triggerNotificationHandler = (recipientPushToken) => {
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
                title: 'Match Confirmation',
                body: 'New Match Confirmation'
            })
        })
    };

    const renderItem = ({ item }) => (
        <RequestCard
            title={item.title}
            username={item.User.username}
            userFirstname={item.User.firstname}
            userLastname={item.User.lastname}
            userSkill={item.User.skilllevel}
            eventLocation={item.location}
            date={moment(item.start).format("MM/DD/YYYY")}
            starttime={moment(item.start).format("hh:mm a")}
            endtime={moment(item.end).format("hh:mm a")}
            handleConfirm={handleConfirm}
            handleDeny={handleDeny}
            eventIndex={item.id}
        />
    );

    return (
        <View style={styles.container}>
            {searchResults.length > 0 ?
                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                :
                <Text>No Requests</Text>
            }
        </View>
    );

};

const styles = StyleSheet.create({
    baseText: {
        fontSize: 16
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
});

export default RequestsScreen;