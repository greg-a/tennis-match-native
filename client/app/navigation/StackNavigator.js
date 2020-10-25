import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import FeedScreen from '../screens/FeedScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import LoginScreen from '../screens/LoginScreen';
import React from 'react';
import CalendarScreen from '../screens/CalendarScreen';
import BottomTabNavigator from './TabNavigator';



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
      {/* <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} /> */}
      <Stack.Screen name="Feed" component={FeedScreen} />
      {/* <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} /> */}
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
    </Stack.Navigator>
  );
}

export { CalendarStackNavigator };
  
