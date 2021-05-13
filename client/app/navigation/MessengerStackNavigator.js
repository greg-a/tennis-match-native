import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import MessengerScreen from '../screens/MessengerScreen';
import InboxScreen from '../screens/InboxScreen';
import UserSearchScreen from '../screens/UserSearchScreen';

const Stack = createStackNavigator();

const MessengerStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#6CE631",
            },
            headerTintColor: "white",
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen name="Inbox" component={InboxScreen} options={{
            headerLeft: () => (
              <View>
                <Icon
                  onPress={() => navigation.toggleDrawer()}
                  name="tennis"
                  color="white"
                  size={40}
                />
              </View>
            ),
          }} />
          <Stack.Screen name="Messenger" component={MessengerScreen} />
          <Stack.Screen name="User Search" component={UserSearchScreen} />
        </Stack.Navigator>
      );
}

export default MessengerStackNavigator;