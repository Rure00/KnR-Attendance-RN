import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent } from "react-native";

// https://stackoverflow.com/questions/46587006/how-to-get-a-height-of-a-keyboard-in-react-native
// KeyBoardAvodingView보다 정확하고 일반적임.

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
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
