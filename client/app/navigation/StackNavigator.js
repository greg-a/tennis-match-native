import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import LoginScreen from '../screens/LoginScreen';
import React from 'react';
import CalendarScreen from '../screens/CalendarScreen';

// const PlacesNavigator = createStackNavigator(
//     {
//       Availability: AvailabilityScreen,
//       Calendar: {
//         screen: CalendarScreen
//       },
//       Profile: ProfileScreen,
//       Messenger: MessengerScreen
//     },
//     {
//       defaultNavigationOptions: {
//         headerStyle: {
//           backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : ''
//         },
//         headerTintColor: Platform.OS === 'android' ? 'white' : 'rgb(108,230,49)'
//       }
//     }
// );

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : 'rgb(108,230,49)'
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Edit Profile"
        }}
      />
      <Stack.Screen
        name="Availability"
        component={AvailabilityScreen}
      />
      <Stack.Screen name="Messenger"
        component={MessengerScreen}
      />
    </Stack.Navigator>
  );
}

export { MainStackNavigator };

