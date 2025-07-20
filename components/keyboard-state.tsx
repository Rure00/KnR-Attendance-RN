import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// https://stackoverflow.com/questions/46587006/how-to-get-a-height-of-a-keyboard-in-react-native
// KeyBoardAvodingView보다 정확하고 일반적임.

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(
          e.endCoordinates.height -
            (Platform.OS === "android" ? 0 : insets.bottom)
        );
      }
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};
