import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/login_screen';

const stack = createStackNavigator();
function LoginNavigator() {
  return (<stack.Navigator>
    <stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  </stack.Navigator>);
}

export default LoginNavigator;
