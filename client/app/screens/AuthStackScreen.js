import React, { useEffect, useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "./SignUpScreen";
import LoginScreen from './LoginScreen';

const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator headerMode="none">
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
    // options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ title: "SignUp" }}
    />
  </AuthStack.Navigator>
);

export default AuthStackScreen;