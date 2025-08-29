import { Member } from "@/models/member";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import firestore from "@react-native-firebase/firestore";
import { Result } from "../result";

const MEMBER_COLLECTION = "member";

export async function getAllMembers(): Promise<Result<Member[]>> {
  try {
    const memberDocs = await firestore().collection(MEMBER_COLLECTION).get();

    const memebers: Member[] = memberDocs.docs.map((doc) => {
      const data = doc.data();

      return {
        ...(data as Member),
        id: doc.id,
      };
    });

    return {
      message: "",
      isSuccess: true,
      data: memebers,
    };
  } catch (e) {
    Logger.error(`getAllMembers: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function getMemberById(id: string): Promise<Result<Member>> {
  try {
    const memberDocs = await firestore()
      .collection(MEMBER_COLLECTION)
      .doc(id)
      .get();

    if (memberDocs.exists()) {
      const member = {
        ...(memberDocs.data() as Member),
        id,
      } as Member;

      return {
        message: "",
        isSuccess: true,
        data: member,
      };
    } else {
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    }
  } catch (e) {
    Logger.error(`getMemberById: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function createNewMember(
  member: Omit<Member, "id">
): Promise<Result<Member>> {
  try {
    const docRef = await firestore().collection(MEMBER_COLLECTION).add(member);
    const getMemberResult = await getMemberById(docRef.id);

    return {
      message: "",
      isSuccess: true,
      data: getMemberResult!.data,
    };
  } catch (e) {
    Logger.error(`createNewMember: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function updateMember(member: Member): Promise<Result<Member>> {
  try {
    const { id, ...updated } = { ...member };
    await firestore().collection(MEMBER_COLLECTION).doc(member.id).set(updated);

    const getMemberResult = await getMemberById(id);

    return {
      message: "",
      isSuccess: true,
      data: getMemberResult!.data,
    };
  } catch (e) {
    Logger.error(`updateMember: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function deleteMember(member: Member): Promise<Result<boolean>> {
  try {
    await firestore().collection(MEMBER_COLLECTION).doc(member.id).delete();
    return {
      message: "",
      isSuccess: true,
      data: true,
    };
  } catch (e) {
    Logger.error(`deleteMember: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}
