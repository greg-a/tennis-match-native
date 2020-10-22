import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Appearance } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from "moment";
import { playTypeData, courtLocationData } from '../../data/ProfileData';

const AvailabilityScreen = props => {
    const [eventTitle, setEventTitle] = React.useState("");
    const [eventLocation, setEventLocation] = React.useState("");
    const [newDate, setNewDate] = React.useState("");
    const [conDate, setConDate] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [conStartTime, setConStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [conEndTime, setConEndTime] = React.useState("");

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = React.useState(false);

    const [isEndTimePickerVisible, setEndTimePickerVisibility] = React.useState(false);

    const colorScheme = Appearance.getColorScheme()
    const isDarkMode = colorScheme === 'dark';

    
    const handleFormSubmit = () => {
        fetch("http://192.168.1.153:3001/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: eventTitle,
                start: startTime,
                end: endTime,
                eventStatus: "available",
                location: eventLocation
            })
        }).then(res => {
            console.log(res);
        })
    };
    
    useEffect(() => {
        console.log('eventTitle: ' + eventTitle);
        console.log('eventLocation: ' + eventLocation);
        console.log('newDate: ' + newDate);
        console.log('conDate: ' + conDate);
        console.log('startTime: ' + startTime);
        console.log('conStartTime: ' + conStartTime);
        console.log('endTime: ' + endTime);
        console.log('conEndTime: ' + conEndTime);
        console.log('-------------');
    });    

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

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true);
    };
    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false);
    };
    const handleConfirmStartTime = (time) => {
        setStartTime(time);
        convertDatetime(time, 'startTime');
        console.log("new start: ", time);
        hideStartTimePicker();
    };

    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true);
    };
    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };
    const handleConfirmEndTime = (time) => {
        setEndTime(time);
        convertDatetime(time, 'endTime');
        console.log("new end: ", time);
        hideEndTimePicker();
    };


    return (
        <View style={styles.container}>
            <Text style={styles.baseText}>Availability</Text>
            <View style={styles.instructions}>
                <Text style={[styles.baseText, styles.instructionsText]}>Please enter the following information to set your availability</Text>
            </View>
            <ModalSelector
                data={playTypeData}
                initValue='Play Type'
                onChange={(option) => setEventTitle(option.label)}>
                <TextInput
                    style={styles.input}
                    editable={false}
                    value={eventTitle}
                    placeholder={'Play Type'}
                placeholderTextColor={'lightgrey'}
                />
            </ModalSelector>
            <ModalSelector
                data={courtLocationData}
                initValue='Court Location'
                onChange={(option) => setEventLocation(option.label)}>
                <TextInput
                    style={styles.input}
                    editable={false}
                    value={eventLocation}
                    placeholder={'Court Location'}
                placeholderTextColor={'lightgrey'}
                />
            </ModalSelector>

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
                    textColor={isDarkMode ? 'white':'black'}
                />
            </View>

            <View>
                <TouchableWithoutFeedback onPress={showStartTimePicker}>
                    <View style={styles.viewInput}>
                        {startTime !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{moment(startTime).format("hh:mm A")}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>Start Time</Text>}
                    </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                    isVisible={isStartTimePickerVisible}
                    mode="time"
                    onConfirm={handleConfirmStartTime}
                    onCancel={hideStartTimePicker}
                    textColor={isDarkMode ? 'white':'black'}
                />
            </View>

            <View>
                <TouchableWithoutFeedback onPress={showEndTimePicker}>
                    <View style={styles.viewInput}>
                        {endTime !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{moment(endTime).format("hh:mm A")}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>End Time</Text>}
                    </View>
                </TouchableWithoutFeedback>
                <DateTimePickerModal
                    isVisible={isEndTimePickerVisible}
                    mode="time"
                    onConfirm={handleConfirmEndTime}
                    onCancel={hideEndTimePicker}
                    textColor={isDarkMode ? 'white':'black'}
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                <Text style={[styles.baseText, styles.submitButtonText]}>SUBMIT</Text>
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
    input: {
        height: 60,
        width: 180,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        fontWeight: '300',
        // marginBottom: 20,
        paddingLeft: 10,
        color: 'black'
    },
    instructions: {
        width: '80%',
        alignItems: 'center'
    },
    instructionsText: {
        textAlign: 'center',
    },
    submitButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    submitButtonText: {
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

export default AvailabilityScreen;