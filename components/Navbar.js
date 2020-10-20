import React from 'react';
import { TouchableOpacity, View, TextInput, Text, StyleSheet, Button, Image, Dimensions } from 'react-native';

const Navbar = props => {
    return (
        <View style={styles.topBar}>
            <View style={styles.drawer}>
            
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: 'rgb(108, 230, 49)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center'
    },
    drawer: {
        flex: 1
    },

});

export default Navbar;