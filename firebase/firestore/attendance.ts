import { AttendanceEntry } from "@/models/activity";
import firestore from "@react-native-firebase/firestore";
import { Result } from "../result";
import { getActivityById } from "./activities";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";

export async function getAttendanceByActivityId(
  activityId: string
): Promise<Result<Record<string, AttendanceEntry>>> {
  try {
    const result = await getActivityById(activityId);
    if (result.isSuccess) {
      return {
        message: "",
        isSuccess: true,
        data: result.data!.attendance,
      };
    } else {
      return {
        message: "",
        isSuccess: false,
        data: {},
      };
    }
  } catch (e) {
    console.log(`getAttendanceByActivityId error: ${e}`);
    return {
      message: "",
      isSuccess: false,
      data: {},
    };
  }
}

export async function getAttendanceOfMember(
  activityId: string,
  memberId: string
): Promise<Result<AttendanceEntry>> {
  try {
    const result = await getActivityById(activityId);
    if (result.isSuccess) {
      return {
        message: "",
        isSuccess: true,
        data: result.data!.attendance[memberId],
      };
    } else {
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    }
  } catch (e) {
    console.log(`getAttendanceOfMember error: ${e}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function setAttendanceForMember(
  activityId: string,
  memberId: string,
  entry: AttendanceEntry
): Promise<Result<boolean>> {
  try {
    const attendanceSnapShot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(activityId)
      .collection(ATTENDANCE_COLLECTION)
      .doc(memberId)
      .set(entry);
    return {
      message: "",
      isSuccess: true,
      data: true,
    };
  } catch (e) {
    console.log(`setAttendanceForMember error: ${e}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}
