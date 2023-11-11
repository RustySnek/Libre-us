import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import LoginNavigator from './navigators/main_navigator';

export default function App() {
  return (
    <NavigationContainer>
      <LoginNavigator />

    </NavigationContainer>
  );
}

