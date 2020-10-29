import React from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { useLinkProps } from '@react-navigation/native';
import { localHost } from '../localhost.js';

const LoginScreen = props => {
    // to load font
    let [fontsLoaded] = useFonts({
        'Coolvetica': require('../../assets/fonts/coolvetica.ttf'),
    });

    const [loginUsername, setLoginUsername] = React.useState("");
    const [loginPassword, setLoginPassword] = React.useState("");

    const handleSignIn = () => {

        let userCred = {
            username: loginUsername,
            password: loginPassword
        }

        

        fetch(localHost+"/api/login", {
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
                    props.navigation.replace('Feed')
                };
            })
            .catch(err => console.log(err));
    }

    // checks if font has been loaded
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
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
                    <Text style={[styles.baseText, styles.instructionText]}>
                        Please enter your details
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
                        onPress={handleSignIn}>
                        <Text style={[styles.baseText, styles.signInButtonText]}>SIGN IN</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomView}>
                    <Text style={styles.baseText}>First time here?</Text>
                    <TouchableOpacity style={styles.signUpButton} onPress={() => props.navigation.navigate('SignUp')}>
                        <Text style={[styles.signUpButtonText]}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    baseText: {
        color: 'white',
        fontSize: 16
    },
    bottomView: {
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: 'rgb(108,230,49)',
        alignItems: 'center',
        justifyContent: 'space-around'
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
        alignItems: 'center'
    },
    signInButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    signUpButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 10
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
        marginTop: 25
    }
});

export default LoginScreen;