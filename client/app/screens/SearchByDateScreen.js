import React, { useEffect } from 'react';
import { Appearance, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { localHost } from '../localhost.js';

const SearchByDateScreen = props => {
    const [newDate, setNewDate] = React.useState("");
    const [conDate, setConDate] = React.useState("");
    const [searchResult, setSearchResult] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const colorScheme = Appearance.getColorScheme()
    const isDarkMode = colorScheme === 'dark';

    useEffect(()=>{
        console.log('newDate: '+newDate);
        console.log('conDate: '+conDate);
    }); 

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirmDate = (date) => {
        setNewDate(date);
        convertDatetime(date, 'date');
        console.log("new date: ", date);
        hideDatePicker();
    };

    const convertDatetime = (datetime, type) => {
        if (type === 'date') {
            let convertedDate = moment(datetime).format("YYYY-MM-DD");
            let currentYear = convertedDate.substring(0, 4);
            let currentMonth = convertedDate.substring(5, 7);
            let currentDay = convertedDate.substring(8, 10);
            setConDate(currentMonth + '/' + currentDay + '/' + currentYear);
        } else if (type === 'startTime') {
            let convertedTime = moment(datetime).format("HH:mm");
            setConStartTime(convertedTime);
        } else if (type === 'endTime') {
            let convertedTime = moment(datetime).format("HH:mm");
            setConEndTime(convertedTime);
        }
    };

    const handleFormSubmit = () => {
        const searchURL = localHost+"/api/calendar/propose?date=" + moment(newDate).format('YYYY-MM-DD');
        console.log(searchURL);
        fetch(searchURL)
            .then(res => res.json())
            .then(res => {
                // this.addInputTimes(res);
                console.log(res);
                setSearchResult(res);
                props.navigation.navigate('DateResults', {
                    searchResults: res
                });
            })
            .catch(err => console.log(err));
    };

    return (
        <View style={styles.container}>
            <View>
                <TouchableWithoutFeedback onPress={showDatePicker}>
                    <View style={styles.viewInput}>
                        {newDate !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{conDate}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>Date</Text>}
                    </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                    textColor={isDarkMode ? 'white' : 'black'}
                />
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleFormSubmit}>
                <Text style={[styles.baseText, styles.searchButtonText]}>SEARCH</Text>
            </TouchableOpacity>

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
    searchButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    searchButtonText: {
        fontSize: 16,
        color: 'white',
    },
    viewInput: {
        height: 60,
        width: 180,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    viewInputText: {
        color: 'lightgrey'
    },
    viewInputText2: {
        color: 'black',
        fontWeight: "300"
    },
});

export default SearchByDateScreen;