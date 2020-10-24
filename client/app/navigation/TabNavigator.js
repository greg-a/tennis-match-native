import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MainStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, CalendarStackNavigator } from "./StackNavigator";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStackNavigator} />
      <Tab.Screen name="Availability" component={AvailabilityStackNavigator} />
      <Tab.Screen name="Calendar" component={CalendarStackNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;