import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colorMapping } from "./subject_screen";
import { ScrollView } from "react-native-gesture-handler";
const ViewSubject = ({ route }) => {
  const { subject, grades } = route.params;
  const [subject_grades, set_grades] = useState([]);
  console.log(grades)

  const Grade = ({ grade }) => {
    const [show_modal, set_show_modal] = useState(false);
    return (
      <View>
        <TouchableOpacity onPress={() => set_show_modal(!show_modal)} className="flex flex-row h-20 w-full rounded-lg bg-[#1f1f1f] mt-4">
          <View style={{ backgroundColor: colorMapping[grade.grade] }} className="items-center justify-center flex rounded-l-lg w-20 h-full">
            <Text className="text-white text-3xl font-semibold">{grade.grade}</Text>
          </View>
          <View className="flex-1 flex-col px-4 justify-between">
            <View className="flex-row flex justify-between pt-2">
              <Text className="text-white w-2/3">{grade.category}</Text>
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
        {show_modal === true ? <View className="bg-[#1f1f1f] w-[90%] self-center px-4 py-2 rounded-b-lg">
          <Text className="text-white">{grade.desc}</Text>
        </View> : null}
      </View>
    );
  }

  useEffect(() => {
    set_grades([grades.map((grade, idx) => {
      return <Grade grade={grade} key={idx} />
    })])
    console.log(subject_grades)
  }, [])

  return (
    <View className="bg-[#121212] flex-1 px-4">
      <ScrollView>


        <View className="mt-8" />
        {subject_grades}

      </ScrollView>
    </View>
  );
}
export default ViewSubject;
