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

type TextInputProps = React.ComponentProps<typeof TextInput> & {
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  label?: string;
};

export default function CustomTextInput({
  containerStyle,
  labelStyle,
  label,
  style,
  value,
  ...rest
}: TextInputProps) {
  return (
    <View style={containerStyle}>
      {value && label && <Text style={[labelStyle]}>{label}</Text>}
      <TextInput
        {...rest}
        style={[style, styles.inputContainer]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: colors.blue100,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
});
