import React, { useState } from 'react';
import moment from 'moment';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { eventSeed } from '../../data/ProfileData';

const CalendarScreen = props => {
    let today = moment(new Date()).format('YYYY-MM-DD');
    const [selectedDate, setSelectedDate] = useState(today);
    let eventView = eventSeed.filter(match => moment(match.start).format('YYYY-MM-DD') === moment(selectedDate).format('YYYY-MM-DD'));

    return (
        <View>
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
                <View>
                    <Text>{item.title}</Text>
                    <Text>Start: {moment(item.start).format('hh:mm a')}</Text>
                    <Text>End: {moment(item.end).format('hh:mm a')}</Text>
                    <Text>Status: {item.eventStatus}</Text>
                </View>
            )) : <Text>No Events</Text>}
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
        </View>
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
        padding: 100
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18
    }
});

export default CalendarScreen;