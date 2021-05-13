import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import UserSearchScreen from '../screens/UserSearchScreen';
import SearchByDateScreen from '../screens/SearchByDateScreen';
import SearchDateResultsScreen from '../screens/SearchDateResultsScreen';
import SearchDatePropose from '../screens/SearchDatePropose';

const Stack = createStackNavigator();

const SearchByDateStackNavigator = ({ navigation }) => {
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
          <Stack.Screen name="Find Match" component={SearchByDateScreen} options={{
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
          <Stack.Screen name="Date Results" component={SearchDateResultsScreen} />
          <Stack.Screen name="Propose Date" component={SearchDatePropose} />
          <Stack.Screen name="User Search" component={UserSearchScreen} />
        </Stack.Navigator>
      );
}

export default SearchByDateStackNavigator;