import { colors } from "@/constants/colors";
import store from "@/redux/store";
import * as Font from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setCustomText } from "react-native-global-props";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded, setfontsLoaded] = useState(false);

  async function getFont() {
    await Font.loadAsync({
      pretendard: require("@/assets/fonts/Pretendard-Regular.ttf"),
    });
    setfontsLoaded(true);
  }
  const customTextProps = {
    style: {
      fontFamily: "pretendard",
    },
  };
  setCustomText(customTextProps);

  return (
    // bottomsheet 사용하려면 추가해야함.
    // https://www.promleeblog.com/blog/post/168-react-native-bottom-sheet#5-gesturehandlerrootview-%EC%B6%94%EA%B0%80
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaView
          style={{ flex: 1 }}
          edges={{
            top: "off",
            left: "additive",
            bottom: "additive",
            right: "additive",
          }}
        >
          <Stack
            screenOptions={{
              headerStyle: styles.container,
              headerTitleStyle: styles.title,
              headerBackButtonDisplayMode: "minimal",
              headerTintColor: colors.white,
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerTitle: "K&R 출석부",
                headerRight: () => {
                  return (
                    <TouchableOpacity
                      style={{ paddingHorizontal: 10 }}
                      onPress={() => {
                        console.log("Click: Settings");
                        router.push("/settings");
                      }}
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
              name="member-detail/[id]"
              options={{
                headerTitle: "개인출석",
              }}
            />

            <Stack.Screen
              name="settings/index"
              options={{
                headerTitle: "설정",
              }}
            />
            <Stack.Screen
              name="settings/add-member"
              options={{
                headerTitle: "팀원 추가",
              }}
            />
            <Stack.Screen
              name="settings/save"
              options={{
                headerTitle: "저장",
              }}
            />
            <Stack.Screen
              name="settings/member-list"
              options={{
                headerTitle: "멤버 목록",
              }}
            />
          </Stack>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue100,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.white,
    fontFamily: "pretendard",
  },
  settingsButton: {
    width: 32,
    height: 32,
  },
});
