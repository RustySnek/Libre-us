import { createStackNavigator } from '@react-navigation/stack';

import SubjectScreen from '../screens/grades/subject_screen';
import ViewSubject from '../screens/grades/view_subject';

const stack = createStackNavigator();
function HomeNavigator() {
  return (<stack.Navigator>
    <stack.Screen name="Subjects" component={SubjectScreen} options={{ headerShown: false }} />
    <stack.Screen name="ViewSubject" component={ViewSubject} options={{ headerShown: false }} />
  </stack.Navigator>);
}

export default HomeNavigator;
