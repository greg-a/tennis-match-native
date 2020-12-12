import React, { useState, useEffect, useLayoutEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Image, Platform, Button, ScrollView, View, StyleSheet, TextInput, Text, Alert, TouchableOpacity, Switch } from 'react-native';
import { Avatar, Accessory } from 'react-native-elements';
import { States, Skills } from '../../data/ProfileData';
import ModalSelector from 'react-native-modal-selector';
import { localHost, googleMapsAPI } from '../localhost.js';
import { AuthContext } from './../../context';
import ModalItem from '../components/ModalItem';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

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
        lng: '',
        pushEnabled: true
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [skillLabel, setSkillLabel] = useState('');
    const { signOut } = React.useContext(AuthContext);

    const statesArr = [];
    const skillsArr = [];

    States.forEach(state => {
        statesArr.push({
            component: <ModalItem title={state.label} />,
            key: state.key,
            label: state.label,
            value: state.value
        });
    });

    Skills.forEach(skill => {
        skillsArr.push({
            component: <ModalItem title={skill.label} />,
            key: skill.key,
            value: skill.value,
            label: skill.label
        })
    });

    const toggleSwitch = () => setProfileUpdate({ ...profileUpdate, pushEnabled: !profileUpdate.pushEnabled });

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
                    {/* <Item
                        title='SAVE'
                        onPress={handleProfileUpdate}
                    /> */}
                    <TouchableOpacity onPress={handleProfileUpdate}>
                        <Text style={styles.saveButton}>SAVE</Text>
                    </TouchableOpacity>

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
                    lng: res.lng,
                    pushEnabled: res.pushEnabled
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


    const openImagePickerAsync = async () => {
        const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        };

        // const pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: true });
        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        console.log("image info: " + JSON.stringify(pickerResult.uri));

        if (pickerResult.cancelled === true) {
            return;
        };

        ImageManipulator.manipulateAsync(pickerResult.uri, [{ resize: { width: 40, height: 40 } }], { base64: true })
            .then(result => {
                console.log("resized imaged: " + JSON.stringify(result));
            })
            .catch(err => console.log(err));
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* <Button title="Pick an image from camera roll" onPress={openImagePickerAsync} />
                {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />} */}
                <Avatar
                    rounded
                    onPress={openImagePickerAsync}
                    // title="MD"
                    title={profileUpdate.firstname[0]}
                    // icon={{ name: 'user', type: 'font-awesome' }}
                    source={{ uri: selectedImage }}
                    // style={{ width: 200, height: 200 }}
                    size="xlarge"
                    activeOpacity={0.7}
                    containerStyle={{ marginTop: 20 }}
                />
                    
            </View>
            <View style={styles.form}>
                <View style={styles.row}>
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
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                        style={styles.input}
                        value={profileUpdate.city}
                        onChangeText={text => setProfileUpdate({ ...profileUpdate, city: text })}
                    />
                </View>
                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>State</Text>
                        <ModalSelector
                            pickerStyle={styles.input}
                            data={statesArr}
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
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Skill Level</Text>
                    <ModalSelector
                        pickerStyle={styles.input}
                        data={skillsArr}
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
                <View style={styles.row}>
                    <Text style={styles.label}>Push Notifications {profileUpdate.pushEnabled ? 'Enabled' : 'Disabled'}</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#bbf7e7" }}
                        thumbColor={profileUpdate.pushEnabled ? "#6CE631" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={profileUpdate.pushEnabled}
                    />
                </View>

            </View>
            <View>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        fontSize: 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 15,
        paddingVertical: 4,
        paddingHorizontal: 2,
        color: 'black',
        width: '90%'
    },
    saveButton: {
        color: 'white',
        fontSize: 18,
        // marginRight: 8,
        fontWeight: 'bold'
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
        alignSelf: 'center',
        // marginTop: 120
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