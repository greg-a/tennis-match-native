import React, { useState } from 'react';
import moment from 'moment';
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { eventSeed } from '../../data/ProfileData';
import EventCard from '../components/EventCard';

const CalendarScreen = props => {
    let today = moment(new Date()).format('YYYY-MM-DD');
    const [selectedDate, setSelectedDate] = useState(today);
    let eventView = eventSeed.filter(match => moment(match.start).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'));

    return (
        <ScrollView>
            <CalendarStrip
                scrollable
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#8dfc9c' }}
                style={{ height: 120, paddingTop: 30, paddingBottom: 0 }}
                calendarHeaderStyle={{ color: 'white', fontSize: 20 }}
                highlightDateNumberStyle={{ color: 'white' }}
                highlightDateNameStyle={{ color: 'white' }}
                calendarColor={Platform.OS === 'android' ? 'rgb(108,230,49)' : ''}
                dateNumberStyle={{ color: Platform.OS === 'android' ? 'white' : 'black' }}
                dateNameStyle={{ color: Platform.OS === 'android' ? 'white' : 'black' }}
                iconContainer={{ flex: 0.1 }}
                useIsoWeekday={false}
                selectedDate={today}
                onDateSelected={date => setSelectedDate(date)}
            />
            {eventView.length > 0 ? eventView.map((item, i) => (
                    <EventCard 
                        key={i}
                        title={item.title}
                        start={moment(item.start).format('hh:mm a')}
                        end={moment(item.end).format('hh:mm a')}
                        status={item.eventStatus}
                        image='https://photoresources.wtatennis.com/photo-resources/2019/08/15/dbb59626-9254-4426-915e-57397b6d6635/tennis-origins-e1444901660593.jpg?width=1200&height=630'
                    />
            )) : <Text style={styles.text}>No Events</Text>}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Text style={[styles.baseText, styles.buttonText]}>Create Event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Text style={[styles.baseText, styles.buttonText]}>Find Match</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

CalendarScreen.navigationOptions = navData => {
    return {
        headerTitle: () => (
            <CalendarStrip
                scrollable
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#8dfc9c' }}
                style={{ height: 100, paddingTop: 5, paddingBottom: 0 }}
                calendarHeaderStyle={{ color: 'white', fontSize: 20 }}
                highlightDateNumberStyle={{ color: 'white' }}
                highlightDateNameStyle={{ color: 'white' }}
                calendarColor={Platform.OS === 'android' ? 'rgb(108,230,49)' : ''}
                dateNumberStyle={{ color: 'white' }}
                dateNameStyle={{ color: 'white' }}
                iconContainer={{ flex: 0.1 }}
                useIsoWeekday={false}
                onDateSelected={(date) => {
                    selDate = date;
                    console.log(selDate)
                }}
            />
        ),
        headerStyle: { height: 150, backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : '' },
        headerShown: false
    };
};

const styles = StyleSheet.create({
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

export default CalendarScreen;