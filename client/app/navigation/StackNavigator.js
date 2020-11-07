import { View, Platform } from 'react-native';
// import { Icon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import FeedScreen from '../screens/FeedScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import LoginScreen from '../screens/LoginScreen';
import React from 'react';
import CalendarScreen from '../screens/CalendarScreen';
import BottomTabNavigator from './TabNavigator';
import InboxScreen from '../screens/InboxScreen';
import UserSearchScreen from '../screens/UserSearchScreen';
import SearchByDateScreen from '../screens/SearchByDateScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SearchDateResultsScreen from '../screens/SearchDateResultsScreen';
import SearchDatePropose from '../screens/SearchDatePropose';
import RequestsScreen from '../screens/RequestsScreen';



const Stack = createStackNavigator();

const MainStackNavigator = ({navigation}) => {
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
      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} options={{
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
      }}/>
      {/* <Stack.Screen name="FindMatch" component={SearchByDateScreen} /> */}
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
    </Stack.Navigator>
    
  );
}

export { MainStackNavigator };

const AvailabilityStackNavigator = ({navigation}) => {
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
      }}/>      
      <Stack.Screen name="User Search" component={UserSearchScreen} />
    </Stack.Navigator>
    
  );
}

export { AvailabilityStackNavigator };

const CalendarStackNavigator = ({navigation}) => {
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
      }}/>
      <Stack.Screen name="Availability" component={AvailabilityScreen} />
      <Stack.Screen name="Find Match" component={SearchByDateScreen} />
      <Stack.Screen name="User Search" component={UserSearchScreen} />
    </Stack.Navigator>
  );
}

export { CalendarStackNavigator };

// const FeedStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Feed" component={FeedScreen} />
//     </Stack.Navigator>
//   );
// }

// export { FeedStackNavigator };

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

const MessengerStackNavigator = ({navigation}) => {
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
      }}/>
      <Stack.Screen name="Messenger" component={MessengerScreen} />
      <Stack.Screen name="User Search" component={UserSearchScreen} />
    </Stack.Navigator>
  );
}

export { MessengerStackNavigator };

const SearchByDateStackNavigator = () => {
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
      <Stack.Screen name="FindMatch" component={SearchByDateScreen} />
      <Stack.Screen name="DateResults" component={SearchDateResultsScreen} />
      <Stack.Screen name="ProposeDate" component={SearchDatePropose} />
    </Stack.Navigator>
  );
}

export { SearchByDateStackNavigator };

const RequestsStackNavigator = () => {
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
      <Stack.Screen name="Requests" component={RequestsScreen} />
    </Stack.Navigator>
  )
};

export { RequestsStackNavigator };
  
// SPLIT -------------------

// import { Platform } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
// import ProfileScreen from '../screens/ProfileScreen';
// import MessengerScreen from '../screens/MessengerScreen';
// import FeedScreen from '../screens/FeedScreen';
// import AvailabilityScreen from '../screens/AvailabilityScreen';
// import LoginScreen from '../screens/LoginScreen';
// import React from 'react';
// import CalendarScreen from '../screens/CalendarScreen';
// import SignUpScreen from '../screens/SignUpScreen';

// // const PlacesNavigator = createStackNavigator(
// //     {
// //       Availability: AvailabilityScreen,
// //       Calendar: {
// //         screen: CalendarScreen
// //       },
// //       Profile: ProfileScreen,
// //       Messenger: MessengerScreen
// //     },
// //     {
// //       defaultNavigationOptions: {
// //         headerStyle: {
// //           backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : ''
// //         },
// //         headerTintColor: Platform.OS === 'android' ? 'white' : 'rgb(108,230,49)'
// //       }
// //     }
// // );

// const Stack = createStackNavigator();

// const MainStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}} />
//       <Stack.Screen name="Profile" component={ProfileScreen} />
//       <Stack.Screen name="Availability" component={AvailabilityScreen} />
//       <Stack.Screen name="Feed" component={FeedScreen} />
//       <Stack.Screen name="Messenger" component={MessengerScreen} />
//       <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown: false}} />
//     </Stack.Navigator>
//   );
// }

// export { MainStackNavigator };

// const AvailabilityStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Availability" component={AvailabilityScreen} />
//     </Stack.Navigator>
//   );
// }

// export { AvailabilityStackNavigator };

// const FeedStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Feed" component={FeedScreen} />
//     </Stack.Navigator>
//   );
// }

// export { FeedStackNavigator };

// const ProfileStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Profile" component={ProfileScreen} />
//     </Stack.Navigator>
//   );
// }

// export { ProfileStackNavigator };

// const MessengerStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Messenger" component={MessengerScreen} />
//     </Stack.Navigator>
//   );
// }

// export { MessengerStackNavigator };

// const CalendarStackNavigator = () => {
//   return (
//     <Stack.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: "#6CE631",
//       },
//       headerTintColor: "white",
//       headerBackTitle: "Back",
//     }}
//     >
//       <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown: false}} />
//     </Stack.Navigator>
//   );
// }

// export { CalendarStackNavigator };
  
// // const MainNavigator = createDrawerNavigator (
// // {
// //   Profile: {
// //     screen: ProfileScreen,
// //     navigationOptions: {
// //       drawerLabel: 'Profile'
// //     }
// //   },
// //   Availability: {
// //     screen: AvailabilityScreen,
// //     navigationOptions: {
// //       drawerLabel: 'Availability'
// //     }
// //   }
// // }
// // );


//   // export default createAppContainer({PlacesNavigator});
