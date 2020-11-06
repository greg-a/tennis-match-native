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
        fetch(localHost+"/api/calendar/requests")
            .then(res => res.json())
            .then(res => {
                setSearchResults(res.results);
                setUserid(res.userid);
            })
            .catch(err => console.log(err));
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {searchResults.length>0 ?
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
                    // handleClick={handleClick}
                />
            ))
             : <Text>No dates</Text>}
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