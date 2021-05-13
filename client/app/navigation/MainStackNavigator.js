import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';
import TennisIcon from '../../assets/racket2white.png';

const Stack = createStackNavigator();

const MainStackNavigator = ({ navigation }) => {
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
      <Stack.Screen name="Feed" component={FeedScreen} options={{
        headerLeft: () => (
          <View>
            <TouchableOpacity
              onPress={() => navigation.toggleDrawer()}
            >
              <Image 
                source={TennisIcon}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>
          </View>
        ),
      }} />
    </Stack.Navigator>

  );
}

export default MainStackNavigator;