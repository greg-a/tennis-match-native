import React from 'react';
import { NavigationContainer } from "@react-navigation/native";

// import { MainStackNavigator } from "./app/navigation/StackNavigator";
import DrawerNavigator from './app/navigation/DrawerNavigator';

export default function App() {
  return (

    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>

  );
}
