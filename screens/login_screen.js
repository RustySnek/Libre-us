import { View, Text, TextInput } from "react-native";
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Switch, TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
import { useAuth } from "../shared/auth_context";
import LoadingScreen from "../shared/loading";
import AsyncStorage from '@react-native-async-storage/async-storage';

const api_url = process.env.API_URL;

const LoginScreen = () => {
  const [remember_user, set_remember_user] = useState(false);
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");
  const [username, set_username] = useState("");
  const { login, is_loading, start_loading, stop_loading } = useAuth()

  const get_token = async (username, password) => {
    axios.post(`${api_url}/login`, { username, password })
      .then(response => {
        SecureStore.setItemAsync('api_key', response.data["X-API-Key"]);
        set_error_message("Successfully logged in!")
        login()
      })
      .catch(error => {
        if (error.response.data !== undefined) {
          set_error_message(error.response.data["error"])
        } else {
          set_error_message(`Error connecting to api ${api_url}/login`)
        }
      });
  };
  const change_username = async (value) => {
    set_username(value)
    if (remember_user === true) {
      await AsyncStorage.setItem("username", value)
    }
  }
  const toggle_remember_user = async (value) => {
    set_remember_user(value)
    await AsyncStorage.setItem("remember_user", JSON.stringify(value))
  }

  useEffect(() => {
    AsyncStorage.getItem("remember_user").then(async (value) => {
      set_remember_user(JSON.parse(value))
      if (JSON.parse(value) === true) {
        user = await AsyncStorage.getItem("username")
        set_username(user)
      }
    }).catch(async () => {
      await AsyncStorage.setItem("remember_user", remember_user)
    })
  }, [])

  const sign_in = () => {
    start_loading();
    get_token(username, password).then((message) => {
      set_error_message(message)
    }).finally(() => {

      stop_loading();
    })
  }
  return (
    <View className="bg-[#121212] flex-1">
      <View className="mt-24 mx-8 ">
        <Text className="font-normal text-5xl text-white italic">Welcome</Text>
        <View className="space-y-16 mt-16">
          <View>
            <TextInput
              blurOnSubmit={true}
              value={username}
              onChangeText={text => change_username(text)}
              className="text-white text-xl border-b border-b-zinc-600 pb-4 w-80"
              selectTextOnFocus
              placeholder="Username" placeholderTextColor="gray" />
            <View className='flex flex-row items-center justify-end'>
              <Text className="text-white">Remember</Text>
              <Switch trackColor={{ true: "#e91e63", false: "#880e4f" }} thumbColor="#d81b60" value={remember_user} onValueChange={(value) => toggle_remember_user(value)} />
            </View>
          </View>
          <TextInput blurOnSubmit={true}
            onChangeText={text => set_password(text)}
            className="text-white text-xl border-b border-b-zinc-600 pb-4 w-80"
            secureTextEntry
            selectTextOnFocus
            placeholderTextColor="gray" placeholder="Password" />
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-3xl font-normal">Sign in</Text>
            <TouchableOpacity onPress={sign_in} className="w-16 h-16 flex-none items-center justify-center rounded-full bg-pink-600 self-center">
              <Text className="text-white mb-1 text-2xl font-bold">{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-pink-600 mt-2 text-lg italic font-semibold">{error_message}</Text>
      </View>

      <LoadingScreen isVisible={is_loading} />
    </View>
  );
};
export default LoginScreen;
