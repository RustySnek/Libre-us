import { useEffect, useState } from "react";
import { View, Text } from "react-native";

import LoadingScreen from "../../shared/loading";
import { useAuth, basic_headers } from "../../shared/auth_context";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useOverview } from "../../shared/overview_context";
import { Announcement, Attendance, Grade, Message } from "../../shared/shared_components";
const Overview = () => {

  const [refreshing, set_refreshing] = useState(true);
  const [subjects, set_subjects] = useState([]);
  const [overview, set_overview] = useState([]);
  const { is_loading, stop_loading, start_loading, authenticate, logout } = useAuth();
  const { add_overview_item, store_data, load_data, overview_data, wipe_data, } = useOverview();


  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const data_to_components = () => {
    const overview_components = [];
    let last_date = "";
    Object.entries(overview_data).forEach(([key, val], idx) => {
      if (last_date != val.date) {
        overview_components.push((<Text className='text-white mt-4 border-b border-white p-1 pl-4 w-full'>{val.date} {weekdays[new Date(val.date).getDay()]}</Text>))

        last_date = val.date
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
          overview_components.push(<Message message={val} key={idx} />)
          break;
        case "announcement":
          overview_components.push(<Announcement announcement={val} key={idx} />)
          break;
      }
    })
    set_overview(overview_components);
  }

  const parse_overview_data = async (data) => {
    console.log(Object.keys(data))
    const overview = [];
    const all_grades = Object.values(data["Grades"]["1"]).flat()
    const all_attendance = data["Attendance"]["1"]
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
      const data = await response.json();
      parse_overview_data(data);
    }).catch((error) => {
      console.error(error)
    });
  }

  useEffect(() => {
    async function refresh() {
      const token = await authenticate()
      await load_data()
      await get_overview(token, "2023-10-01", "00:00:00")

      //await get_grades()

      await store_data()

      data_to_components()
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
      </ScrollView >
      <LoadingScreen isVisible={is_loading} />
    </View>
  );
}
export default Overview;
