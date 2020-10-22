import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { MainStackNavigator, ProfileStackNavigator, AvailabilityStackNavigator, MessengerStackNavigator, CalendarStackNavigator } from "./StackNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={MainStackNavigator} />
      <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
      <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
      <Drawer.Screen name="Calendar" component={CalendarStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;