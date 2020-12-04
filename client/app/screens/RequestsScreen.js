import React, { useEffect, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, FlatList, RefreshControl, Button, SafeAreaView } from 'react-native';
import ModalItem from '../components/ModalItem';
import RequestCard from '../components/RequestCard.js';
import moment from "moment";
import { localHost, googleMapsAPI } from '../localhost.js';

const RequestsScreen = props => {

    const [searchResults, setSearchResults] = React.useState([]);
    const [userid, setUserid] = React.useState("");
    const [refreshing, setRefreshing] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState();
    const [courtLocations, setCourtLocations] = React.useState([]);

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
                console.log("search results: " + JSON.stringify(res.results))
            })
            .catch(err => console.log(err));
    };

    const handleSelectCourt = (court) => {
        const eventObj = searchResults[selectedEvent];
        const updateObj = {id: eventObj.id, location: court.label, vicinity: court.vicinity, latitude: court.lat, longitude: court.lng};

        fetch(localHost + "/api/calendar/requests/location", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
        .then(res => {
            Alert.alert(
                "Success!",
                "Location was updated.",
                [{
                    text: "OK",
                    onPress: getRequests()
                }]
            );
        })
        .catch(err => console.log(err))
    };

    const handleSelectEvent = (index) => {
        const eventObj = searchResults[index];
        const locationQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${eventObj.latitude},${eventObj.longitude}&radius=20000&keyword=tennis%20court&key=${googleMapsAPI}`;

        if (index === selectedEvent) {
            setSelectedEvent();
        }
        else {
            setSelectedEvent(index);

            if (eventObj.location === 'any') {
                fetch(locationQuery)
                    .then(res => res.json())
                    .then(courts => {
                        console.log("courts query: " + JSON.stringify(locationQuery))
                        let courtSearch = [];

                        courts.results.forEach((court, i) => {
                            courtSearch.push({
                                key: i + 2,
                                label: court.name,
                                vicinity: court.vicinity,
                                lat: court.geometry.location.lat,
                                lng: court.geometry.location.lng,
                                component: <ModalItem title={court.name} subtitle={`near ${court.vicinity}`} />
                            })
                        })
                        setCourtLocations(courtSearch);
                    })
                    .catch(err => console.log(err));
            }
        };
    };

    const handleConfirm = (index) => {
        console.log("event index: " + index)
        const eventObj = searchResults[index];
        const eventId = eventObj.id;
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
                Alert.alert(
                    "Success!",
                    "The match was confirmed.",
                    [{
                        text: "OK",
                        // onPress: () => navigation.navigate('Feed')
                    }],
                    // { cancelable: false }
                );
                fetch(localHost + "/api/overlap/destroy", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(confirmedEventInfo)
                })
                    .then(res => {
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
        const eventObj = searchResults[index];
        const eventId = eventObj.id;

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
                Alert.alert(
                    "Confirmed",
                    "You have denied the request.",
                    [{
                        text: "OK",
                        // onPress: () => navigation.navigate('Feed')
                    }],
                    // { cancelable: false }
                );
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
                // title: 'TennisMatch',
                body: 'New Match Confirmation'
            })
        })
    };

    const renderItem = ({ item, index }) => (
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
            eventIndex={index}
            selectedEvent={selectedEvent}
            handleSelectEvent={handleSelectEvent}
            courtLocations={courtLocations}
            handleCourt={handleSelectCourt}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {searchResults.length > 0 ?
                <FlatList
                    contentContainerStyle={{ paddingBottom: 50 }}
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
                <View>
                    <Text>No Requests</Text>
                    <Button title='Refresh' onPress={getRequests} />
                </View>
            }
        </SafeAreaView>
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