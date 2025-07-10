import DatePickerModal from "@/components/date-piacker-modal";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [calendar, setCalendar] = useState();

  return (
    <View style={styles.container}>
      <DatePickerModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
