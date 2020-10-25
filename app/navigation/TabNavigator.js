import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, CalendarStackNavigator } from "./StackNavigator";
import { FeedScreen } from "./../screens/FeedScreen";
import { AvailabilityScreen } from "./../screens/AvailabilityScreen";
import { CalendarScreen } from "./../screens/CalendarScreen";

const Tabs = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    // <Tab.Navigator>
    //   <Tab.Screen name="Feed" component={FeedScreen} />
    //   <Tab.Screen name="Availability" component={AvailabilityStackNavigator} />
    //   <Tab.Screen name="Calendar" component={CalendarStackNavigator} />
    // </Tab.Navigator>
    
    
        <Tabs.Navigator>
            <Tabs.Screen name="Feed" component={MainStackNavigator} />
            <Tabs.Screen name="Availability" component={AvailabilityStackNavigator} />
            <Tabs.Screen name="Calendar" component={CalendarStackNavigator} />
        </Tabs.Navigator>
    
  );
};

export default BottomTabNavigator;