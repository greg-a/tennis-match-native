import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import moment from "moment";
import { courtLocationNoAnyData, minuteArray } from '../../data/ProfileData';
import { localHost, googleMapsAPI } from '../localhost';
import ModalItem from '../components/ModalItem';


const SearchDatePropose = ({ route, navigation }) => {

    const [eventObj, setEventObj] = React.useState(route.params.eventObj);

    const [startIntArrState, setStartIntArrState] = React.useState([]);
    const [endIntArrState, setEndIntArrState] = React.useState([]);

    const [eventTitle, setEventTitle] = React.useState(eventObj.title);

    const [startTimeHour, setStartTimeHour] = React.useState();
    const [startTimeHourValue, setStartTimeHourValue] = React.useState();
    const [startTimeMinute, setStartTimeMinute] = React.useState();
    const [startTimeMinuteValue, setStartTimeMinuteValue] = React.useState();

    const [endTimeHour, setEndTimeHour] = React.useState();
    const [endTimeHourValue, setEndTimeHourValue] = React.useState();
    const [endTimeMinute, setEndTimeMinute] = React.useState();
    const [endTimeMinuteValue, setEndTimeMinuteValue] = React.useState();

    const [eventLocation, setEventLocation] = React.useState(eventObj.location==='any' ? undefined : eventObj.location);
    
    const [courtLocations, setCourtLocations] = React.useState([]);
    const [currentCoordinates, setCurrentCoordinates] = React.useState({ lat: route.params.eventObj.latitude, lng: route.params.eventObj.longitude });

    useEffect(() => {
        // console.log('username Test: ' + JSON.stringify(route.params.eventObj));
        if (eventObj.location === 'any'){
            getCourtData();
        };
        addInputTime();
    }, []);

    useEffect(() => {
        // console.log('start time hour: ' + startTimeHourValue);
        // console.log('start time minute: ' + startTimeMinuteValue);
        // console.log('end time hour: ' + endTimeHourValue);
        // console.log('end time minute: ' + endTimeMinuteValue);
        // console.log('event location: ' + eventLocation);
        // console.log('event title: ' + eventTitle);
        // console.log('user id: ' + eventObj.User.id);
    });

    const getCourtData = () => {
        const locationQuery = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentCoordinates.lat},${currentCoordinates.lng}&radius=20000&keyword=tennis%20court&key=${googleMapsAPI}`;
        fetch(locationQuery)
            .then(res => res.json())
            .then(courts => {
                
                console.log("courts query: " + locationQuery)
                let courtSearch = [];

                courts.results.forEach((court, i) => {
                    courtSearch.push({
                        key: i + 1,
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

    function skillConversion(skillLevel) {
        if (skillLevel === 1) {
            return "1.0-1.5 - New Player";
        } else if (skillLevel === 2) {
            return "2.0 - Beginner";
        } else if (skillLevel === 3) {
            return "2.5 - Beginner +";
        } else if (skillLevel === 4) {
            return "3.0 - Beginner-Intermediate";
        } else if (skillLevel === 5) {
            return "3.5 - Intermediate";
        } else if (skillLevel === 6) {
            return "4.0 - Intermediate-Advanced";
        } else if (skillLevel === 7) {
            return "4.5 - Advanced";
        }
    };

    function createCurrentStartDate() {
        let currentYear = eventObj.start.substring(0, 4);

        let currentMonth = eventObj.start.substring(5, 7);
        let currentMonthAdj = parseInt(currentMonth) - 1;

        let currentDay = eventObj.start.substring(8, 10);

        let currentStartDate = new Date(parseInt(currentYear),currentMonthAdj,parseInt(currentDay),startTimeHourValue,startTimeMinuteValue);
        console.log(currentStartDate);
        return currentStartDate;
    };

    function createCurrentEndDate() {
        let currentYear = eventObj.start.substring(0, 4);

        let currentMonth = eventObj.start.substring(5, 7);
        let currentMonthAdj = parseInt(currentMonth) - 1;

        let currentDay = eventObj.start.substring(8, 10);

        let currentEndDate = new Date(parseInt(currentYear),currentMonthAdj,parseInt(currentDay),endTimeHourValue,endTimeMinuteValue);
        console.log(currentEndDate);
        return currentEndDate;
    };

    function handleSubmit() {
        const currentEndDate = createCurrentEndDate();
        const currentStartDate = createCurrentStartDate();
        // console.log('title: Proposed - ' + eventTitle);
        // console.log('start: '+currentStartDate);
        // console.log('end: '+currentEndDate);
        // console.log('confirmedByUser: '+eventObj.User.id);
        // console.log('location: '+eventLocation);
        fetch(localHost+"/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Proposed - " + eventTitle,
                start: currentStartDate,
                end: currentEndDate,
                confirmedByUser: eventObj.User.id,
                location: eventLocation,
                eventStatus: "propose"
            })
        })
            .then(res=>res.json())
            .then(res => console.log(res))
            .catch(err=>console.log(err));
        
    }

    function addInputTime() {
        let startIntArr = [];
        let endIntArr = [];

        for (let i = 0;
            i <= (parseInt(moment(eventObj.end).format("HH"))
                - parseInt(moment(eventObj.start).format("HH"))); i++
        ) {
            let startHour = i + parseInt(moment(eventObj.start).format("HH"));
            if (startHour<10) {
                startHour = '0'+startHour;
            }

            let endHour = parseInt(moment(eventObj.end).format("HH")) - i;
            if (endHour<10) {
                endHour = '0'+endHour;
            }
            
            startIntArr.push(
                {
                    key: i,
                    value: i + parseInt(moment(eventObj.start).format("HH")),
                    label: moment("2020-09-18 " + startHour + ":00:00").format("h (a)")
                }
            );
            endIntArr.push(
                {
                    key: i,
                    value: parseInt(moment(eventObj.end).format("HH")) - i,
                    label: moment("2020-09-18 " + endHour + ":00:00").format("h (a)")
                }
            );

        }
        console.log('start int arr: ' + JSON.stringify(startIntArr));
        setStartIntArrState(startIntArr);
        console.log('end int arr: ' + JSON.stringify(endIntArr));
        setEndIntArrState(endIntArr);
    };


    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>

                <Text style={[styles.baseText, styles.titleText]}>
                    {eventObj.title}
                </Text>
                <Text style={[styles.baseText, styles.subTitle]}>
                    {eventObj.User.firstname ? `Username: ${eventObj.User.username} (${eventObj.User.firstname} ${eventObj.User.lastname})` : `Username: ${eventObj.User.username}`}
                </Text>
                <Text style={[styles.baseText, styles.subTitle, styles.skillText]}>
                    Skill level: {eventObj.User.skilllevel ? `${skillConversion(eventObj.User.skilllevel)}` : `n/a`}
                </Text>

                {eventObj.location === 'any' ?

                    <ModalSelector
                        data={courtLocations}
                        style={styles.courtInput}
                        initValue='Court Location'
                        onChange={(option) => {
                            setEventLocation(option);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={eventLocation === undefined ? eventLocation : eventLocation.label}
                            placeholder={'Court Location'}
                            placeholderTextColor={'lightgrey'}
                            multiline={true}
                        />
                    </ModalSelector>

                    :

                    <Text style={styles.baseText}>
                        Court Location: {eventObj.location}
                    </Text>
                }

                <View style={styles.rowContainer}>
                    <ModalSelector
                        data={startIntArrState}
                        style={styles.input2}
                        initValue='Start Hour'
                        onChange={(option) => {
                            setStartTimeHour(option.label);
                            setStartTimeHourValue(option.value);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={startTimeHour}
                            placeholder={'Start Hour'}
                            placeholderTextColor={'lightgrey'}
                        />
                    </ModalSelector>
                    <ModalSelector
                        data={minuteArray}
                        style={styles.input2}
                        initValue='Start Minute'
                        onChange={(option) => {
                            setStartTimeMinute(option.label);
                            setStartTimeMinuteValue(option.value);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={startTimeMinute}
                            placeholder={'Start Minute'}
                            placeholderTextColor={'lightgrey'}
                        />
                    </ModalSelector>
                </View>

                <View style={styles.rowContainer}>
                    <ModalSelector
                        data={endIntArrState}
                        style={styles.input2}
                        initValue='End Hour'
                        onChange={(option) => {
                            setEndTimeHour(option.label);
                            setEndTimeHourValue(option.value);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={endTimeHour}
                            placeholder={'End Hour'}
                            placeholderTextColor={'lightgrey'}
                        />
                    </ModalSelector>
                    <ModalSelector
                        data={minuteArray}
                        style={styles.input2}
                        initValue='End Minute'
                        onChange={(option) => {
                            setEndTimeMinute(option.label);
                            setEndTimeMinuteValue(option.value);
                        }}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            value={endTimeMinute}
                            placeholder={'End Minute'}
                            placeholderTextColor={'lightgrey'}
                        />
                    </ModalSelector>
                </View>

            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.proposeButton}
                onPress={handleSubmit}
                >
                    <Text style={[styles.proposeButtonText]}>PROPOSE MATCH</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    baseText: {
        fontSize: 16,
        paddingLeft: 15,
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'space-around',

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
    input2: {
        width: '40%',
    },
    proposeButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginBottom: 40
    },
    proposeButtonText: {
        fontSize: 16,
        color: 'white',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingLeft: 0,
    },
    skillText: {
        color: 'grey',
        paddingBottom: 6,
    },
    subTitle: {
        fontSize: 18,
    },
    titleText: {
        fontSize: 24,
        paddingBottom: 6
    },
    topContainer: {
        flex: 2,

        justifyContent: 'space-around'
    }
});

export default SearchDatePropose;