import MemberListItem from "@/components/member-list-item";
import { globalStyles } from "@/constants/styles";
import { Member, testMembers } from "@/models/member";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MemberListScreen() {
  const router = useRouter();
  const [memberList, setMemberList] = useState<Member[]>(testMembers);

  return (
    <View style={[styles.background]}>
      <Text style={styles.topText}>{`${memberList.length}명`}</Text>

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={memberList}
        keyExtractor={(member) => member.id}
        renderItem={({ item }) => (
          <MemberListItem
            member={item}
            onPressed={() => {
              router.push(`/member-detail/${item.id}`);
            }}
            doDelete={() => {
              console.log(`MemberListScreen: Member Do Delete!`);
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: StyleSheet.flatten([globalStyles.background, { paddingTop: 8 }]),
  flatListContainer: {
    gap: 8,
    alignContent: "flex-start",
  },
  topText: {
    fontSize: 24,
    fontWeight: "600",
    marginStart: 12,
    marginTop: 20,
    marginBottom: 15,
  },
});
