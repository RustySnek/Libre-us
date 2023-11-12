import axios from "axios";
import { Text, View } from "react-native";
import { useAuth } from "../../shared/auth_context";
import { useEffect, useState } from "react";
import LoadingScreen from "../../shared/loading";
import { PieChart } from "react-native-svg-charts";
import { RefreshControl, TouchableOpacity, ScrollView } from "react-native-gesture-handler";

export const colorMapping = {
  '1': '#D32F2F',  // Dark Red
  '1-': '#EF5350', // Lighter Red
  '1+': '#B71C1C', // Darker Red

  '2': '#FF9800',  // Dark Orange
  '2-': '#FFB74D', // Lighter Orange
  '2+': '#F57C00', // Darker Orange

  '3': '#FFEB3B',  // Dark Yellow
  '3-': '#FFEE58', // Lighter Yellow
  '3+': '#FDD835', // Darker Yellow

  '4': '#4CAF50',  // Dark Green
  '4-': '#66BB6A', // Lighter Green
  '4+': '#43A047', // Darker Green

  '5': '#2196F3',  // Dark Blue
  '5-': '#42A5F5', // Lighter Blue
  '5+': '#1E88E5', // Darker Blue

  '6': '#9C27B0',  // Dark Purple
  '6-': '#AB47BC', // Lighter Purple
  '6+': '#8E24AA', // Darker Purple};

};

const PieChartComponent = ({ data, avg }) => {
  const pieData = data.flat().filter(grade => grade.counts === true)
    .map((value, index) => {
      console.log(value.value)
      return ({
        value: value.value,
        svg: {
          fill: colorMapping[value.grade],
          onPress: () => console.log('press', value),
        },
        arc: { outerRadius: (90) + '%', innerRadius: "80%", padAngle: 0 },

        key: `pie-${index}`,
      })
    })

  return (
    <View style={{ height: 250 }} className="flex justify-center">
      <PieChart className="text-white flex-1" animate={true} data={pieData} />
      <Text className="text-white absolute self-center text-3xl font-bold">{avg}</Text>
    </View>
  );
};

const SubjectScreen = ({ navigation }) => {
  const [subjects, set_subjects] = useState([]);
  const [refreshing, set_refreshing] = useState(false);
  const [pie_grades, set_pie] = useState([]);
  const [semester_average, set_semester_average] = useState(0.00);
  const api_url = process.env.API_URL;
  const { is_loading, stop_loading, start_loading, authenticate, logout } = useAuth();

  const Subject = ({ name, gpa, grades }) => {

    const gpa_color = colorMapping[Math.round(gpa[2].gpa).toString()]
    return (
      <TouchableOpacity onPress={() => navigation.navigate("ViewSubject", { subject: name, grades })} className="flex flex-row justify-between rounded-lg h-20 w-full bg-[#1f1f1f] mt-4">
        <Text className="text-white pt-2 pl-3 w-4/5 truncate">{name}</Text>
        <View className="flex flex-col w-12 items-center justify-center rounded-r-lg opacity-75" style={{ backgroundColor: gpa_color }}>
          {
            gpa.map((avg, idx) => {
              return (
                <Text key={idx} className="text-white ">{avg.gpa}</Text>
              );
            })
          }
        </View>
      </TouchableOpacity>
    );
  }

  const parse_subjects = (school_subjects, semester_avgs, semester) => {
    const all_grade_values = [];
    const semester_subjects = [];
    for (const [subject, grades] of Object.entries(school_subjects[semester])) {
      all_grade_values.push(grades
        .filter(grade => grade.counts === true).map(grade => grade.value))
      semester_subjects.push(<Subject key={subject} name={subject} gpa={semester_avgs[subject]} grades={grades} />)
    }
    set_pie(Object.values(school_subjects[semester]));
    set_semester_average(parseFloat((all_grade_values.flat().reduce((acc, num) => acc + num, 0) / all_grade_values.flat().length).toFixed(2)));
    set_subjects(semester_subjects)
  }

  const get_grades = (token, sort_by) => {
    start_loading()
    axios.get(`${api_url}grades/${sort_by}`, {
      headers: {
        "X-API-Key": token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      parse_subjects(response.data["Grades"], response.data["Gpa"], 0)
    }).catch((err) => {
      console.error(err.response.data)
      logout()
    }).finally(() => {
      stop_loading()
    })
  }
  useEffect(() => {
    authenticate().then((token) => {

      get_grades(token, "all")
    })
    set_refreshing(false);
  }, [refreshing])
  return (
    <View className="bg-[#121212] flex-1">
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => set_refreshing(true)} />
      } className="flex flex-col px-4">

        <View className="mt-8" />
        <PieChartComponent data={pie_grades} avg={semester_average} />
        {subjects}
        <View className="mb-8" />

      </ScrollView>
      <LoadingScreen isVisible={is_loading} />
    </View>
  );
}
export default SubjectScreen;
