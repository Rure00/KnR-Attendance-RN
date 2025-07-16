import { colors } from "@/constants/colors";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type TextInputProp = {
  value: string;
  onChange: (text: string) => void;

  containerStyle: StyleProp<ViewStyle>;
  textStyle: StyleProp<TextStyle>;
  labelStyle: StyleProp<TextStyle> | null;

  placeholder: string | null;
  label: string | null;
};

export default function CustomTextInput({
  value,
  onChange,
  containerStyle,
  textStyle,
  labelStyle,
  placeholder,
  label,
}: TextInputProp) {
  return (
    <View style={containerStyle}>
      {label && <Text style={[labelStyle]}>이름</Text>}
      <TextInput
        style={[textStyle, { paddingHorizontal: 0, paddingVertical: 10 }]}
        onChangeText={(text) => onChange(text)}
        value={value}
        placeholder={placeholder ?? ""}
        keyboardType="numeric"
        cursorColor={colors.blue100}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
