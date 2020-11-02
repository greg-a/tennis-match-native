import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SearchDateCard from '../components/SearchDateCard';
import SearchByDateScreen from './SearchByDateScreen';
import moment from "moment";

const SearchDateResultsScreen = ({ route, navigation }) => {
    const [searchResults, setSearchResults] = React.useState(route.params.searchResults);

    useEffect(() => {
        console.log('Search Result Arr: ' + route.params.searchResults);
        // setSearchResults(route.params.searchResults);
    }, []);

    useEffect(() => {
        console.log('searchResults: ' + searchResults);
    })

    const handleClick = (index)=>{
        const eventObj = searchResults[index];
        
        navigation.navigate('ProposeDate', {
            eventObj: eventObj,
        });
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
                    userSkill={event.User.skilllevel}
                    eventLocation={event.location}
                    starttime={moment(event.start).format("hh:mm a")}
                    endtime={moment(event.end).format("hh:mm a")}
                    eventIndex={i}
                    handleClick={handleClick}
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