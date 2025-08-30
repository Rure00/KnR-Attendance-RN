import { Member } from "@/models/member";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config";
import { Result } from "../result";

const MEMBER_COLLECTION = "member";

export async function getAllMembers(): Promise<Result<Member[]>> {
  try {
    const memberDocs = await getDocs(collection(db, MEMBER_COLLECTION));

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
    const memberDocs = await getDoc(doc(db, MEMBER_COLLECTION, id));

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
    const docRef = await addDoc(collection(db, MEMBER_COLLECTION), member);
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
    await updateDoc(doc(db, MEMBER_COLLECTION), updated);

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
    await deleteDoc(doc(db, MEMBER_COLLECTION, member.id));

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
