import CustomTextInput from "@/components/input-text";
import { useKeyboardHeight } from "@/components/keyboard-state";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const steps = [
  { key: "name", type: "text", label: "이름을 " },
  { key: "birth", type: "date", label: "생년월일을 선택해주세요" },
  { key: "joinAt", type: "date", label: "입단일을 선택해주세요" },

  {
    key: "position",
    type: "radio",
    label: "포지션을 선택해주세요",
    options: ["FW", "MF", "DF", "GK"],
  },
];

export default function AddMemberScreen() {
  const [number, setNumber] = useState<string>("");
  const keyboardHeight = useKeyboardHeight();

  return (
    <View style={{ flex: 1 }}>
      <CustomTextInput
        value={number}
        onChange={(text) => setNumber(text)}
        containerStyle={styles.inputContainer}
        textStyle={styles.input}
        labelStyle={styles.label}
        label={"이름"}
        placeholder={"이름"}
      />

      <Pressable
        style={[styles.nextButtonEnabled, { marginBottom: keyboardHeight }]}
      >
        <Text style={styles.nextTitleEnabled}>다음</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  label: {
    fontSize: 14,
    color: colors.blue100,
    fontWeight: "semibold",
  },
  input: {
    padding: 12,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.blue100,
  },
  nextButtonEnabled: {
    padding: 14,
    alignItems: "center",
    backgroundColor: colors.blue100,
    width: "100%",
  },
  nextTitleEnabled: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.white,
  },
});
