import GridView from "@/components/grid-view";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import {
  AttendanceHistory,
  dummyAttendanceHistory,
} from "@/models/attedance-history";
import { Member, testMembers } from "@/models/member";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { phoneNumberToDashSeperated } from "@/utils/phoneNumberToDashSeperated";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MemberDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [member, setMember] = useState<Member>();
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory>(
    dummyAttendanceHistory
  );

  const [monthContainerWidth, setMonthContainerWidth] = useState(0);
  const monthItemDst = 8;
  const monthItemSize = (monthContainerWidth - monthItemDst * (6 + 1)) / 6;

  useEffect(() => {
    // getMemberData
    const member = testMembers.find((value) => {
      return value.id == id;
    });

    member && setMember(member);
  }, []);

  useEffect(() => {
    if (member == undefined) return;
  }, [member]);

  if (member == undefined) return null;
  return (
    <View style={styles.background}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={attendanceHistory?.yearlyAttendance}
        renderItem={({ item: yearItem }) => (
          <View
            style={styles.whiteRounded}
            onLayout={(e) => setMonthContainerWidth(e.nativeEvent.layout.width)}
          >
            <Text style={styles.topText}>{yearItem.year}</Text>

            <GridView
              data={Array.from(Object.values(yearItem.monthlyAttendances))}
              mainAxis="row"
              mainNum={6}
              mainGap={monthItemDst}
              crossGap={monthItemDst}
              renderItem={(monthItem, index) => (
                <View
                  style={[
                    styles.monthBoxItem,
                    {
                      backgroundColor: monthItem.some(
                        (it) => it.attendance === "참석"
                      )
                        ? colors.blue100
                        : colors.gray100,
                      width: monthItemSize,
                      height: monthItemSize,
                    },
                  ]}
                >
                  <Text style={styles.monthBoxText}>{`${index + 1}월`}</Text>
                  <Text style={styles.monthBoxText}>
                    {`${
                      monthItem.filter((it) => it.attendance === "참석").length
                    }/${monthItem.length}`}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            <View style={styles.whiteRounded}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={styles.headerNameText}>{member?.name}</Text>
                {/** TODO: 정보수정 버튼 들어가야함. */}
              </View>

              <View style={{ height: 16 }} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                  onPress={() => {}}
                >
                  <Image
                    style={{
                      aspectRatio: 1,
                      height: 20,
                    }}
                    source={require("@/assets/images/call-background-icon.png")}
                  />
                  <Text style={styles.headerPhoneNumberText}>
                    {phoneNumberToDashSeperated(member.phoneNumber)}
                  </Text>
                </TouchableOpacity>

                <Text
                  style={styles.headerJoinAtText}
                >{`입단일: ${dateToDotSeparated(member.joinAt)}`}</Text>
              </View>

              <View style={{ height: 16 }} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingStart: 16,
                }}
              >
                <View style={{ flexDirection: "column", gap: 6 }}>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <Text
                      style={[
                        styles.headerPositionText,
                        {
                          backgroundColor: member.position.some(
                            (it) => it === "FW"
                          )
                            ? colors.red200
                            : colors.gray100,
                        },
                      ]}
                    >
                      FW
                    </Text>

                    <Text
                      style={[
                        styles.headerPositionText,
                        {
                          backgroundColor: member.position.some(
                            (it) => it === "MF"
                          )
                            ? colors.green200
                            : colors.gray100,
                        },
                      ]}
                    >
                      MF
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 6 }}>
                    <Text
                      style={[
                        styles.headerPositionText,
                        {
                          backgroundColor: member.position.some(
                            (it) => it === "DF"
                          )
                            ? colors.blue200
                            : colors.gray100,
                        },
                      ]}
                    >
                      DF
                    </Text>

                    <Text
                      style={[
                        styles.headerPositionText,
                        {
                          backgroundColor: member.position.some(
                            (it) => it === "GK"
                          )
                            ? colors.yellow200
                            : colors.gray100,
                        },
                      ]}
                    >
                      GK
                    </Text>
                  </View>
                </View>

                <View style={styles.headerAttendanceRateBox}>
                  <Text style={styles.headerAttendanceRateText}>출석률</Text>
                  <Text
                    style={[styles.headerAttendanceRateText, { fontSize: 20 }]}
                  >
                    {`${attendanceHistory.attendanceRate}%`}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 16 }} />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    borderWidth: 2,
  },
  flatListContainer: {
    padding: 6,
  },
  whiteRounded: StyleSheet.flatten([
    globalStyles.roundContainerWhite,
    { padding: 8 },
  ]),

  headerNameText: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerPhoneNumberText: {
    fontSize: 18,
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  headerJoinAtText: {
    fontSize: 16,
    fontWeight: "400",
  },
  headerPositionText: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    width: 50,

    color: colors.white,
    fontSize: 16,
    fontWeight: "700",

    textAlign: "center",
  },

  headerAttendanceRateBox: {
    borderRadius: 6,
    backgroundColor: colors.blue100,
    justifyContent: "center",
    alignItems: "center",

    paddingVertical: 6,
    paddingHorizontal: 20,
    gap: 6,
  },
  headerAttendanceRateText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.white,
  },

  topText: {
    fontSize: 20,
    fontWeight: "500",
  },

  monthBoxItem: {
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 6,
  },
  monthBoxText: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.white,
  },
});
