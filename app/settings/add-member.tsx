import { StyleSheet, Text, View } from "react-native";

export default function AddMemberScreen() {
  return (
    <View style={styles.container}>
      <Text>AddMemberScreen</Text>
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
