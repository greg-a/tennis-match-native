import React, { useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { ScrollView, View, StyleSheet, TextInput, Text } from 'react-native';
import { States, Skills } from '../../data/ProfileData';
import DropdownPicker from '../components/DropdownPicker';

const ProfileScreen = props => {
    const [profileUpdate, setProfileUpdate] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        city: '',
        state: '',
        zipcode: '',
        skillLevel: ''
    });

    useEffect(() => {
        fetch('http://192.168.1.153:3001/api/profile')
          .then((response) => response.json())
          .then((json) => console.log(json))
          .catch((error) => console.error(error))
      }, []);

    getProfileInfo = () => {
        fetch("http://192.168.1.153:3001/api/profile")
            .then(res => res.json())
            .then((profileInfo) => {
                console.log(profileInfo)
            })
            .catch(err => console.log(err));
    }

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput style={styles.input} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput style={styles.input} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <TextInput style={styles.input} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>State</Text>
                    <DropdownPicker
                        pickerStyle={styles.input}
                        selected={profileUpdate.state}
                        menuContent={States}
                        onChange={(itemValue, itemIndex) => setProfileUpdate({ ...profileUpdate, state: itemValue })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Skill Level</Text>
                    <DropdownPicker
                        pickerStyle={styles.input}
                        selected={profileUpdate.skillLevel}
                        menuContent={Skills}
                        onChange={(itemValue, itemIndex) => setProfileUpdate({ ...profileUpdate, skillLevel: itemValue })}
                    />
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
                    fetch("http://localhost:3001/api/profile")
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
        paddingHorizontal: 2
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