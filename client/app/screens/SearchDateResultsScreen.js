import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SearchDateCard from '../components/SearchDateCard';
import moment from "moment";
import { googleMapsAPI } from '../localhost.js';

const SearchDateResultsScreen = ({ route, navigation }) => {
    // params being passed from Search By Date Screen
    const [searchResults, setSearchResults] = React.useState(route.params.searchResults);
    const [showMap, setShowMap] = React.useState(false);
    const [mapLocation, setMapLocation] = React.useState();
    const [selectedEventIndex, setSelectedEventIndex] = React.useState();

    useEffect(() => {
        console.log('Search Result Arr: ' + route.params.searchResults);
        // setSearchResults(route.params.searchResults);
    }, []);

    useEffect(() => {
        console.log('searchResults: ' + JSON.stringify(searchResults));
    });

    const handleClick = (index) => {
        const eventObj = searchResults[index];

        setSelectedEventIndex(index)
        
        navigation.navigate('ProposeDate', {
            eventObj: eventObj,
        });
    };

    const handleSeeMap = (index) => {
        setSelectedEventIndex(index)
        setShowMap(!showMap);
    };

    const handleSelectEvent = (index) => {
        setShowMap(false);
        
        if (index === selectedEventIndex) {
            setSelectedEventIndex();
        }
        else {
            setSelectedEventIndex(index);
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                {searchResults.length>0 ?
            searchResults.map((event, i) => (
                <SearchDateCard
                    key={i}
                    title={event.title}
                    username={event.User.username}
                    userFirstname={event.User.firstname}
                    userLastname={event.User.lastname}
                    profilePic={event.User.profilePic}
                    userSkill={event.User.skilllevel}
                    eventLocation={event.location}
                    eventLat={event.latitude}
                    eventLng={event.longitude}
                    eventVicinity={event.vicinity}
                    date={moment(event.start).format("MM/DD/YYYY")}
                    starttime={moment(event.start).format("h:mm a")}
                    endtime={moment(event.end).format("h:mm a")}
                    eventIndex={i}
                    handleClick={handleClick}
                    seeMapClick={handleSeeMap}
                    mapLocation={event.location === 'any' ? `https://maps.googleapis.com/maps/api/staticmap?center=${event.latitude},${event.longitude}&zoom=10&size=400x300&maptype=roadmap&key=${googleMapsAPI}` : `https://maps.googleapis.com/maps/api/staticmap?center=${event.latitude},${event.longitude}&markers=color:blue%7Clabel:C%7C${event.latitude},${event.longitude}&zoom=13&size=400x300&maptype=roadmap&key=${googleMapsAPI}`}
                    showMap={showMap}
                    selectedEvent={selectedEventIndex}
                    handleSelectEvent={handleSelectEvent}
                />
            )) : <Text>No dates</Text>}

                {/* <SearchDateCard
                    key={0}
                    title={'Casual'}
                    username={'Long Very Long Name here, so long long long'}
                    userFirstname={'event.User.firstname'}
                    userLastname={'event.User.lastname'}
                    userSkill={'event.User.skilllevel'}
                    eventLocation={'event.location'}
                    starttime={'12:00 pm'}
                    endtime={'12:00 AM'}
                /> */}

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    baseText: {
        fontSize: 16
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
});

export default SearchDateResultsScreen;