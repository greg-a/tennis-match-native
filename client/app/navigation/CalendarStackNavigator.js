import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import CalendarScreen from '../screens/CalendarScreen';
import UserSearchScreen from '../screens/UserSearchScreen';
import SearchByDateScreen from '../screens/SearchByDateScreen';

const Stack = createStackNavigator();

const CalendarStackNavigator = ({ navigation }) => {
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
          <Stack.Screen name="Calendar" component={CalendarScreen} options={{
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
          <Stack.Screen name="Availability" component={AvailabilityScreen} />
          <Stack.Screen name="Find Match" component={SearchByDateScreen} />
          <Stack.Screen name="User Search" component={UserSearchScreen} />
        </Stack.Navigator>
      );
}

export default CalendarStackNavigator;