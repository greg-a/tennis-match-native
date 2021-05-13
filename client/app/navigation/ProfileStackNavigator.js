import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = ({ navigation }) => {
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
          <Stack.Screen name="Profile" component={ProfileScreen} options={{
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
      );
}

export default ProfileStackNavigator;