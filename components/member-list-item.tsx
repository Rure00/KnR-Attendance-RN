import { colors } from "@/constants/colors";
import { Member } from "@/models/member";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
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

type MemberListItemProps = {
  member: Member;
  onPressed: (member: Member) => void;
  doDelete: (member: Member) => void;
};

const MaxDragOffset = -150;
const DragCompensation = 20;

export default function MemberListItem({
  member,
  onPressed,
  doDelete,
}: MemberListItemProps) {
  const [containerHeight, setHeight] = useState(0);

  const translateX = useSharedValue(0);
  const boxAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const log = (n: number) => {
    Logger.debug(`drag: ${n}`);
  };

  const drag = Gesture.Pan()
    .activeOffsetY(Number.MAX_SAFE_INTEGER)
    .activeOffsetX([-10, 10])
    .onChange((event) => {
      const target = clamp(
        translateX.value + event.changeX,
        MaxDragOffset,
        -MaxDragOffset
      );
      translateX.value = withSpring(target, {
        damping: 20,
        stiffness: 1000,
      });
    })
    .onEnd((event) => {
      if (MaxDragOffset + DragCompensation > translateX.value) {
        runOnJS(setCall)(true);
      } else if (-MaxDragOffset - DragCompensation < translateX.value) {
        runOnJS(doDelete);
      }

      runOnJS(log);

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
          Logger.error(stringify(e));
        }
      })();
    }
  }, [doCallScreen]);

  return (
    <GestureHandlerRootView>
      <View style={{ position: "relative" }}>
        <View style={{ position: "absolute", flexDirection: "row" }}>
          <View
            style={[
              styles.hiddenDeleteContainer,
              { height: containerHeight, width: "50%" },
            ]}
          >
            <Image
              style={styles.hiddenLabel}
              source={require("@/assets/images/delete-icon.png")}
            />
            <Text style={styles.hiddenText}>삭제</Text>
          </View>

          <View
            style={[
              styles.hiddenCallContainer,
              {
                height: containerHeight,
                width: "50%",
                marginLeft: "auto",
              },
            ]}
          >
            <Image
              style={styles.hiddenLabel}
              source={require("@/assets/images/call-icon.png")}
            />
            <Text style={styles.hiddenText}>통화</Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            onPressed(member);
          }}
        >
          <GestureDetector gesture={drag} touchAction="pan-x">
            <Animated.View
              onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height);
              }}
              style={[
                styles.topItemContainer,
                boxAnimatedStyles,
                { backgroundColor: colors.white },
              ]}
            >
              <Text style={styles.nameText}>{member.name}</Text>
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  hiddenCallContainer: {
    backgroundColor: colors.blue50,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    paddingEnd: 40,
    gap: 8,
  },
  hiddenDeleteContainer: {
    backgroundColor: colors.red100,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",

    paddingStart: 40,
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

  topItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 17,
    gap: 10,
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
