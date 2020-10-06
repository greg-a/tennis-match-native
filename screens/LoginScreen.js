import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, Button, Image, Dimensions } from 'react-native';

const LoginScreen = props => {
    return (
        <View style={styles.background}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/Logo/tennismatch.png')} style={styles.logo} />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Username"
                // onChangeText={goalInputHandler}
                // value={enteredGoal}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Password"
                // onChangeText={goalInputHandler}
                // value={enteredGoal}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Login" onPress={() => console.log("button is working")} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Sign Up" onPress={() => console.log("button is working")} />
            </View>
        </View>
    )
};

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'rgb(108, 230, 49)',
        flex: 1,
        alignItems: 'center'
    },
    buttonContainer: {
        margin: 20,
        width: '50%'
    },
    inputContainer: {
        backgroundColor: 'white',
        margin: 10,
        width: '50%',
        borderRadius: 5
    },
    logo: {
        width: win.width * .75,
        height: 100,
        resizeMode: 'contain',
        marginTop: 40
    },
    logoContainer: {
        flex: 0.4,
        justifyContent: 'flex-start'
    }
});

export default LoginScreen;