import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { SCREEN_WIDTH } from "@/constants/window";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AttendanceRadioButtonProps = {
  values: [number, number, number, number, number];
  selectedIndex: number;
  onClick: (index: number) => void;
};

const headerItemsDst = 12;
const headerItemSize = (SCREEN_WIDTH - headerItemsDst * (5 + 1)) / 5;

export default function AttendanceRadioButton({
  values,
  selectedIndex,
  onClick,
}: AttendanceRadioButtonProps) {
  const korean = ["전체", "참석", "불참", "지각", "무단"];

  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TouchableOpacity
          style={
            selectedIndex == index
              ? styles.onButtonContainer
              : styles.offButtonContainer
          }
          onPress={() => {
            onClick(index);
          }}
          key={index}
        >
          <Text
            style={
              selectedIndex == index
                ? styles.onButtonText
                : styles.offButtonText
            }
          >
            {value}
          </Text>
          <Text
            style={
              selectedIndex == index
                ? styles.onButtonText
                : styles.offButtonText
            }
          >
            {korean[index]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  onButtonContainer: StyleSheet.flatten([
    globalStyles.roundContainerBlue,
    {
      justifyContent: "space-evenly",
      alignItem: "center",
      paddingVertical: 5,
      paddingHorizontal: 13,
      width: headerItemSize,
      height: headerItemSize,
    },
  ]),
  onButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
  },
  offButtonContainer: StyleSheet.flatten([
    globalStyles.roundContainerGray,
    {
      justifyContent: "space-evenly",
      alignItem: "center",
      width: headerItemSize,
      height: headerItemSize,
    },
  ]),
  offButtonText: {
    color: colors.gray200,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
  },
});
