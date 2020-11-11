import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, AvailabilityStackNavigator, CalendarStackNavigator } from "./StackNavigator";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tabs = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tabs.Navigator
    tabBarOptions={{
      showLabel: false
    }}
    >
      <Tabs.Screen name="Feed" component={MainStackNavigator}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: (({ focused }) => <Icon name="earth" size={40} color="#6CE631" />)
        }}
      />
      <Tabs.Screen name="Availability" component={AvailabilityStackNavigator}
        options={{
          tabBarLabel: 'Availability',
          tabBarIcon: (({ focused }) => <Icon name="plus-circle-outline" size={40} color="#6CE631" />)
        }}
      />
      <Tabs.Screen name="Calendar" component={CalendarStackNavigator}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: (({ focused }) => <Icon name="calendar-month" size={40} color="#6CE631" />)
        }}
      />
    </Tabs.Navigator>

  );
};

export default BottomTabNavigator;