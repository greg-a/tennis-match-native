import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { MainStackNavigator, AvailabilityStackNavigator } from "./StackNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={MainStackNavigator} />
      <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
      <Drawer.Screen name="Messenger" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;