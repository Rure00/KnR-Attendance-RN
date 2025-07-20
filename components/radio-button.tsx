import { colors } from "@/constants/colors";
import { SCREEN_WIDTH } from "@/constants/window";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";

type CustomRadioButtonProps = {
  values: string[];
  label?: string;
  onClick: (index: number) => void;
  selectedValues: boolean[];

  colorsOnSelect?: string | string[];
  labelStyle?: StyleProp<TextStyle>;
};

export default function CustomRadioButton({
  values,
  label,
  onClick,
  selectedValues,
  colorsOnSelect,
  labelStyle,
}: CustomRadioButtonProps) {
  const getColors = (i: number) => {
    if (colorsOnSelect == null) {
      return colors.blue100;
    } else if (Array.isArray(colorsOnSelect)) {
      return colorsOnSelect[i];
    } else {
      return colorsOnSelect;
    }
  };

  const headerItemsDst = 12;
  const headerItemSize =
    (SCREEN_WIDTH - headerItemsDst * (values.length + 1)) / values.length;

  return (
    <View style={{ gap: 10 }}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={styles.container}>
        {values.map((it, index) => {
          return selectedValues[index] ? (
            <Pressable
              key={index}
              onPress={() => onClick(index)}
              style={[
                styles.selectedContainer,
                {
                  width: headerItemSize,
                  height: headerItemSize / 2,
                  backgroundColor: getColors(index),
                },
              ]}
            >
              <Text style={styles.selectedText}>{it}</Text>
            </Pressable>
          ) : (
            <Pressable
              key={index}
              onPress={() => onClick(index)}
              style={[
                styles.unSelectedContainer,
                {
                  width: headerItemSize,
                  height: headerItemSize / 2,
                },
              ]}
            >
              <Text style={styles.unSelectedText}>{it}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  selectedText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "semibold",
  },
  unSelectedContainer: {
    borderRadius: 4,
    backgroundColor: colors.white,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unSelectedText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "semibold",
  },
});
