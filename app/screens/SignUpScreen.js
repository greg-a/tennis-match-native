import React from 'react';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';

function SignUpScreen() {
    // to load font
    let [fontsLoaded] = useFonts({
        'Coolvetica': require('../../assets/fonts/coolvetica.ttf'),
    });

    const [signUpUsername, setSignUpUsername] = React.useState("");
    const [signUpPassword, setSignUpPassword] = React.useState("");
    const [signUpEmail, setSignUpEmail] = React.useState("");

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

                    <Text style={[styles.baseText,styles.createAccountText]}>
                        Create Account
                    </Text>
                    <Text style={[styles.baseText, styles.instructionText]}>
                        Please enter your details
                    </Text>
                    <TextInput 
                    style={styles.input}
                    onChangeText={text => setSignUpUsername(text)}
                    value={signUpUsername}
                    placeholder={'Username'}
                    placeholderTextColor={'black'}
                    />
                    <TextInput 
                    style={styles.input}
                    onChangeText={text => setSignUpEmail(text)}
                    value={signUpEmail}
                    placeholder={'Email'}
                    placeholderTextColor={'black'}
                    />
                    <TextInput 
                    style={styles.input}
                    onChangeText={text => setSignUpPassword(text)}
                    value={signUpPassword}
                    placeholder={'Password'}
                    placeholderTextColor={'black'}
                    secureTextEntry
                    />
                    <TouchableOpacity style={styles.createAccountButton}>
                        <Text style={[styles.baseText,styles.createAccountButtonText]}>CREATE ACCOUNT</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomView}>
                    <Text style={styles.baseText}>Already a member?</Text>
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={[styles.loginButtonText]}>LOGIN</Text>
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
        marginTop: -20,
    },
    createAccountButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        backgroundColor: '#269bee',
        borderRadius: 5,
        marginTop: 10
    },
    loginButton: {
        paddingVertical: 15,
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
        alignItems: 'center'
    }
});

export default SignUpScreen;