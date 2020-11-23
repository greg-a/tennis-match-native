import React, { useEffect } from 'react';
import { Appearance, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ModalSelector from 'react-native-modal-selector';
import { Skills } from '../../data/ProfileData';
import moment from "moment";
import ModalItem from '../components/ModalItem';
import { localHost, googleMapsAPI } from '../localhost.js';
import LocationPicker from '../components/LocationPicker';

const SearchByDateScreen = props => {
    const [newDate, setNewDate] = React.useState();
    const [conDate, setConDate] = React.useState("");
    const [searchResult, setSearchResult] = React.useState("");
    const [skillLevel, setSkillLevel] = React.useState();
    const [skillLabel, setSkillLabel] = React.useState();
    const [recipientId, setRecipientId] = React.useState(null);
    const [recipientUsername, setRecipientUsername] = React.useState("");
    const [userInstructions, setUserInstructions] = React.useState("Search for other players' availability with the filters below.");
    const [warningText, setWarningText] = React.useState(false);

    const [eventLocation, setEventLocation] = React.useState();
    const [courtLocations, setCourtLocations] = React.useState([]);
    const [currentCoordinates, setCurrentCoordinates] = React.useState({});
    const [modalVisible, setModalVisible] = React.useState(false);

    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

    const colorScheme = Appearance.getColorScheme()
    const isDarkMode = colorScheme === 'dark';

    const skillsArr = [];

    Skills.forEach(skill => {
        skillsArr.push({
            component: <ModalItem title={skill.label} />,
            key: skill.key,
            value: skill.value,
            label: skill.label
        })
    });

    useEffect(() => {
        console.log('newDate: ' + newDate);
        console.log('conDate: ' + conDate);
        console.log('skill level: ' + skillLevel);
        console.log('recip id: ' + recipientId);
        console.log('recip username: ' + recipientUsername);
    });

    // useEffect(() => {

    //     if (currentCoordinates.lat && currentCoordinates.lng) {
    //         getCourtData();
    //         setUserInstructions("Fill out event details");
    //     }
    //     else {
    //         getProfileLocation();
    //     };
    // }, [currentCoordinates]);

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

    const setUserInfo = (id, username, token, enabled) => {
        setRecipientId(id);
        setRecipientUsername(username);
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

    const handleFormSubmit = () => {
        if (!newDate && !skillLevel && !recipientId && !eventLocation) {
            setWarningText(true);
            setUserInstructions('Please enter at least one search parameter.');
        } else {

            const dateURL = newDate ? "date=" + moment(newDate).format('YYYY-MM-DD') + "&" : "";
            const skillURL = skillLevel ? "skill=" + skillLevel + "&" : "";
            const userIdURL = recipientId ? "user=" + recipientId + "&" : "";
            const locationURL = eventLocation ? "location=" + eventLocation : "";
            const searchURL = localHost + "/api/calendar/propose?" + dateURL + skillURL + userIdURL + locationURL;
            console.log(searchURL);
            fetch(searchURL)
                .then(res => res.json())
                .then(res => {
                    // this.addInputTimes(res);
                    console.log("query results: " + JSON.stringify(res));
                    console.log("query results no stringify: " + res.length);
                    if (res.length === 0) {
                        setWarningText(true);
                        setUserInstructions('No availability for that date.');
                    } else {
                        setSearchResult(res);
                        props.navigation.navigate('DateResults', {
                            searchResults: res
                        });
                        setWarningText(false);
                        setUserInstructions("Pick a date to search for other players' availability.");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <View style={styles.container}>
            {warningText ? <Text style={[styles.baseText, styles.instructionText, styles.warningText]}>{userInstructions}</Text> : <Text style={[styles.baseText, styles.instructionText]}>{userInstructions}</Text>}
            {/* <Text style={[warningText ? styles.warningText : styles.baseText, styles.instructionText]}>
                    {userInstructions}
                </Text> */}
            <View>
                <Text style={styles.baseText}>Date</Text>
                <TouchableWithoutFeedback onPress={showDatePicker}>
                    <View style={styles.viewInput}>
                        {newDate ? <Text style={[styles.baseText, styles.viewInputText2]}>{conDate}</Text> : <Text style={[styles.baseText, styles.viewInputText]}>Date</Text>}
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
            <View>
                <Text style={styles.baseText}>Skill Level</Text>
                <ModalSelector
                    // style={styles.viewInput}
                    data={skillsArr}
                    onChange={(option) => {
                        setSkillLevel(option.value);
                        setSkillLabel(option.label)
                    }}>
                    <TextInput
                        style={[styles.viewInput, styles.baseText, styles.viewInputText2]}
                        value={skillLabel}
                        editable={false}
                        placeholder={"Skill Level"}
                    />
                </ModalSelector>
            </View>
            <View>
                <Text style={styles.baseText}>User</Text>
                <View style={[styles.viewInput]}>
                    <Text
                        style={{ color: recipientId === null ? 'lightgrey' : 'black', fontSize: 16, fontWeight: "300" }}
                        onPress={() => props.navigation.navigate('User Search', { searchType: 'invite', setUserInfo: setUserInfo })}
                    >
                        {recipientUsername === '' ? 'Find User' : recipientUsername}
                    </Text>
                </View>
            </View>

            <View>
                <TextInput 
                    style={[styles.viewInput, styles.baseText, styles.viewInputText2]}
                    onChangeText={text => setEventLocation(text)}
                    value={eventLocation}
                    placeholder={'Location'}
                    placeholderTextColor={'lightgrey'}
                />
            </View>

            {/* <View>
                <LocationPicker
                    modalVisible={modalVisible}
                    cancelModal={() => setModalVisible(false)}
                    handleLocation={getCurrentLocation}
                    handleZip={zipToCoordinates}
                />
                <ModalSelector
                    data={courtLocations}
                    style={styles.courtInput}
                    initValue='Court Location'
                    onChange={(option) => {
                        setEventLocation(option);
                    }}>
                    <TextInput
                        style={[styles.viewInput, styles.baseText, styles.viewInputText2]}
                        editable={false}
                        value={eventLocation === undefined ? eventLocation : eventLocation.label}
                        placeholder={'Court Location'}
                        placeholderTextColor={'lightgrey'}
                        multiline={true}
                    />
                </ModalSelector>
                <View style={styles.locationButton}>
                    <Button title='Set Location' onPress={() => setModalVisible(true)} />
                </View>
            </View> */}

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
    courtInput: {
        width: '90%',
        alignSelf: 'center',
    },
    input: {
        height: 60,
        // width: 120,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        fontWeight: '300',
        // marginBottom: 20,
        paddingLeft: 10,
        color: 'black',
    },
    instructionText: {
        textAlign: 'center'
    },
    locationButton: {
        marginTop: 10,
        alignItems: 'center'
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
    warningText: {
        color: '#d30000'
    },
});

export default SearchByDateScreen;