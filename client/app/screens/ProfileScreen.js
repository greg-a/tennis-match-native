import React, { useState, useEffect, useLayoutEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ScrollView, View, StyleSheet, TextInput, Text, Alert } from 'react-native';
import { States, Skills } from '../../data/ProfileData';
import ModalSelector from 'react-native-modal-selector';
import { localHost } from '../localhost.js';

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
        skillLabel: ''
    });

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
        getProfileInfo();
    }, []);

    const handleProfileUpdate = () => {
        let updateObj = {
            firstname: profileUpdate.firstname,
            lastname: profileUpdate.lastname,
            city: profileUpdate.city,
            state: profileUpdate.state,
            zipcode: profileUpdate.zipcode,
            skilllevel: profileUpdate.skilllevel
        };
        
        fetch(localHost+"/api/profileupdate", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateObj)
        })
            .then(res => {
                console.log("profile updated");
                Alert.alert(
                    "Success!",
                    "Your profile was updated",
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                  );

            })
            .catch(err => console.log(JSON.stringify(err)));
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
        fetch(localHost+'/api/profile')
            .then((response) => response.json())
            .then((res) => setProfileUpdate({
                ...profileUpdate,
                firstname: res.firstname,
                lastname: res.lastname,
                city: res.city,
                state: res.state,
                zipcode: res.zipcode,
                skilllevel: res.skilllevel,
                skillLabel: skillConversion(res.skilllevel)
            }))
            .catch((error) => console.error(error))
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
                        onChange={(option) => setProfileUpdate({ ...profileUpdate, skilllevel: option.value, skillLabel: option.label })}>
                        <TextInput
                            style={styles.input}
                            value={profileUpdate.skillLabel}
                            editable={false}
                            placeholder={"Choose Skill Level..."}
                        />
                    </ModalSelector>
                </View>
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
                    fetch(localHost+"/api/profile")
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
        marginBottom: 15
    },
    form: {
        margin: 30
    }
});

export default ProfileScreen;