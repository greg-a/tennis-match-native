import React from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { localHost } from '../localhost.js';
import { AuthContext } from './../../context';
import { useIsFocused } from '@react-navigation/native';

const LoginScreen = props => {
    // to load font
    let [fontsLoaded] = useFonts({
        'Coolvetica': require('../../assets/fonts/coolvetica.ttf'),
    });

    const [loginUsername, setLoginUsername] = React.useState("");
    const [loginPassword, setLoginPassword] = React.useState("");
    const [userInstructions, setUserInstructions] = React.useState("Please enter your details");
    const [warningText, setWarningText] = React.useState(false);
    const [signingIn, setSigningIn] = React.useState(false);

    const { signIn } = React.useContext(AuthContext);

    const handleSpinner = () => {
        if (!warningText) {
            setSigningIn(true);
        }
    };

    const handleSignIn = () => {
        handleSpinner();

        let userCred = {
            username: loginUsername,
            password: loginPassword
        };

        fetch(localHost + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userCred)
        })
            .then(res => res.json())
            .then(res => {
                //check log in attempt (need to set up error handling)
                if (res.statusString === 'loggedin') {
                    setTimeout(signIn, 1000);
                }
                else if (res.statusString === 'noPassOrUser') {
                    setUserInstructions("Missing username or password");
                    setWarningText(true);
                    setSigningIn(false);
                }
                else if (res.statusString === 'wrongPassOrUser') {
                    setUserInstructions('Incorrect username or password');
                    setWarningText(true);
                    setSigningIn(false);
                };
            })
            .catch(err => console.log(err));
    };

    // checks if font has been loaded
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
            {/* <ScrollView style={styles.container}> */}
                <View style={styles.topView}>
                    <Image
                        resizeMode="contain"
                        source={require('../../assets/Logo/tennismatch.png')}
                        style={styles.logo}
                    />
                </View>

                <View style={styles.middleView}>

                    <Text style={[styles.baseText, styles.loginText]}>
                        Login
                    </Text>
                    <Text style={[warningText ? styles.warningText : styles.baseText, styles.instructionText]}>
                        {userInstructions}
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setLoginUsername(text)}
                        value={loginUsername}
                        placeholder={'Username'}
                        placeholderTextColor={'black'}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setLoginPassword(text)}
                        value={loginPassword}
                        placeholder={'Password'}
                        placeholderTextColor={'black'}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleSignIn}
                    >
                        {
                            signingIn ? <ActivityIndicator size="small" color='white' /> :
                                <Text style={[styles.baseText, styles.signInButtonText]}>SIGN IN</Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomView}>
                    <Text style={styles.baseText}>First time here?</Text>
                    <TouchableOpacity style={styles.signUpButton} onPress={() => props.navigation.navigate('SignUp')}>
                        <Text style={[styles.signUpButtonText]}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            {/* </ScrollView> */}
            </View>
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
        marginTop: 50
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(108,230,49)',
        alignItems: 'center',
        // justifyContent: 'space-around'
    },
    input: {
        height: 40,
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
    loginText: {
        fontSize: 40,
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
        marginTop: 50
    },
    signInButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 20,
        width: 115
    },
    signUpButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 10,
        width: 115
    },
    signInButtonText: {
        fontSize: 16
    },
    signUpButtonText: {
        fontSize: 16,
        color: 'rgb(108,230,49)',
    },
    topView: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        marginTop: 60
    }
});

export default LoginScreen;