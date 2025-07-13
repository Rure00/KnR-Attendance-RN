import AttendanceBottomSheet from "@/components/attendance-bottom-sheet";
import AttendanceRadioButton from "@/components/attendance-radio-button";
import DatePickerModal from "@/components/date-piacker-modal";
import MemberItem from "@/components/member-item";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { AttendanceStatus } from "@/models/attendace-status";
import { Member, randomAttendanceMap } from "@/models/member";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [attendaceRecord, setAttendaceRecord] =
    useState<Map<Member, AttendanceStatus>>(randomAttendanceMap);

  // randomAttendanceMap  new Map<Member, AttendanceStatus>()

  const [selectedStatus, setStaus] = useState(0);

  const [selectedMember, setMember] = useState<Member | null>();

  const bottomRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [sorting, setSorting] = useState<"이름" | "출석" | "">("이름");

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{
          alignContent: "flex-start",
          gap: 4,
        }}
        data={Array.from(attendaceRecord.keys())}
        keyExtractor={(member: Member, index: number) => {
          return member.id;
        }}
        renderItem={({ item }) => (
          <MemberItem
            member={item}
            attendanceStatus="참석"
            onPressed={(member) => {
              setMember(member);
              bottomRef.current?.expand();
            }}
          />
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
        ListEmptyComponent={
          <Text
            style={{
              color: colors.blue100,
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "300",
            }}
          >
            출석을 시작하세요!
          </Text>
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

      {selectedMember && (
        <AttendanceBottomSheet
          member={selectedMember!!}
          status={"참석"}
          ref={bottomRef}
          onChange={handleSheetChanges}
          close={() => {
            bottomRef.current?.close();
          }}
        />
      )}
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
