import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from './shared/auth_context';
import AuthFlow from './navigators/auth_flow';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AuthFlow />
      </AuthProvider>
    </NavigationContainer>
  );
}

