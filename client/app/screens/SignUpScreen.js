import React from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { localHost } from '../localhost.js';
import { AuthContext } from './../../context';

const SignUpScreen = props => {
    // to load font
    let [fontsLoaded] = useFonts({
        'Coolvetica': require('../../assets/fonts/coolvetica.ttf'),
    });

    const [signUpUsername, setSignUpUsername] = React.useState("");
    const [signUpPassword, setSignUpPassword] = React.useState("");
    const [signUpPasswordCon, setSignUpPasswordCon] = React.useState("");
    const [signUpEmail, setSignUpEmail] = React.useState("");
    const [userInstructions, setUserInstructions] = React.useState("Please enter your details");
    const [warningText, setWarningText] = React.useState(false);

    const { signUp } = React.useContext(AuthContext);

    const handleEmailIsValid = email => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return true
        }
    };

    const handleFormSubmit = () => {
        const emailIsValid = handleEmailIsValid(signUpEmail);
        
        if (signUpPassword === signUpPasswordCon && emailIsValid) {
            fetch(localHost + "/api", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: signUpUsername,
                    password: signUpPassword,
                    email: signUpEmail
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (res.statusString === "formNotComplete") {
                        setUserInstructions("Please complete the registration form");
                        setWarningText(true);
                    } else if (res.statusString === "userAlreadyExists") {
                        setUserInstructions("Account already exists with that username");
                        setWarningText(true);
                    } else if (res.statusString === "userCreateSuccess") {
                        signUp();
                        props.navigation.navigate('Login')
                    }
                })
                .catch(err => console.log(err));
        }
        else if (!emailIsValid) {
            setWarningText(true);
            setUserInstructions("Invalid Email");
        }
        else {
            setUserInstructions("Passwords do not match");
            setWarningText(true);
            setSignUpPassword("");
            setSignUpPasswordCon("");

        }
    };

    // checks if font has been loaded
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <KeyboardAwareScrollView
                style={{backgroundColor: 'rgb(108,230,49)'}}
                contentContainerStyle={styles.container}
                extraHeight={20}
            >
                <View style={styles.topView}>
                    <Image
                        resizeMode="contain"
                        source={require('../../assets/Logo/tennismatch.png')}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.middleView}>

                    <Text style={[styles.baseText, styles.createAccountText]}>
                        Create Account
                    </Text>
                    <Text style={[warningText ? styles.warningText : styles.baseText, styles.instructionText]}>
                        {userInstructions}
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setSignUpUsername(text)}
                        value={signUpUsername}
                        placeholder={'Username'}
                        placeholderTextColor={'black'}
                        autoCapitalize={'none'}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setSignUpEmail(text)}
                        value={signUpEmail}
                        placeholder={'Email'}
                        placeholderTextColor={'black'}
                        autoCapitalize={'none'}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setSignUpPassword(text)}
                        value={signUpPassword}
                        placeholder={'Password'}
                        placeholderTextColor={'black'}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setSignUpPasswordCon(text)}
                        value={signUpPasswordCon}
                        placeholder={'Confirm Password'}
                        placeholderTextColor={'black'}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.createAccountButton} onPress={handleFormSubmit}>
                        <Text style={[styles.baseText, styles.createAccountButtonText]}>CREATE ACCOUNT</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomView}>
                    <Text style={styles.baseText}>Already a member?</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => props.navigation.navigate('Login')}
                    >
                        <Text style={[styles.loginButtonText]}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
};

const styles = StyleSheet.create({
    baseText: {
        color: 'white',
        fontSize: 16
    },
    warningText: {
        color: '#d30000',
        fontSize: 16
    },
    bottomView: {
        alignItems: 'center',
        // marginTop: 50
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(108,230,49)',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        height: 35,
        width: 180,
        borderColor: 'black',
        borderBottomWidth: 1,
        fontSize: 16,
        fontWeight: '300',
        marginBottom: 20
    },
    instructionText: {
        marginBottom: 15
    },
    createAccountText: {
        fontSize: 32,
        fontFamily: 'Coolvetica',
        marginBottom: 10
    },
    logo: {
        width: '100%',
        height: '90%',
        // backgroundColor: 'blue'
    },
    middleView: {
        alignItems: 'center',
        // marginTop: 20,
    },
    createAccountButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    loginButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 10
    },
    createAccountButtonText: {
        fontSize: 16
    },
    loginButtonText: {
        fontSize: 16,
        color: 'rgb(108,230,49)',
    },
    topView: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        // marginTop: 60
    }
});

export default SignUpScreen;