import { useEffect, useState } from "react";
import { Text, View, Modal } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colorMapping } from "./subject_screen";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Grade } from "../../shared/shared_components";

const ViewSubject = ({ route }) => {
  const { subject, grades } = route.params;
  const [subject_grades, set_grades] = useState([]);

  useEffect(() => {
    set_grades([grades.map((grade, idx) => {
      return <Grade grade={grade} key={idx} />
    })])
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
