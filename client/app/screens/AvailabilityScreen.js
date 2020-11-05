import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Appearance, ScrollView } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from "moment";
import { playTypeData, eventTypeData } from '../../data/ProfileData';
import { localHost, googleMapsAPI } from '../localhost.js';
import ModalItem from '../components/ModalItem';


const AvailabilityScreen = props => {
    eventTypeData.forEach(item => item.component = <ModalItem title={item.label} />);
    playTypeData.forEach(item => item.component = <ModalItem title={item.label} />);
    const initialTime = new Date();
    initialTime.setHours(initialTime.getHours() + 1);
    const [eventTitle, setEventTitle] = React.useState("");
    const [eventType, setEventType] = React.useState("");
    const [eventLocation, setEventLocation] = React.useState("");
    const [courtLocations, setCourtLocations] = React.useState([]);
    const [newDate, setNewDate] = React.useState("");
    const [conDate, setConDate] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [conStartTime, setConStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [conEndTime, setConEndTime] = React.useState("");
    const [recipientId, setRecipientId] = React.useState(null);
    const [recipientUsername, setRecipientUsername] = React.useState("");
    const [currentLat, setCurrentLat] = React.useState("39.953");
    const [currentLng, setCurrentLng] = React.useState("-75.166");
    const [userInstructions, setUserInstructions] = React.useState('Select event details');
    const [initialEndTime, setInitialEndTime] = React.useState(initialTime);

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = React.useState(false);

    const [isEndTimePickerVisible, setEndTimePickerVisibility] = React.useState(false);

    const locationQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLat},${currentLng}&radius=20000&keyword=tennis%20court&key=${googleMapsAPI}`;
    const colorScheme = Appearance.getColorScheme()
    const isDarkMode = colorScheme === 'dark';

    const handleFormSubmit = () => {
        const newStart = convertEventTime(startTime);
        const newEnd = convertEventTime(endTime);
        console.log("new start: " + newStart)
        fetch(localHost + "/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: eventTitle,
                start: newStart,
                end: newEnd,
                eventStatus: recipientId === null ? "available" : "propose",
                location: eventLocation.label,
                latitude: eventLocation.lat,
                longitude: eventLocation.lng,
                confirmedByUser: recipientId
            })
        }).then(res => {
            res.json();
            if (props.route.params) {
                props.route.params.updateCalendar();
                props.navigation.goBack();
            }
        }).catch(err => console.log(err))
    };

    useEffect(() => {
        getCourtData();
        // console.log('eventTitle: ' + eventTitle);
        // console.log('eventLocation: ' + eventLocation);
        // console.log('newDate: ' + newDate);
        // console.log('conDate: ' + conDate);
        // console.log('startTime: ' + startTime);
        // console.log('conStartTime: ' + conStartTime);
        // console.log('endTime: ' + endTime);
        // console.log('conEndTime: ' + conEndTime);
        // console.log('-------------');
    }, []);

    const getCourtData = () => {
        fetch(locationQuery)
            .then(res => res.json())
            .then(courts => {
                let courtSearch = [{ key: 1, label: 'any', component: <ModalItem title='any' subtitle='near Philadelphia' />, lat: currentLat, lng: currentLng }];
                courts.results.forEach((court, i) => {
                    courtSearch.push({
                        key: i + 2,
                        label: court.name,
                        lat: court.geometry.location.lat,
                        lng: court.geometry.location.lng,
                        component: <ModalItem title={court.name} subtitle={`near ${court.vicinity}`} />
                    })
                })
                setCourtLocations(courtSearch)
            })
            .catch(err => console.log(err))
    };

    const convertEventTime = time => {
        let currentYear = moment(newDate).format().substring(0, 4);

        let currentMonth = moment(newDate).format().substring(5, 7);
        let currentMonthAdj = parseInt(currentMonth) - 1;

        let currentDay = moment(newDate).format().substring(8, 10);
        let currentHour = parseInt(moment(time).format('HH'));
        let currentMinute = parseInt(moment(time).format('mm'));
        let convertedEventTime = new Date(parseInt(currentYear), currentMonthAdj, parseInt(currentDay), currentHour, currentMinute);
        console.log(convertedEventTime);
        return convertedEventTime;
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

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirmDate = (date) => {
        hideDatePicker();
        setNewDate(date);
        convertDatetime(date, 'date');
        console.log("new date: ", date);
    };

    const showStartTimePicker = () => {
        setStartTimePickerVisibility(true);
    };
    const hideStartTimePicker = () => {
        setStartTimePickerVisibility(false);
    };
    const handleConfirmStartTime = (time) => {
        hideStartTimePicker();
        setStartTime(time);
        setInitialEndTime(time);
        convertDatetime(time, 'startTime');
        console.log("new start: ", time);
    };

    const showEndTimePicker = () => {
        setEndTimePickerVisibility(true);
    };
    const hideEndTimePicker = () => {
        setEndTimePickerVisibility(false);
    };
    const handleConfirmEndTime = (time) => {
        hideEndTimePicker();
        setEndTime(time);
        convertDatetime(time, 'endTime');
        console.log("new end: ", time);
    };

    const setUserInfo = (id, username) => {
        setRecipientId(id);
        setRecipientUsername(username);
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.instructions}>
                    <Text style={[styles.baseText, styles.instructionsText]}>{userInstructions}</Text>
                </View>
                <ModalSelector
                    data={playTypeData}
                    initValue='Play Type'
                    onChange={(option) => setEventTitle(option.label)}
                >
                    <TextInput
                        style={styles.input}
                        editable={false}
                        value={eventTitle}
                        placeholder={'Play Type'}
                        placeholderTextColor='grey'
                    />
                </ModalSelector>
                <ModalSelector
                    data={courtLocations}
                    initValue='Court Location'
                    onChange={(option) => setEventLocation(option)}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        value={eventLocation.label}
                        placeholder={'Court Location'}
                        placeholderTextColor='grey'
                        multiline={true}
                    />
                </ModalSelector>
                <View>
                    <TouchableWithoutFeedback onPress={showDatePicker}>
                        <View style={styles.input}>
                            {newDate !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{conDate}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>Date</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmDate}
                        onCancel={hideDatePicker}
                        textColor={isDarkMode ? 'white' : 'black'}
                        date={props.route.params ? new Date(props.route.params.selectedDate) : new Date()}
                    />
                </View>

                <View>
                    <TouchableWithoutFeedback onPress={showStartTimePicker}>
                        <View style={styles.input}>
                            {startTime !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{moment(startTime).format("hh:mm A")}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>Start Time</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmStartTime}
                        onCancel={hideStartTimePicker}
                        textColor={isDarkMode ? 'white' : 'black'}
                        date={new Date(initialTime.setMinutes('00'))}
                    />
                </View>

                <View>
                    <TouchableWithoutFeedback onPress={showEndTimePicker}>
                        <View style={styles.input}>
                            {endTime !== "" ? <Text style={[styles.baseText, styles.viewInputText2]}>{moment(endTime).format("hh:mm A")}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>End Time</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        onConfirm={handleConfirmEndTime}
                        onCancel={hideEndTimePicker}
                        textColor={isDarkMode ? 'white' : 'black'}
                        date={initialEndTime}
                    />
                </View>
                <View>
                    <ModalSelector
                        data={eventTypeData}
                        initValue='Event Type'
                        onChange={(option) => {
                            setEventType(option.label);
                            setUserInstructions(option.instructions);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={eventType}
                            placeholder={'Event Type'}
                            placeholderTextColor='grey'
                        />
                    </ModalSelector>
                </View>
                {eventType === 'Private' ?
                    <View style={styles.input}>
                        <Text
                            style={{ color: recipientId === null ? 'lightgrey' : 'black', fontSize: 16 }}
                            onPress={() => props.navigation.navigate('User Search', { searchType: 'invite', setUserInfo: setUserInfo })}
                        >
                            {recipientUsername === '' ? 'Find User' : recipientUsername}
                        </Text>
                    </View> : null
                }
                <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
                    <Text style={[styles.baseText, styles.submitButtonText]}>SUBMIT</Text>
                </TouchableOpacity>
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
    input: {
        height: 60,
        width: 180,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        fontSize: 16,
        fontWeight: '300',
        marginTop: 10,
        paddingLeft: 10,
        color: 'black',
        justifyContent: 'center'
    },
    instructions: {
        width: '80%',
        alignItems: 'center',
        marginTop: 20
    },
    instructionsText: {
        textAlign: 'center',
    },
    submitButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 25
    },
    submitButtonText: {
        fontSize: 16,
        color: 'white'
    },
    viewInputText: {
        color: 'grey'
    },
    viewInputText2: {
        color: 'black',
        fontWeight: "300"
    },
});

export default AvailabilityScreen;