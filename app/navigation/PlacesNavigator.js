import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import ProfileScreen from '../screens/ProfileScreen';
import MessengerScreen from '../screens/MessengerScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';

const PlacesNavigator = createStackNavigator(
    {
      Availability: AvailabilityScreen,
import CalendarScreen from '../screens/CalendarScreen';

const PlacesNavigator = createStackNavigator(
    {
      Calendar: {
        screen: CalendarScreen
      },
      Profile: ProfileScreen,
      Messenger: MessengerScreen
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: Platform.OS === 'android' ? 'rgb(108,230,49)' : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : 'rgb(108,230,49)'
      }
    }
  );
  
  export default createAppContainer(PlacesNavigator);