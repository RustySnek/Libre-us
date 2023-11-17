import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SubjectNavigator from './subject_navigator';
import OverviewNavigator from "./overview_navigator";

const Drawer = createDrawerNavigator();

const HomeNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{
      drawerStyle: {
        backgroundColor: "#121212",
      },
      drawerLabelStyle: {
        color: "white"
      },
      headerStyle: {
        backgroundColor: "#121212"
      },
      headerTitleStyle: {
        color: "white"
      },
      headerTintColor: "white"
    }}>

      <Drawer.Screen name="Overview" component={OverviewNavigator} />
      <Drawer.Screen name="Subjects" component={SubjectNavigator} />
    </Drawer.Navigator>
  );
};
export default HomeNavigator;
