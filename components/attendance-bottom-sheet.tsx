import { colors } from "@/constants/colors";
import { AttendanceStatus } from "@/models/attendace-status";
import { Member } from "@/models/member";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Image, ImageSource } from "expo-image";
import { Ref, useCallback, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AttendanceBottomSheetProps = {
  member: Member;
  status: AttendanceStatus;
  ref: Ref<BottomSheetMethods>;
  onItemPressed: (status: AttendanceStatus) => void;
  close: () => void;
};

type AttendanceAsset = {
  icon: ReturnType<typeof require>;
  color: string;
};

export default function AttendanceBottomSheet({
  member,
  status,
  ref,
  onItemPressed,
  close,
}: AttendanceBottomSheetProps) {
  const insets = useSafeAreaInsets();
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

  const attendanceData = useMemo(() => {
    return Object.entries(attendanceLabel).map(([status, asset]) => ({
      status: status as AttendanceStatus,
      asset,
    }));
  }, [attendanceLabel]);

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      style={styles.bottomSheetDecoration}
      ref={ref}
      enableDynamicSizing={true}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <Text style={styles.titleText}>{`${member.name}님의 출석`}</Text>

        <View>
          <FlatList
            contentContainerStyle={{
              alignContent: "flex-start",
              gap: 13,
            }}
            data={attendanceData}
            renderItem={({ item }) => (
              <ItemView
                status={item.status}
                asset={attendanceLabel[item.status]}
                onItemPressed={onItemPressed}
                isSelected={status === item.status}
              />
            )}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

type ItemProps = {
  status: AttendanceStatus;
  asset: AttendanceAsset;
  onItemPressed: (status: AttendanceStatus) => void;
  isSelected: boolean;
};
function ItemView({ status, asset, onItemPressed, isSelected }: ItemProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        onItemPressed(status);
      }}
    >
      <View style={styles.itemContainer}>
        <Image style={styles.statusIcon} source={asset.icon as ImageSource} />
        <Text style={styles.itemText}>{status}</Text>
        {isSelected && (
          <Image
            style={[styles.checkIcon, { marginLeft: "auto" }]}
            source={require("@/assets/images/check-icon.png")}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomSheetDecoration: {
    zIndex: 10,
    elevation: 10,
  },
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 13,
    gap: 22,
  },
  titleText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "semibold",
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    gap: 6,
  },
  statusIcon: {
    width: 36,
    height: 36,
  },
  checkIcon: {
    width: 36,
    height: 24,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
  },
});
