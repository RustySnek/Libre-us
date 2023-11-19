import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { basic_headers, useAuth } from "../../shared/auth_context";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const MessageContent = ({ message }) => {
  const [content, set_content] = useState(null);

  const { is_loading, stop_loading, start_loading, authenticate, logout } = useAuth();

  const save_message_content = async () => {
    await AsyncStorage.setItem(`content-${message.href}`, content)
  }
  const load_message_content = async () => {
    const loaded_content = await AsyncStorage.getItem(`content-${message.href}`)
    if (loaded_content != null) {
      set_content(loaded_content);
    } else {
      set_content("");
    }
  }

  const get_content = (token, href) => {
    const url = process.env.API_URL + "messages/content/" + href;
    const headers = {
      ...basic_headers,
      "X-API-Key": token
    }
    fetch(url, {
      method: "GET",
      headers,
    }).then(async (response) => {
      if (response.status === 401) {
        stop_loading()
        logout()
      } else {
        const data = await response.json();
        set_content(data);

      }
    }).catch((error) => {
      console.error(error)
      logout()
    });
  }

  useEffect(() => {
    load_message_content().then(() => {
    })

  }, [])

  useEffect(() => {

    if (content !== null) {

      save_message_content().then(() => { })
    }
    if (content === "") {
      authenticate().then((token) => {

        get_content(token, message.href)
      })

    }

  }, [content])
  return (
    <View className="bg-white">
      <Text>{content}</Text>
    </View>
  );

}
export default MessageContent;
