import { colors } from "@/constants/colors";
import { globalStyles } from "@/constants/styles";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={[styles.background]}>
      <ItemView
        title="멤버 목록"
        onClick={() => {
          router.push("/settings/member-list");
        }}
      />
      <ItemView
        title="멤버 추가"
        onClick={() => {
          router.push("/settings/add-member");
        }}
      />
      <ItemView
        title="출석부 저장"
        onClick={() => {
          router.push("/settings/save");
        }}
      />
    </View>
  );
}

type ItemViewProps = {
  title: string;
  onClick: () => void;
};
function ItemView({ title, onClick }: ItemViewProps) {
  return (
    <TouchableOpacity onPress={onClick} style={styles.itemContainer}>
      <Text style={styles.itemTitleText}>{title}</Text>
      <Image
        style={styles.arrowImage}
        source={require("@/assets/images/button-arrow-icon.png")}
        pointerEvents="none"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: colors.gray100,
    gap: 13,
    padding: 13,
  },
  itemContainer: StyleSheet.flatten([
    globalStyles.roundContainerWhite,
    {
      flexDirection: "row",
      width: "100%",
      paddingVertical: 13,
      paddingHorizontal: 12,
      justifyContent: "space-between",
    },
  ]),
  itemTitleText: {
    fontSize: 18,
    fontWeight: "400",
  },
  arrowImage: {
    height: 24,
    width: 24,
  },
});
