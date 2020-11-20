import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import io from 'socket.io-client';

// import { MainStackNavigator } from "./app/navigation/StackNavigator";
import DrawerNavigator from './app/navigation/DrawerNavigator';
import LoginScreen from './app/screens/LoginScreen';
import SignUpScreen from './app/screens/SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, NotificationContext } from './context';
import { localHost } from './app/localhost';

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
        messages={5}
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
  const socket = io(localHost);

  const [userToken, setUserToken] = React.useState(null);
  const [newNotifications, setNewNotifications] = React.useState({ messages: 0, matches: 0 });
  const [socketConnected, setSocketConnected] = React.useState(false);
  const [newNotification, setNewNotification] = React.useState(false);

  const getNewNotifications = () => {
    fetch(localHost + "/api/notifications").then(res => res.json())
      .then((notifications) => {
        if (notifications.messages !== newNotifications.messages || notifications.matches !== newNotifications.messages) {
          setNewNotifications({ messages: notifications.messages, matches: notifications.matches });
        }
      })
      .catch(err => console.log(err));
    console.log("new notifications: " + JSON.stringify(newNotifications));
  };

  useEffect(() => {
    connectToSocket();
    getNewNotifications();

    return () => {
      socket.disconnect();
      setSocketConnected(false);
  };
  }, [userToken, newNotification]);

  const connectToSocket = () => {
    if (!socketConnected) {
      socket.on("output", data => {
        setNewNotification(!newNotification);
      });
      setSocketConnected(true);
    };
  };

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
      <NotificationContext.Provider value={newNotifications}>
        <NavigationContainer>
          <RootStackScreen userToken={userToken} />
        </NavigationContainer>
      </NotificationContext.Provider>
    </AuthContext.Provider>



    // <NavigationContainer>
    //   <DrawerNavigator />
    // </NavigationContainer>

  );
}
