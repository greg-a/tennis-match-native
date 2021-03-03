import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import FeedScreen from '../screens/FeedScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import CalendarScreen from '../screens/CalendarScreen';
import InboxScreen from '../screens/InboxScreen';
import UserSearchScreen from '../screens/UserSearchScreen';
import SearchByDateScreen from '../screens/SearchByDateScreen';
import SearchDateResultsScreen from '../screens/SearchDateResultsScreen';
import SearchDatePropose from '../screens/SearchDatePropose';
import RequestsScreen from '../screens/RequestsScreen';
import TennisIcon from '../../assets/racket3white.png';

const Stack = createStackNavigator();

const MainStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Feed" component={FeedScreen} options={{
        headerLeft: () => (
          <View>
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
            >
              <Image 
                source={TennisIcon}
                style={{ width: 50, height: 50, marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        ),
      }} />
    </Stack.Navigator>

  );
}

export { MainStackNavigator };

const AvailabilityStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Availability" component={AvailabilityScreen} options={{
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
      <Stack.Screen name="User Search" component={UserSearchScreen} />
    </Stack.Navigator>

  );
}

export { AvailabilityStackNavigator };

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

export { CalendarStackNavigator };

const ProfileStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Profile" component={ProfileScreen} options={{
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
    </Stack.Navigator>
  );
}

export { ProfileStackNavigator };

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

export { MessengerStackNavigator };

const SearchByDateStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Find Match" component={SearchByDateScreen} options={{
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
      <Stack.Screen name="Date Results" component={SearchDateResultsScreen} />
      <Stack.Screen name="Propose Date" component={SearchDatePropose} />
      <Stack.Screen name="User Search" component={UserSearchScreen} />
    </Stack.Navigator>
  );
}

export { SearchByDateStackNavigator };


const RequestsStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Requests" component={RequestsScreen} options={{
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
    </Stack.Navigator>
  )
};

export { RequestsStackNavigator };
  

