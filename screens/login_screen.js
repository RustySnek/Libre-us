import { View, Text, TextInput } from "react-native";
import axios from 'axios';
import React, { useState } from 'react';
import { TouchableOpacity } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';
const api_url = process.env.API_URL;

const get_token = (username, password) => {
  axios.post(`${api_url}/login`, { username, password })
    .then(response => {
      SecureStore.setItemAsync('api_key', response.data["X-API-Key"]);

    })
    .catch(error => {
      console.error(error.response.data)
    });
};

const LoginScreen = () => {
  const [password, set_password] = useState("");
  const [username, set_username] = useState("");
  console.log(x)
  const login = () => {
    token = get_token(username, password)
  }

  return (
    <View className="bg-[#121212] flex-1">
      <View className="mt-24 mx-8 ">
        <Text className="font-normal text-5xl text-white italic">Welcome</Text>
        <View className="space-y-16 mt-16">
          <TextInput
            blurOnSubmit={true}
            onChangeText={text => set_username(text)}
            className="text-white text-xl border-b border-b-zinc-600 pb-4 w-80"
            selectTextOnFocus
            placeholder="Username" placeholderTextColor="gray" />

          <TextInput blurOnSubmit={true}
            onChangeText={text => set_password(text)}
            className="text-white text-xl border-b border-b-zinc-600 pb-4 w-80"
            secureTextEntry
            selectTextOnFocus
            placeholderTextColor="gray" placeholder="Password" />
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white text-3xl font-normal">Sign in</Text>
            <TouchableOpacity onPress={login} className="w-16 h-16 flex-none items-center justify-center rounded-full bg-pink-600 self-center">
              <Text className="text-white mb-1 text-2xl font-bold">{">"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default LoginScreen;
