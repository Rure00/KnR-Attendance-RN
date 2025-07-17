import { colors } from "@/constants/colors";
import { useEffect, useRef } from "react";
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
  isFocused?: boolean;
};

export default function CustomTextInput({
  containerStyle,
  labelStyle,
  label,
  style,
  value,
  isFocused,
  ...rest
}: TextInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    console.log(`isFocues: ${isFocused}`);
    if (isFocused) {
      inputRef.current!!.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isFocused]);

  return (
    <View style={containerStyle}>
      {value && label && <Text style={[labelStyle]}>{label}</Text>}
      <TextInput
        {...rest}
        style={[style, styles.inputContainer]}
        value={value}
        ref={inputRef}
        autoFocus={true}
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
