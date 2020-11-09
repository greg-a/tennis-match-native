import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RequestCard from '../components/RequestCard.js';
import moment from "moment";
import { localHost } from '../localhost.js';

const RequestsScreen = props => {

    const [searchResults, setSearchResults] = React.useState([]);
    const [userid, setUserid] = React.useState("");

    useEffect(() => {
        getRequests();
    }, []);

    getRequests = () => {
        fetch(localHost + "/api/calendar/requests")
            .then(res => res.json())
            .then(res => {
                setSearchResults(res.results);
                setUserid(res.userid);
            })
            .catch(err => console.log(err));
    }

    handleConfirm = (index) => {
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
                        getRequests();
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err));
    };

    handleDeny = (index) => {
        const eventObj = searchResults[index];
        const eventId = eventObj.id;

        const updateObj = {
            id: eventId
        }

        fetch(localHost+"/api/event/deny", {
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

    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {searchResults.length > 0 ?
                    searchResults.map((event, i) => (
                        <RequestCard
                            key={i}
                            title={event.title}
                            username={event.User.username}
                            userFirstname={event.User.firstname}
                            userLastname={event.User.lastname}
                            userSkill={event.User.skilllevel}
                            eventLocation={event.location}
                            date={moment(event.start).format("MM/DD/YYYY")}
                            starttime={moment(event.start).format("hh:mm a")}
                            endtime={moment(event.end).format("hh:mm a")}
                            eventIndex={i}
                            handleConfirm={handleConfirm}
                            handleDeny={handleDeny}
                        />
                    ))
                    : <Text>No Requests</Text>}
            </View>
        </ScrollView>
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