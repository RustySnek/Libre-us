import { useAuth } from "../shared/auth_context";
import * as SecureStore from 'expo-secure-store';
import LoginNavigator from "./main_navigator";
import { useEffect } from "react";
import HomeNavigator from "./home_navigator";
import SubjectNavigator from "./subject_navigator";

export default function AuthFlow() {
  const { is_logged_in, authenticate, is_loading } = useAuth();
  useEffect(() => {
    (async () => {
      await authenticate()
    })()

  }, [])
  return is_logged_in == true ? <HomeNavigator /> : <LoginNavigator />
};
