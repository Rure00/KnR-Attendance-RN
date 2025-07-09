import { colors } from "@/constants/colors";
import { Stack, useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: styles.container,
        headerTitleStyle: styles.title,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "KnR 출석부",
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => router.push("/settings")}
              >
                <Image
                  style={styles.settingsButton}
                  source={require("../assets/images/setting_button.png")}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      <Stack.Screen
        name="settings/index"
        options={{
          headerTitle: "설정",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue100,
  },
  title: {
    fontSize: 22,
    fontWeight: "semibold",
    color: colors.white,
  },
  settingsButton: {
    marginRight: 10,
    width: 24,
    height: 24,
  },
});
