import React, { useState, useEffect, useLayoutEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ScrollView, View, StyleSheet, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { States, Skills } from '../../data/ProfileData';
import ModalSelector from 'react-native-modal-selector';
import { localHost, googleMapsAPI } from '../localhost.js';
import { AuthContext } from './../../context';

const ProfileScreen = props => {
    const [profileUpdate, setProfileUpdate] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        city: '',
        state: '',
        zipcode: '',
        skilllevel: 0,
        lat: '',
        lng: ''
    });
    const [skillLabel, setSkillLabel] = useState('');
    const { signOut } = React.useContext(AuthContext);

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

    useEffect(() => {
        if (profileUpdate.username === '') {
            getProfileInfo();
        }
        zipToCoordinates();
    }, [profileUpdate.zipcode]);

    const handleProfileUpdate = () => {
        fetch(localHost + "/api/profileupdate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileUpdate)
        })
            .then(res => {
                console.log("profile updated");
                Alert.alert(
                    "Success!",
                    "Your profile was updated",
                    [{ text: "OK" }]
                );

            })
            .catch(err => {
                console.log(JSON.stringify(err));
                Alert.alert(
                    "Uh oh",
                    "Something went wrong. Try again.",
                    [{ text: "OK" }]
                );
            });
    };

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons>
                    <Item
                        title='SAVE'
                        onPress={handleProfileUpdate}
                    />
                </HeaderButtons>
            ),
        });
    }, [props.navigation, profileUpdate]);

    const getProfileInfo = () => {
        fetch(localHost + '/api/profile')
            .then((response) => response.json())
            .then((res) => {
                setProfileUpdate({
                    ...profileUpdate,
                    username: res.username,
                    email: res.email,
                    firstname: res.firstname,
                    lastname: res.lastname,
                    city: res.city,
                    state: res.state,
                    zipcode: res.zipcode,
                    skilllevel: res.skilllevel,
                    lat: res.lat,
                    lng: res.lng
                });
                setSkillLabel(skillConversion(res.skilllevel));
            })
            .catch((error) => console.error(error))
    };

    const zipToCoordinates = () => {
        const geocodeQuery = `https://maps.googleapis.com/maps/api/geocode/json?address=${profileUpdate.zipcode}&key=${googleMapsAPI}`;

        if (profileUpdate.zipcode !== null && profileUpdate.zipcode.length === 5) {
            fetch(geocodeQuery)
                .then(res => res.json())
                .then(res => {
                    const geocodeCoordinates = res.results[0].geometry.location;

                    setProfileUpdate({ ...profileUpdate, lat: geocodeCoordinates.lat, lng: geocodeCoordinates.lng });
                })
                .catch(err => console.log(err))
        }
    };

    const handleLogout = () => {
        const token = { pushToken: null };

        fetch(localHost + "/api/profileupdate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(token)
        })
            .then(res => {
                fetch(localHost + "/logout")
                    .then(res => {
                        signOut();
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    };

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={profileUpdate.firstname}
                        onChangeText={text => setProfileUpdate({ ...profileUpdate, firstname: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={profileUpdate.lastname}
                        onChangeText={text => setProfileUpdate({ ...profileUpdate, lastname: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        value={profileUpdate.city}
                        onChangeText={text => setProfileUpdate({ ...profileUpdate, city: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>State</Text>
                    <ModalSelector
                        pickerStyle={styles.input}
                        data={States}
                        onChange={(option) => setProfileUpdate({ ...profileUpdate, state: option.label })}>
                        <TextInput
                            style={styles.input}
                            value={profileUpdate.state}
                            editable={false}
                            placeholder={"Choose State..."}
                        />
                    </ModalSelector>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Zip Code</Text>
                    <TextInput
                        style={styles.input}
                        value={profileUpdate.zipcode}
                        onChangeText={text => setProfileUpdate({ ...profileUpdate, zipcode: text })}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Skill Level</Text>
                    <ModalSelector
                        pickerStyle={styles.input}
                        data={Skills}
                        onChange={(option) => {
                            setProfileUpdate({ ...profileUpdate, skilllevel: option.value });
                            setSkillLabel(option.label)
                        }}>
                        <TextInput
                            style={styles.input}
                            value={skillLabel}
                            editable={false}
                            placeholder={"Choose Skill Level..."}
                        />
                    </ModalSelector>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
};

ProfileScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Edit Profile',
        headerRight: () => <HeaderButtons>
            <Item
                title='SAVE'
                onPress={() => {
                    fetch(localHost + "/api/profile")
                        .then(res => res.json())
                        .then((profileInfo) => {
                            console.log(profileInfo)
                            console.log("Header Button Works!");
                        })
                        .catch(err => console.log(err));
                }}
            />
        </HeaderButtons>
    };
};

const styles = StyleSheet.create({
    input: {
        fontSize: 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 4,
        paddingHorizontal: 2,
        color: 'black'
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: 'grey'
    },
    logoutButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#f50057',
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-start'
    },
    logoutButtonText: {
        fontSize: 16,
        color: 'white',
    },
    form: {
        margin: 30
    }
});

export default ProfileScreen;