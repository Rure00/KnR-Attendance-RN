import { Member } from "@/models/member";
import firestore from "@react-native-firebase/firestore";

const MEMBER_COLLECTION = "member";

export async function getAllMembers(): Promise<Member[]> {
  try {
    const memberDocs = await firestore().collection(MEMBER_COLLECTION).get();

    const memebers: Member[] = memberDocs.docs.map((doc) => {
      const data = doc.data();

      return data as Member;
    });

    return memebers;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  try {
    const memberDocs = await firestore()
      .collection(MEMBER_COLLECTION)
      .doc(id)
      .get();

    if (memberDocs.exists()) {
      return memberDocs.data() as Member;
    } else {
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function createNewMember(
  member: Omit<Member, "id">
): Promise<boolean> {
  try {
    await firestore().collection(MEMBER_COLLECTION).add(member);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function updateMember(member: Member): Promise<boolean> {
  try {
    await firestore().collection(MEMBER_COLLECTION).doc(member.id).set(member);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function deleteMember(member: Member): Promise<boolean> {
  try {
    await firestore().collection(MEMBER_COLLECTION).doc(member.id).delete();
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
