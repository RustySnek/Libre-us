import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import LoadingScreen from "../../shared/loading";
import { useAuth, basic_headers } from "../../shared/auth_context";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useOverview } from "../../shared/overview_context";
import { Announcement, Attendance, Grade, Message } from "../../shared/shared_components";
const Overview = ({ navigation }) => {

  const [refreshing, set_refreshing] = useState(true);
  const [loaded, set_loaded] = useState(false);
  const [overview, set_overview] = useState([]);
  const { is_loading, stop_loading, start_loading, authenticate, logout } = useAuth();
  const { add_overview_item, store_data, load_data, overview_data, wipe_data } = useOverview();

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const data_to_components = () => {
    const overview_components = [];
    let last_date = "";
    Object.entries(overview_data).forEach(([key, val], idx) => {
      if (last_date != val.date) {
        overview_components.push((<Text key={`date-marker-${idx}`} className='text-white mt-4 border-b border-white p-1 pl-4 w-full'>{val.date} {weekdays[new Date(val.date).getDay()]}</Text>))

        last_date = val.date.split(" ")[0]
      }
      const _type = key.split("-")[0]
      switch (_type) {
        case "grade":

          overview_components.push(<Grade grade={val} key={idx} />)
          break;
        case "attendance":
          overview_components.push(<Attendance attendance={val} key={idx} />)
          break;
        case "message":
          overview_components.push((
            <TouchableOpacity key={`overview-message-${key}`} onPress={() => navigation.navigate("overview_message", { message: val })}>
              <Message message={val} key={idx} />
            </TouchableOpacity>
          ))
          break;
        case "announcement":
          overview_components.push(<Announcement announcement={val} key={idx} />)
          break;
      }
    })
    set_overview(overview_components);
  }

  const parse_overview_data = async (data) => {

    const overview = [];
    const all_grades = Object.values(data["Grades"]["1"]).flat()
    const all_attendance = data["Attendance"][0]
    const all_messages = data["Messages"]
    const all_announcements = data["Announcements"]
    all_grades.forEach(async (grade, _) => {
      const id = grade.href.split("/")
      const key = `grade-${id[id.length - 1]}`
      overview.push([key, grade])
    })
    all_attendance.forEach(async (attendance, _) => {
      const id = attendance.href.split("/")
      const key = `attendance-${id[id.length - 1]}`
      overview.push([key, attendance])
    })
    all_messages.forEach(async (message, _) => {
      const id = message.href.split("/")
      const key = `message-${id[id.length - 1]}`
      overview.push([key, message])
    })
    all_announcements.forEach(async (announcement, _) => {
      let description = announcement.description
      let hash = 0;

      for (let i = 0; i < description.length; i++) {
        const char = description.charCodeAt(i);
        hash = (hash << 5) - hash + char;
      }
      const key = `announcement-${Math.abs(hash).toString(36)}`;
      overview.push([key, announcement])
    })
    const sorted_overview = overview.sort((a, b) => new Date(a[1].date) - new Date(b[1].date)).reverse()
    for (const [key, val] of sorted_overview) {
      await add_overview_item(key, val);
    }
    set_loaded(true);
  }

  const get_overview = async (token, date, time) => {

    const url = process.env.API_URL + "overview";
    const headers = {
      ...basic_headers,
      "X-API-Key": token
    }
    const overview_data = {
      "last_login_date": date,
      "last_login_time": time,
    };
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(overview_data),
    }).then(async (response) => {
      if (response.status === 401) {
        stop_loading()
        logout()
      } else {
        const data = await response.json();
        parse_overview_data(data);

      }
    }).catch((error) => {
      console.error(error)
      console.log("offline mode")
      set_loaded(true);
    });
  }
  const wipe_and_clear = async () => {
    await wipe_data()
    set_overview([]);
  }
  useEffect(() => {

    navigation.getParent().setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={wipe_and_clear}><Text>123</Text></TouchableOpacity>
      ),
    });
  }, [])
  useEffect(() => {
    const store = async () => {
      if (Object.keys(overview_data).length !== 0) {

        await store_data();
      }

    }

    if (loaded === true) {
      stop_loading()
      data_to_components()
      set_loaded(false);

      store()
    }
  }, [loaded])
  useEffect(() => {
    async function refresh() {
      const token = await authenticate()
      start_loading()
      set_refreshing(true);
      load_data().then(async () => {

        await get_overview(token, "2023-11-01", "00:00:00")
      })

      set_refreshing(false);

    }
    if (refreshing === true) {
      refresh()
    }
  }, [refreshing])


  return (
    <View className="bg-[#121212] flex-1">
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => set_refreshing(true)} />
      } className="flex flex-col px-4">
        {overview}
        <View className="h-4" />
      </ScrollView >
      <LoadingScreen isVisible={is_loading} />
    </View>
  );
}
export default Overview;
