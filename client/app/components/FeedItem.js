import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Avatar, Accessory } from 'react-native-elements';

const FeedItem = props => {
    return (
        <View style={styles.feedItem}>
            <View onLongPress={props.onSelectEvent} style={styles.feedItemRow}>
                <View style={{flex: 1}}>
                    <Avatar
                        rounded
                        // onPress={openImagePickerAsync}
                        // title="MD"
                        title={props.organizer ? props.organizer[0] : ''}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={props.organizerPic && { uri: "data:image/png;base64, " + props.organizerPic }}
                        // style={{ width: 200, height: 200 }}
                        size="medium"
                        activeOpacity={0.7}
                        overlayContainerStyle={{backgroundColor: 'silver'}}

                    />
                </View>

                <View style={{flex: 4}}>
                    <Text style={styles.feedText}><Text style={styles.feedNames}>{props.organizer}</Text> scheduled a match with <Text style={styles.feedNames}>{props.confirmer} </Text>on {props.month}/{props.day} at {props.hour}.</Text>
                </View>

                <View style={{flex: 1}}>
                    <Avatar
                        rounded
                        // onPress={openImagePickerAsync}
                        // title="MD"
                        title={props.confirmer ? props.confirmer[0] : ''}
                        icon={{ name: 'user', type: 'font-awesome' }}
                        source={props.confirmerPic && { uri: "data:image/png;base64, " + props.confirmerPic }}
                        // style={{ width: 200, height: 200 }}
                        size="medium"
                        activeOpacity={0.7}
                    // containerStyle={{ marginTop: 20 }}
                        overlayContainerStyle={{backgroundColor: 'silver'}}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    feedItem: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // flex: 1,
        padding: 5,
        height: 70,
        width: '100%',
        backgroundColor: '#f5f5f5',
        // borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        overflow: 'hidden',
        marginTop: 0
    },
    feedItemRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    feedText: {
        fontSize: 15,
    },
    feedNames: {
        fontWeight: 'bold',
    }
});

export default FeedItem;