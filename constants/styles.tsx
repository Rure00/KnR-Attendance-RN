import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
  background: {
    flexGrow: 1,
    backgroundColor: colors.gray150,
  },

  containerWhite: {
    backgroundColor: colors.white,
  },
  containerBlue: {
    backgroundColor: colors.blue200,
  },

  roundContainerWhite: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  roundContainerBlue: {
    backgroundColor: colors.blue200,
    borderRadius: 5,
  },
  roundContainerGray: {
    backgroundColor: colors.gray100,
    borderRadius: 5,
  },
});
