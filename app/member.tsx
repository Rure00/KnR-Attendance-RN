import { StyleSheet, Text, View } from "react-native";

export default function MemberScreen() {
  return (
    <View style={styles.container}>
      <Text>MemberScreen</Text>
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
