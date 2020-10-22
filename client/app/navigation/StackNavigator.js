import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import FeedScreen from '../screens/FeedScreen';
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
        backgroundColor: "#6CE631",
      },
      headerTintColor: "white",
      headerBackTitle: "Back",
    }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator };

const AvailabilityStackNavigator = () => {
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
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
}

export { AvailabilityStackNavigator };

const FeedStackNavigator = () => {
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
      <Stack.Screen name="Feed" component={FeedScreen} />
    </Stack.Navigator>
  );
}

export { FeedStackNavigator };

const ProfileStackNavigator = () => {
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export { ProfileStackNavigator };

const MessengerStackNavigator = () => {
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
      <Stack.Screen name="Messenger" component={MessengerScreen} />
    </Stack.Navigator>
  );
}

export { MessengerStackNavigator };

const CalendarStackNavigator = () => {
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
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown: false}} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
    </Stack.Navigator>
  );
}

export { CalendarStackNavigator };
  
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

