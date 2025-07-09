import { StyleSheet, Text, View } from "react-native";

export default function SaveScreen() {
  return (
    <View style={styles.container}>
      <Text>SaveScreen</Text>
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
