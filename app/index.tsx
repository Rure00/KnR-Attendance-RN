import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          router.navigate("/settings");
        }}
      >
        Home
      </Text>

      <Link replace href="/settings">
        설정으로
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
