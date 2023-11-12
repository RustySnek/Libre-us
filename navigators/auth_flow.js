import { useAuth } from "../shared/auth_context";
import * as SecureStore from 'expo-secure-store';
import LoginNavigator from "./main_navigator";
import HomeNavigator from "./home_navigator";
import { useEffect } from "react";

export default function AuthFlow() {
  const { is_logged_in, login, logout, start_loading, stop_loading } = useAuth();
  useEffect(() => {
    start_loading();
    SecureStore.getItemAsync("api_key").then((token) => {
      if (typeof token == "string") {
        login()
      } else {
        logout()
      }
    }).catch((err) => {
      console.error(err)
      logout()
    }).finally(() => {

      stop_loading();
    });

  }, [])
  return is_logged_in == true ? <HomeNavigator /> : <LoginNavigator />
};
