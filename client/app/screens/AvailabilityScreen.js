import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Appearance, ScrollView, Alert, Button } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import moment from "moment";
import { playTypeData, eventTypeData } from '../../data/ProfileData';
import { localHost, googleMapsAPI } from '../localhost.js';
import ModalItem from '../components/ModalItem';
import LocationPicker from '../components/LocationPicker';
import io from 'socket.io-client';

const socket = io(localHost);

const AvailabilityScreen = props => {
    eventTypeData.forEach(item => item.component = <ModalItem title={item.label} subtitle={item.descripton} />);
    playTypeData.forEach(item => item.component = <ModalItem title={item.label} />);
    const initialTime = new Date();
    initialTime.setHours(initialTime.getHours() + 1);
    initialTime.setMinutes('00');
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
    const [recipientPushToken, setRecipientPushToken] = React.useState(null);
    const [recipientPushEnabled, setRecipientPushEnabled] = React.useState(false);
    const [currentCoordinates, setCurrentCoordinates] = React.useState({});
    const [initialEndTime, setInitialEndTime] = React.useState(initialTime);
    const [userInstructions, setUserInstructions] = React.useState("");
    const [modalVisible, setModalVisible] = React.useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = React.useState(false);

    const [isEndTimePickerVisible, setEndTimePickerVisibility] = React.useState(false);

    const colorScheme = Appearance.getColorScheme()
    const isDarkMode = colorScheme === 'dark';

    const formReset = () => {
        setUserInstructions("Fill out event details");
        setEventTitle("");
        setEventLocation("");
        setNewDate("");
        setConDate("");
        setStartTime("");
        setConStartTime("");
        setEndTime("");
        setConEndTime("");
        setRecipientId(null);
        setRecipientUsername("");
        setRecipientPushToken(null);
        setInitialEndTime(initialTime);
        setEventType("");
    };

    const handleFormSubmit = () => {
        const newStart = convertEventTime(startTime);
        const newEnd = convertEventTime(endTime);

        fetch(localHost + "/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: recipientId === null ? eventTitle : "Proposed - " + eventTitle,
                start: newStart,
                end: newEnd,
                eventStatus: recipientId === null ? "available" : "propose",
                location: eventLocation.label,
                vicinity: eventLocation.vicinity,
                latitude: eventLocation.lat,
                longitude: eventLocation.lng,
                confirmedByUser: recipientId
            })
        })
            .then(res => res.json())
            .then(res => {
                console.log("RESPONSE: " + JSON.stringify(res));
                if (res.statusString === "eventCreated") {
                    if (props.route.params) {
                        props.navigation.goBack();
                        if (recipientId) {
                            socket.emit('newMatchNotification', recipientId);
                        };
                    }
                    else {
                        Alert.alert(
                            "Success!",
                            "Your availability was posted",
                            [{ text: "OK", onPress: () => socket.emit('newMatchNotification', recipientId) }]
                        );
                        triggerNotificationHandler();
                        formReset();
                    };
                }
                else {
                    Alert.alert(
                        "Uh oh",
                        "Something went wrong. Make sure all fields are selected.",
                        [{ text: "OK" }]
                    );
                };
            }).catch(err => {
                Alert.alert(
                    "Uh oh",
                    "Something went wrong. Please Try Again.",
                    [{ text: "OK" }]
                );
            });
    };

    useEffect(() => {

        if (currentCoordinates.lat && currentCoordinates.lng) {
            getCourtData();
            setUserInstructions("Fill out event details");
        }
        else {
            getProfileLocation();
        };
        // console.log('eventTitle: ' + eventTitle);
        // console.log('eventLocation: ' + eventLocation);
        // console.log('newDate: ' + newDate);
        // console.log('conDate: ' + conDate);
        // console.log('startTime: ' + startTime);
        // console.log('conStartTime: ' + conStartTime);
        // console.log('endTime: ' + endTime);
        // console.log('conEndTime: ' + conEndTime);
        // console.log('-------------');
    }, [currentCoordinates]);

    const getProfileLocation = () => {
        fetch(localHost + '/api/profile')
            .then((response) => response.json())
            .then((res) => {
                if (res.lat && res.lng) {
                    setCurrentCoordinates({ lat: res.lat, lng: res.lng, vicinity: res.city });
                }
                else {
                    setUserInstructions("Enter your location for a list of nearby courts");
                }

            })
            .catch((error) => console.error(error))
    };

    const getCourtData = () => {
        const locationQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentCoordinates.lat},${currentCoordinates.lng}&radius=20000&keyword=tennis%20court&key=${googleMapsAPI}`;
        fetch(locationQuery)
            .then(res => res.json())
            .then(courts => {

                console.log("courts query: " + locationQuery)
                let courtSearch = [{ key: 1, label: 'any', vicinity: currentCoordinates.vicinity, component: <ModalItem title='any' subtitle='near me' />, lat: currentCoordinates.lat, lng: currentCoordinates.lng }];

                courts.results.forEach((court, i) => {
                    courtSearch.push({
                        key: i + 2,
                        label: court.name,
                        vicinity: court.vicinity,
                        lat: court.geometry.location.lat,
                        lng: court.geometry.location.lng,
                        component: <ModalItem title={court.name} subtitle={`near ${court.vicinity}`} />
                    })
                })
                setCourtLocations(courtSearch);
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
    };

    const setUserInfo = (id, username, token, enabled) => {
        setRecipientId(id);
        setRecipientUsername(username);
        setRecipientPushToken(token);
        setRecipientPushEnabled(enabled);
    };

    const getCurrentLocation = (lat, lng) => {
        setCurrentCoordinates({ lat: lat, lng: lng });
        setModalVisible(false);
    };

    const zipToCoordinates = zip => {
        const geocodeQuery = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${googleMapsAPI}`;

        fetch(geocodeQuery)
            .then(res => res.json())
            .then(res => {
                const geocodeCoordinates = res.results[0].geometry.location;
                const geocodeName = res.results[0].address_components[1].short_name;

                if (currentCoordinates.lat !== geocodeCoordinates.lat && currentCoordinates.lng !== geocodeCoordinates.lng) {
                    setCurrentCoordinates({ lat: geocodeCoordinates.lat, lng: geocodeCoordinates.lng, vicinity: geocodeName });
                };
                setModalVisible(false);
            })
            .catch(err => console.log(err))
    };

    const triggerNotificationHandler = () => {
        if (recipientPushEnabled) {
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: recipientPushToken,
                    // data: {},
                    // title: 'TennisMatch',
                    body: 'New Match Request'
                })
            })
        }
        else {
            console.log('recipient disabled push notifications');
        }
    };

    return (
        <ScrollView>
            <LocationPicker
                modalVisible={modalVisible}
                cancelModal={() => setModalVisible(false)}
                handleLocation={getCurrentLocation}
                handleZip={zipToCoordinates}
            />
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
                <View style={styles.locationButton}>
                    <Button title='Set Location' onPress={() => setModalVisible(true)} />
                </View>
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
                        // textColor={isDarkMode ? 'white' : 'black'}
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
                        // textColor={isDarkMode ? 'white' : 'black'}
                        headerTextIOS='Pick a time'
                        date={initialTime}
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
                        // textColor={isDarkMode ? 'white' : 'black'}
                        headerTextIOS='Pick a time'
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
                            placeholder={'Visibility'}
                            placeholderTextColor='grey'
                        />
                    </ModalSelector>
                </View>
                {eventType === 'Invite Only' ?
                    <View style={[styles.input]}>
                        <Text
                            style={{ color: recipientId === null ? 'lightgrey' : 'black', fontSize: 16 }}
                            onPress={() => props.navigation.navigate('User Search', { searchType: 'invite', setUserInfo: setUserInfo })}
                        >
                            {recipientUsername === '' ? 'Find User' : recipientUsername}
                        </Text>
                        {recipientId && 
                        <View style={styles.userClear}>
                            <Text 
                                style={[styles.userClearText]}
                                onPress={()=>{
                                    console.log('pressed');
                                    setRecipientId(null);
                                    setRecipientUsername("");
                                }}
                            >
                                X
                            </Text>
                        </View>
                        }
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
        justifyContent: 'space-around',
        marginBottom: 20
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
    locationButton: {
        marginTop: 10
    },
    userClear: {
        position: 'absolute',
        alignSelf: 'flex-end',
        paddingRight: 10,
        
    },
    userClearText: {
        color: 'red',
        fontSize: 24
    },
});

export default AvailabilityScreen;