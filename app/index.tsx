import AttendanceRadioButton from "@/components/attendance-radio-button";
import DatePickerModal from "@/components/date-piacker-modal";
import MemberItem from "@/components/member-item";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { testMembers } from "@/models/member";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const data = testMembers;
  const [selectedStatus, setStaus] = useState(0);
  const [sorting, setSorting] = useState<"이름" | "출석" | "">("이름");

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{
          alignContent: "flex-start",
          gap: 4,
        }}
        data={data}
        renderItem={({ item }) => (
          <MemberItem member={item} attendanceStatus="참석" />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.headerContainer}>
              <Text
                onPress={() => {
                  setShowDatePicker(true);
                }}
                style={styles.headerText}
              >
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

            <View style={{ height: 19 }} />

            <Text
              style={{
                marginStart: 5,
                paddingStart: 4,
                color: colors.gray200,
              }}
              onPress={() => {
                setSorting(sorting == "이름" ? "출석" : "이름");
              }}
            >
              정렬: {sorting}
            </Text>

            <View style={{ height: 10 }} />
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
