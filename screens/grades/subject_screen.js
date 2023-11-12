import axios from "axios";
import { Text, View, ScrollView } from "react-native";
import { useAuth } from "../../shared/auth_context";
import { useEffect, useState } from "react";
import LoadingScreen from "../../shared/loading";
import { PieChart } from "react-native-svg-charts";
import { RefreshControl, TouchableOpacity } from "react-native-gesture-handler";

const colorMapping = {
  "1": "#FF5733",
  "1+": "#FF5733",
  "2-": "#33aaff",
  "2": "#33aaff",
  "2+": "#33aaff",
  "3-": "#33ff33",
  "3": "#33ff33",
  "3+": "#33ff33",
  "4-": "#ff33aa",
  "4": "#ff33aa",
  "4+": "#ff33aa",
  "5-": "#3333ff",
  "5": "#3333ff",
  "5+": "#3333ff",
  "6-": "#FFFFFF",
  "6": "#FFFFFF",
};

const PieChartComponent = ({ data, avg }) => {
  const pieData = data
    .map((value, index) => ({
      value,
      svg: {
        fill: colorMapping[value],
        onPress: () => console.log('press', value),
      },
      arc: { outerRadius: (90) + '%', innerRadius: "80%", padAngle: 0 },

      key: `pie-${index}`,
    }))

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
    const all_grades = [];
    const all_grade_values = [];
    const semester_subjects = [];
    for (const [subject, grades] of Object.entries(school_subjects[semester])) {
      all_grades.push(grades
        .filter(grade => grade.counts === true)
        .map(grade => grade.grade)
      )
      all_grade_values.push(grades
        .filter(grade => grade.counts === true).map(grade => grade.value))
      semester_subjects.push(<Subject key={subject} name={subject} gpa={semester_avgs[subject]} grades={grades} />)
    }
    set_pie(all_grades.flat());

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
