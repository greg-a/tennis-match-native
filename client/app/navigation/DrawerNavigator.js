import React from "react";
import { View, Text, Platform, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainStackNavigator, ProfileStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, MessengerStackNavigator, CalendarStackNavigator, SearchByDateStackNavigator } from "./StackNavigator";
import BottomTabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    // <Drawer.Navigator>
    //   <Drawer.Screen name="Profile" component={MainStackNavigator} />
    //   <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
    //   <Drawer.Screen name="Feed" component={FeedStackNavigator} />
    //   <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
    //   <Drawer.Screen name="Calendar" component={CalendarStackNavigator} />
    // </Drawer.Navigator>

    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BottomTabNavigator} 
      options={{ drawerLabel: 'Home',
      drawerIcon: (({focused}) => <Icon name="home" size={30} color="#6CE631" />)
      }}/>
      <Drawer.Screen name="Profile" component={ProfileStackNavigator} 
      options={{ drawerLabel: 'Profile',
      drawerIcon: (({focused}) => <Icon name="account-circle" size={30} color="#6CE631" />)
      }}
      />
      <Drawer.Screen name="Inbox" component={MessengerStackNavigator} 
      options={{ drawerLabel: 'Messenger',
      drawerIcon: (({focused}) => <Icon name="message" size={30} color="#6CE631" />)
      }}
      />
      <Drawer.Screen name="Find Match" component={SearchByDateStackNavigator} 
      options={{ drawerLabel: 'Find Match',
      drawerIcon: (({focused}) => <Icon name="call-merge" size={30} color="#6CE631" />)
      }}
      />
    </Drawer.Navigator>
    
  );
}

export default DrawerNavigator;

// SPLIT -----------------------------

// import React from "react";

// import { createDrawerNavigator } from "@react-navigation/drawer";

// import { MainStackNavigator, ProfileStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, MessengerStackNavigator, CalendarStackNavigator } from "./StackNavigator";
// // import BottomTabNavigator from "./TabNavigator";

// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Profile" component={MainStackNavigator} />
//       <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
//       <Drawer.Screen name="Feed" component={FeedStackNavigator} />
//       <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
//       <Drawer.Screen name="Calendar" component={CalendarStackNavigator} />
//     </Drawer.Navigator>
    
//   );
// }

// export default DrawerNavigator;