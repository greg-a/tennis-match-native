import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import RequestsScreen from '../screens/RequestsScreen';

const Stack = createStackNavigator();

const RequestsStackNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#6CE631",
          },
          headerTintColor: "white",
          headerBackTitle: "Back",
        }}
        >
          <Stack.Screen name="Requests" component={RequestsScreen} options={{
            headerLeft: () => (
              <View>
                <Icon
                  onPress={() => navigation.toggleDrawer()}
                  name="tennis"
                  color="white"
                  size={40}
                />
              </View>
            ),
          }} />
        </Stack.Navigator>
      )
}

export default RequestsStackNavigator;