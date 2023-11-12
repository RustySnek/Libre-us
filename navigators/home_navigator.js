import { createStackNavigator } from '@react-navigation/stack';

import SubjectScreen from '../screens/subject_screen';

const stack = createStackNavigator();
function HomeNavigator() {
  return (<stack.Navigator>
    <stack.Screen name="Subjects" component={SubjectScreen} options={{ headerShown: false }} />
  </stack.Navigator>);
}

export default HomeNavigator;
