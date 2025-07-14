import AttendanceBottomSheet from "@/components/attendance-bottom-sheet";
import AttendanceRadioButton from "@/components/attendance-radio-button";
import DatePickerModal from "@/components/date-piacker-modal";
import MemberItem from "@/components/member-item";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { AttendanceStatus, statuses } from "@/models/attendace-status";
import { Member, randomAttendanceMap } from "@/models/member";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import {
  memberAttendanceStatusSorting,
  memberNameSorting,
} from "@/utils/member-sorting";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedDate, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [sorting, setSorting] = useState<"이름" | "출석">("이름");

  const [attendaceFilter, setAttendaceFilter] = useState(0);

  const [attendanceRecord, setAttendaceRecord] =
    useState<Map<Member, AttendanceStatus>>(randomAttendanceMap);

  const memberArray = useMemo(() => {
    const filterArray = ["전체", "참석", "불참", "지각", "무단"];
    const array = Array.from(attendanceRecord.keys())
      .filter((it) => {
        return it != undefined;
      })
      .filter((it) => {
        if (attendaceFilter == 0) return true;
        return attendanceRecord.get(it) == filterArray[attendaceFilter];
      });

    if (sorting == "이름") {
      return memberNameSorting(array);
    } else {
      return memberAttendanceStatusSorting(attendanceRecord);
    }
  }, [attendanceRecord, sorting, attendaceFilter]);

  const attendanceNumber = useMemo(() => {
    const values = Array.from(attendanceRecord.values()).filter(
      (it) => it != undefined
    );

    const result: [number, number, number, number, number] = [0, 0, 0, 0, 0];
    result[0] = values.length;

    values.forEach((it) => {
      switch (it) {
        case "참석":
          result[1]++;
          break;
        case "불참":
          result[2]++;
          break;
        case "지각":
          result[3]++;
          break;
        case "무단":
          result[4]++;
          break;
      }
    });
    return result;
  }, [attendanceRecord]);

  // randomAttendanceMap  new Map<Member, AttendanceStatus>()

  const [selectedMember, setMember] = useState<Member | null>();

  const bottomRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    const newRecord = new Map(attendanceRecord);
    newRecord.set(selectedMember!!, statuses[index]);
    setAttendaceRecord(newRecord);
  }, []);

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{
          alignContent: "flex-start",
          gap: 4,
        }}
        data={memberArray}
        keyExtractor={(member) => member.id}
        renderItem={({ item }) => (
          <MemberItem
            member={item}
            attendanceStatus={attendanceRecord.get(item)!!}
            onPressed={(member) => {
              try {
                setMember(member);
                bottomRef.current?.expand();
              } catch (e) {
                if (e instanceof Error) {
                  console.log(`Stack: ${e.stack}`);
                } else {
                  console.log("Unknown error", e);
                }
              }
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
                values={attendanceNumber}
                selectedIndex={attendaceFilter}
                onClick={(index) => {
                  setAttendaceFilter(index);
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
          status={attendanceRecord.get(selectedMember!!)!!}
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
