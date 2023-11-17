import { createStackNavigator } from '@react-navigation/stack';
import Overview from '../screens/overview/overview_screen';
import { OverviewProvider } from '../shared/overview_context';


const stack = createStackNavigator();
function OverviewNavigator() {
  return (

    <OverviewProvider>
      <stack.Navigator>


        <stack.Screen name="overview_screen" component={Overview} options={{ headerShown: false }} />
      </stack.Navigator>

    </OverviewProvider>
  );

}

export default OverviewNavigator;
