import React from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ProfileStackNavigator, MessengerStackNavigator, SearchByDateStackNavigator, RequestsStackNavigator } from "./StackNavigator";
import BottomTabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (

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
      drawerIcon: (({focused}) => <Icon name="call-merge" size={30} color="#6CE631" />), unmountOnBlur: true
      }}
      />
      <Drawer.Screen name="Requests" component={RequestsStackNavigator} 
      options={{ drawerLabel: 'Requests',
      drawerIcon: (({focused}) => <Icon name="call-merge" size={30} color="#6CE631" />)
      }}
      />
    </Drawer.Navigator>
    
  );
}

export default DrawerNavigator;