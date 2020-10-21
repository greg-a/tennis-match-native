import { Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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
        backgroundColor: "#9AC4F8",
      },
      headerTintColor: "white",
      headerBackTitle: "Back",
    }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator };

const AvailabilityStackNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#9AC4F8",
      },
      headerTintColor: "white",
      headerBackTitle: "Back",
    }}
    >
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
}

export { AvailabilityStackNavigator };
  
// const MainNavigator = createDrawerNavigator (
// {
//   Profile: {
//     screen: ProfileScreen,
//     navigationOptions: {
//       drawerLabel: 'Profile'
//     }
//   },
//   Availability: {
//     screen: AvailabilityScreen,
//     navigationOptions: {
//       drawerLabel: 'Availability'
//     }
//   }
// }
// );


  // export default createAppContainer({PlacesNavigator});

