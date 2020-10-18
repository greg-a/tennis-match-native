import React from 'react';
import { View, Text, Platform } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

const CalendarScreen = props => {
    return (
        <View>
            <Text>Test</Text>
        </View>
    );
};

CalendarScreen.navigationOptions = navData => {
    return {
        headerTitle: (
            <CalendarStrip
            scrollable
            calendarAnimation={{ type: 'sequence', duration: 30 }}
            daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#8dfc9c' }}
            style={{ height: 100, paddingTop: 5, paddingBottom: 0 }}
            calendarHeaderStyle={{ color: 'white', fontSize:20 }}
            highlightDateNumberStyle={{ color: 'white' }}
            highlightDateNameStyle={{ color: 'white' }}
            calendarColor={'rgb(108,230,49)'}
            dateNumberStyle={{ color: 'white' }}
            dateNameStyle={{ color: 'white' }}
            iconContainer={{ flex: 0.1 }}
            useIsoWeekday={false}
        /> 
        ),
        headerStyle: { height: 150, backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : '' }
    };
};

export default CalendarScreen;