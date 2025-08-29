import { colors } from "@/constants/colors";
import { AttendanceStatus } from "@/models/attendace-status";
import { Member } from "@/models/member";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { Image, ImageSource } from "expo-image";
import * as Linking from "expo-linking";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type MemberItemProps = {
  member: Member;
  attendanceStatus: AttendanceStatus;
  onPressed: (member: Member) => void;
  onLongPress: (member: Member) => void;
};

type AttendanceAsset = {
  icon: ReturnType<typeof require>;
  color: string;
};

const MaxDragOffset = -150;
const DragCompensation = 20;

export default function MemberItem({
  member,
  attendanceStatus,
  onPressed,
  onLongPress,
}: MemberItemProps) {
  const [containerHeight, setHeight] = useState(0);

  const translateX = useSharedValue(0);
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const attendanceLabel: Record<AttendanceStatus, AttendanceAsset> =
    useMemo(() => {
      return {
        참석: {
          icon: require("@/assets/images/check-blue.png"),
          color: colors.blue200,
        },
        불참: {
          icon: require("@/assets/images/x-green.png"),
          color: colors.gray200,
        },
        지각: {
          icon: require("@/assets/images/check-green.png"),
          color: colors.gray200,
        },
        무단: {
          icon: require("@/assets/images/x-red.png"),
          color: colors.red200,
        },
      } as const;
    }, []);

  const drag = Gesture.Pan()
    .activeOffsetY(Number.MAX_SAFE_INTEGER)
    .activeOffsetX([-10, 10])
    .onChange((event) => {
      const target = clamp(translateX.value + event.changeX, MaxDragOffset, 0);
      translateX.value = withSpring(target, {
        damping: 20,
        stiffness: 1000,
      });
    })
    .onEnd((event) => {
      if (MaxDragOffset + DragCompensation > translateX.value) {
        runOnJS(setCall)(true);
      }

      translateX.value = withSpring(0, {
        damping: 40,
        stiffness: 1500,
      });
    });

  const [doCallScreen, setCall] = useState(false);
  useEffect(() => {
    if (doCallScreen) {
      const url = `tel:${member.phoneNumber}`;
      (async () => {
        try {
          if (await Linking.canOpenURL(url)) {
            Linking.openURL(url);
          } else {
            Logger.debug("Cannot Open CallScreen.");
          }

          setCall(false);
        } catch (e) {
          Logger.debug(stringify(e));
        }
      })();
    }
  }, [doCallScreen]);

  const longPressGesture = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      console.log(`hello`);
    });
  const composedGesture = Gesture.Simultaneous(drag, longPressGesture);

  return (
    <GestureHandlerRootView>
      <View style={{ position: "relative" }}>
        <View style={[styles.hiddenContainer, { height: containerHeight }]}>
          <Image
            style={styles.hiddenLabel}
            source={require("@/assets/images/call-icon.png")}
          />
          <Text style={styles.hiddenText}>통화</Text>
        </View>

        <Pressable
          onPress={() => {
            onPressed(member);
          }}
          onLongPress={() => {
            onLongPress(member);
          }}
        >
          <GestureDetector gesture={drag} touchAction="pan-x">
            <Animated.View
              onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height);
              }}
              style={[styles.topItemContainer, boxAnimatedStyles]}
            >
              <Image
                style={styles.label}
                source={attendanceLabel[attendanceStatus].icon as ImageSource}
              />

              <Text style={styles.nameText}>{member.name}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: attendanceLabel[attendanceStatus].color },
                ]}
              >
                {attendanceStatus}
              </Text>
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  hiddenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    backgroundColor: colors.blue50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    paddingEnd: 40,
    gap: 8,
  },
  hiddenText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "semibold",
  },
  hiddenLabel: {
    height: 20,
    width: 20,
  },

  touchRipple: {
    backgroundColor: "rgb(1, 11, 24)",
    borderWidth: 1,
    zIndex: 0.5,
  },

  topItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 17,
    gap: 10,

    backgroundColor: colors.white,
  },
  nameText: {
    color: colors.black,
    fontWeight: 500,
    fontSize: 18,
  },
  label: {
    width: 36,
    height: 36,
  },
  statusText: {
    fontWeight: 500,
    fontSize: 14,
    marginLeft: "auto",
  },
});
