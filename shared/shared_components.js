import { useState } from "react";
import { View, Text } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colorMapping } from "../screens/grades/subject_screen";
import MessageContent from "../screens/messages/message_content";
const attendance_colors = {
  "u": "#C9CC3F",
  "nb": "#9A2A2A",
  "sp": "#EADDCA",
  "zw": "#ECFFDC",
}


export const Attendance = ({ attendance }) => {
  const [show_modal, set_show_modal] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => set_show_modal(!show_modal)} className="flex flex-row h-14 w-full rounded-lg bg-[#1f1f1f] mt-4">
        <View style={{ backgroundColor: attendance_colors[attendance.symbol] }} className="items-center w-14 justify-center flex rounded-l-lg px-3 ">
          <Text className="text-white text-2xl">{attendance.symbol}</Text>
        </View>
        <View className="flex-1 flex-row px-4 justify-between">
          <View className="flex-row flex justify-between self-center py-1">
            <Text numberOfLines={2} className="text-white truncate w-[85%]">{attendance.subject}</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex-row flex space-x-2 items-center">
              <Icon name="clock" size={14} color="#a02769" />
              <Text className="text-white text-lg">{attendance.period}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {show_modal === true ? <View className="bg-[#1f1f1f] w-[90%] self-center px-4 py-2 rounded-b-lg">
        <Text className="text-white">{attendance.topic}</Text>

        <Text className="text-white">{attendance.date}</Text>
      </View> : null}
    </View>
  );
}

export const Grade = ({ grade }) => {
  const [show_grade, set_show_grade] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => set_show_grade(!show_grade)} className="flex flex-row h-20 w-full rounded-lg bg-[#1f1f1f] mt-4">
        <View style={{ backgroundColor: colorMapping[grade.grade] }} className="items-center justify-center flex rounded-l-lg w-20">
          <Text className="text-white text-3xl font-semibold">{grade.grade}</Text>
        </View>
        <View className="flex-1 flex-col px-4 justify-between">
          <View className="flex-row flex justify-between pt-2">
            <Text numberOfLines={2} className="text-white w-2/3">{grade.category}</Text>
            <Text className="text-white">{grade.date}</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex-row flex space-x-2 items-center">
              <Icon name="weight-hanging" size={14} color="#a02769" />
              <Text className="text-white text-lg">{grade.weight}</Text>
            </View>
            <View className="flex-row flex space-x-2 items-center">
              <Icon name="user" size={14} color="#a02769" />
              <Text className="text-white">{grade.teacher}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {show_grade === true ? <View className="bg-[#1f1f1f] w-[90%] self-center px-4 py-2 rounded-b-lg">
        <Text className="text-white">{grade.desc}</Text>
      </View> : null}
    </View>
  );
}

export const Message = ({ message }) => {
  const [unread_color, set_unread_color] = useState(message.unread ? "#e3373d" : "#986cbb");
  return (
    <View className='bg-[#1f1f1f] rounded-lg mt-4 justify-between'>
      <View className="">
        <View className=''>
          <Text className='self-end text-[#838383] pt-1 pr-1'>{message.date}</Text>
          <Text numberOfLines={2} className='text-white text-lg text-left pl-5 pr-3 pb-2'>{message.title}</Text>
        </View>
        <View className='pl-5 py-1 rounded-b-lg' style={{ backgroundColor: unread_color }}>
          <Text>{message.author}</Text>
        </View>
      </View>

    </View>
  );
}

export const Announcement = ({ announcement }) => {
  return (
    <TouchableOpacity className='bg-[#1f1f1f] rounded-lg mt-4'>

      <View className=''>
        <Text numberOfLines={2} className='text-white text-lg text-left pl-5 pr-3 pb-2'>{announcement.title}</Text>
      </View>
      <View className='bg-[#2f2f2f] px-4 py-1 flex flex-row justify-between rounded-b-lg' >

        <Text className="text-white">{announcement.author}</Text>

        <Text className='text-white'>{announcement.date}</Text>
      </View>
    </TouchableOpacity>
  );

}
