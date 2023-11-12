import { View, Text } from "react-native";

const ViewSubject = ({ route }) => {
  const { subject, grades } = route.params;
  return (
    <View>
      <Text>
        {subject}
      </Text>
    </View>
  );
}
export default ViewSubject;
