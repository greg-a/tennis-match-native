import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainStackNavigator, ProfileStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, MessengerStackNavigator, CalendarStackNavigator, SearchByDateStackNavigator } from "./StackNavigator";
import BottomTabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    // <Drawer.Navigator>
    //   <Drawer.Screen name="Profile" component={MainStackNavigator} />
    //   <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
    //   <Drawer.Screen name="Feed" component={FeedStackNavigator} />
    //   <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
    //   <Drawer.Screen name="Calendar" component={CalendarStackNavigator} />
    // </Drawer.Navigator>

    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
      <Drawer.Screen name="FindMatch" component={SearchByDateStackNavigator} />
    </Drawer.Navigator>
    
  );
}

export default DrawerNavigator;

// SPLIT -----------------------------

// import React from "react";

// import { createDrawerNavigator } from "@react-navigation/drawer";

// import { MainStackNavigator, ProfileStackNavigator, AvailabilityStackNavigator, FeedStackNavigator, MessengerStackNavigator, CalendarStackNavigator } from "./StackNavigator";
// // import BottomTabNavigator from "./TabNavigator";

// const Drawer = createDrawerNavigator();

// const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Profile" component={MainStackNavigator} />
//       <Drawer.Screen name="Availability" component={AvailabilityStackNavigator} />
//       <Drawer.Screen name="Feed" component={FeedStackNavigator} />
//       <Drawer.Screen name="Messenger" component={MessengerStackNavigator} />
//       <Drawer.Screen name="Calendar" component={CalendarStackNavigator} />
//     </Drawer.Navigator>
    
//   );
// }

// export default DrawerNavigator;