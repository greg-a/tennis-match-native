import React, { useEffect, useContext } from 'react';
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
  const [userId, setUserId] = React.useState();
  const [newNotifications, setNewNotifications] = React.useState({ messages: 0, matches: 0 });
  const [socketConnected, setSocketConnected] = React.useState(false);

  const getNewNotifications = () => {
    if (userToken) {
      fetch(localHost + "/api/notifications").then(res => res.json())
        .then((notifications) => {
          if (!socketConnected) {
            socket.emit('notifyMe', notifications.userid);
            setSocketConnected(true);
            setUserId(notifications.userid);
            console.log("----connected to notifyMe----", notifications.userid);
          };

          if (notifications.messages !== newNotifications.messages || notifications.matches !== newNotifications.messages) {
            setNewNotifications({ messages: notifications.messages, matches: notifications.matches });
          }
        })
        .catch(err => console.log(err));
    };
  };

  // checks if a server session exists and sets logged in token if it does
  const checkLogin = () => {
    console.log('checking login');
        fetch(localHost + '/api/checklogin')
          .then(res=>{
            if (res.status===200) {
              setUserToken('asdf');
            } else {
              console.log('not logged in');
            }
          })
          .catch(err=>{
            if (err) {
              throw err;
            }
          });
    
  };

  useEffect(() => {
    console.log("APP MOUNTED")
    connectToSocket();
    getNewNotifications();
    checkLogin();

    if (socketConnected) {
      return () => {
        socket.emit('unsubscribe', userId);
        setSocketConnected(false);
        console.log("APP UNMOUNTED")
      };
    }
  }, [userToken]);

  const connectToSocket = () => {
    socket.on("output", data => {
      getNewNotifications();
      console.log("notification update: " + JSON.stringify(data));

      return () => {
        socket.disconnect()
      };
    });
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
