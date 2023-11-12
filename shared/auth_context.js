
import { createContext, useContext, useState } from 'react';
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [is_logged_in, set_logged_in] = useState(false);
  const [is_loading, set_loading] = useState(false);
  const login = () => {
    set_logged_in(true);
  };

  const logout = () => {
    SecureStore.deleteItemAsync("api_key").then(() => {
      console.log("Removed the token")
    })
    set_logged_in(false);
  };
  const start_loading = () => {
    set_loading(true);
  };

  const stop_loading = () => {
    set_loading(false);
  };
  const authenticate = async () => {

    start_loading();
    try {
      const token = await SecureStore.getItemAsync("api_key");

      if (typeof token === "string") {
        login();
        return token; // Return the token
      } else {
        logout();
        return null; // Return null if no token
      }
    } catch (err) {
      console.error(err);
      logout();
      throw err; // Re-throw the error
    } finally {
      stop_loading();
    }
  }
  return (
    <AuthContext.Provider value={{ is_logged_in, login, logout, is_loading, start_loading, stop_loading, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
