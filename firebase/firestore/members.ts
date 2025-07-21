import { Member } from "@/models/member";
import firestore from "@react-native-firebase/firestore";

const MEMBER_COLLECTION = "member";



export async function getAllMembers(): Promise<Member[]> {
  const memberDocs = await firestore().collection(MEMBER_COLLECTION).get();

  const memebers: Member[] = memberDocs.docs.map((doc) => {
    const data = doc.data();

    return {
      ...(data as Member),
      id: doc.id,
    };
  });

  return memebers;
}

async function createNewMember(member: Omit<Member, "id">): Promise<Boolean> {
  try {
    await firestore().collection(MEMBER_COLLECTION).add(member);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
