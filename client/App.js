import React from 'react';
import { NavigationContainer } from "@react-navigation/native";

// import { MainStackNavigator } from "./app/navigation/StackNavigator";
import DrawerNavigator from './app/navigation/DrawerNavigator';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './context';

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

export default function App() {

  const [userToken, setUserToken] = React.useState(null);

  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        setUserToken("asdf");        
      },
      signUp: () => {
        setUserToken(null);
      },
      signOut: () => {
        setUserToken(null);
      }
    };
  }, []);

  return (

    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>



    // <NavigationContainer>
    //   <DrawerNavigator />
    // </NavigationContainer>

  );
}
