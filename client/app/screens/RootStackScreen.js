import React, { useEffect, useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from '../navigation/DrawerNavigator';
import AuthStackScreen from './AuthStackScreen';

const RootStack = createStackNavigator();

const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="Drawer Navigator"
        component={DrawerNavigator}
      />
    ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
        />
      )}
  </RootStack.Navigator>
);

export default RootStackScreen;