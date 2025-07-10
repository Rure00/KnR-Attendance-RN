import AttendanceRadioButton from "@/components/attendance-radio-button";
import DatePickerModal from "@/components/date-piacker-modal";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const data = ["테스트1", "테스트2"];
  const [selectedStatus, setStaus] = useState(0);

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{
          alignContent: "flex-start",
        }}
        data={data}
        renderItem={({ item }) => <Text>{item}</Text>}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {dateToDotSeparated(selectedDate)}
            </Text>
            <AttendanceRadioButton
              values={[10, 5, 2, 2, 1]}
              selectedIndex={selectedStatus}
              onClick={(index) => {
                setStaus(index);
              }}
            />
          </View>
        }
      />

      <DatePickerModal
        date={selectedDate}
        mode={"date"}
        isShow={showDatePicker}
        onConfirm={(date: Date) => {
          setDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: StyleSheet.flatten([globalStyles.background, { paddingTop: 8 }]),
  headerContainer: StyleSheet.flatten([
    globalStyles.containerWhite,
    {
      paddingVertical: 8,
      paddingHorizontal: 13,
      alignItems: "center",
      gap: 16,
    },
  ]),
  headerText: {
    color: colors.black,
    fontWeight: "600",
    fontSize: 24,
  },
});
