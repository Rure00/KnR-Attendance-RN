import AttendanceBottomSheet from "@/components/attendance-bottom-sheet";
import AttendanceRadioButton from "@/components/attendance-radio-button";
import DatePickerModal from "@/components/date-piacker-modal";
import MemberItem from "@/components/member-item";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { useActivity } from "@/hooks/use-activity";
import { useMemberRecord } from "@/hooks/use-member-record";
import { AttendanceStatus, statuses } from "@/models/attendace-status";
import { Member } from "@/models/member";
import {
  changeAttendance,
  fetchCreateActivity,
} from "@/redux/reducers/activity-thunk";
import { useAppDispatch } from "@/redux/store";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { Logger } from "@/utils/Logger";
import {
  memberAttendanceStatusSorting,
  memberNameSorting,
} from "@/utils/member-sorting";
import { stringify } from "@/utils/stringify";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function HomeScreen() {
  Logger.debug("HomeScreen--------------------------------------------------");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedDate, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [sorting, setSorting] = useState<"이름" | "출석">("이름");
  const [attendaceFilter, setAttendaceFilter] = useState(0);

  const activity = useActivity(selectedDate);
  const memberRecord = useMemberRecord();
  const attendancesRecord = useMemo(() => {
    return activity?.attendance;
  }, [activity]);

  const [selectedMember, setMember] = useState<Member | null>();

  const memberArray = useMemo(() => {
    if (!activity || !attendancesRecord) return [];

    const filterArray = ["전체", "참석", "불참", "지각", "무단"];

    const array = Object.entries(memberRecord)
      .filter(([id, _]) => {
        if (attendaceFilter === 0) return true;

        const attendance = attendancesRecord[id];
        return attendance?.status === filterArray[attendaceFilter];
      })
      .map(([_, member]) => member);

    if (sorting === "이름") {
      return memberNameSorting(array);
    } else {
      return memberAttendanceStatusSorting(memberRecord, attendancesRecord);
    }
  }, [activity, attendancesRecord, memberRecord, sorting, attendaceFilter]);

  const attendanceNumber: [number, number, number, number, number] =
    useMemo(() => {
      if (!activity) return [0, 0, 0, 0, 0];
      return [
        activity.entire,
        activity.attended,
        activity.notAttended,
        activity.late,
        activity.unexcused,
      ];
    }, [activity]);

  Logger.debug(`HomeScreen: activity -> ${stringify(activity)}`);
  Logger.debug(
    `HomeScreen: attendancesRecord -> ${stringify(attendancesRecord)}`
  );
  Logger.debug(
    `HomeScreen: attendanceNumber -> ${stringify(attendanceNumber)}`
  );
  Logger.debug(`HomeScreen: memberArray -> ${stringify(memberArray)}`);

  const bottomRef = useRef<BottomSheet>(null);
  const handleSheetChanges = (status: AttendanceStatus) => {
    Logger.debug(`SetStatus: ${selectedMember?.name} to ${status}`);
    if (!activity || !attendancesRecord) return;

    const before = attendancesRecord[selectedMember!.id];

    dispatch(
      changeAttendance({
        activityId: activity.id,
        userId: selectedMember!.id,
        attendanceEntry: {
          ...before,
          status,
        },
      })
    );
  };

  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={{
          alignContent: "flex-start",
          gap: 4,
        }}
        data={memberArray}
        keyExtractor={(member) => member.id}
        renderItem={({ item }) =>
          attendancesRecord?.[item.id] ? (
            <MemberItem
              member={item}
              attendanceStatus={attendancesRecord[item.id].status}
              onLongPress={() => {
                router.push(`/member-detail/${item.id}`);
              }}
              onPressed={(member) => {
                try {
                  setMember(member);
                  bottomRef.current?.expand();
                } catch (e) {
                  if (e instanceof Error) {
                    Logger.debug(`Stack: ${e.stack}`);
                  } else {
                    Logger.error(stringify(e));
                  }
                }
              }}
            />
          ) : null
        }
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
                setSorting(sorting === "이름" ? "출석" : "이름");
              }}
            >
              정렬: {sorting}
            </Text>

            <View style={{ height: 10 }} />
          </View>
        }
        ListEmptyComponent={
          <TouchableOpacity
            onPress={() => {
              dispatch(fetchCreateActivity(selectedDate));
            }}
          >
            <Text
              style={{
                color: colors.blue100,
                alignSelf: "center",
                fontSize: 16,
                fontWeight: "300",
              }}
            >
              {attendancesRecord
                ? `${statuses[attendaceFilter - 1]} 없음`
                : `출석을 시작하세요!`}
            </Text>
          </TouchableOpacity>
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
          member={selectedMember}
          status={attendancesRecord?.[selectedMember!.id].status ?? "불참"}
          ref={bottomRef}
          onItemPressed={(status) => {
            handleSheetChanges(status);
          }}
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
