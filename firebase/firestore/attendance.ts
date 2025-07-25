import { AttendanceEntry } from "@/models/activity";
import firestore from "@react-native-firebase/firestore";
import { getActivityById } from "./activities";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";

export async function getAttendanceByActivityId(
  activityId: string
): Promise<Record<string, AttendanceEntry>> {
  try {
    const activity = await getActivityById(activityId);
    return activity?.attendance ?? {};
  } catch (e) {
    console.log(`getAttendanceByActivityId error: ${e}`);
    return {};
  }
}

export async function getAttendanceOfMember(
  activityId: string,
  memberId: string
): Promise<AttendanceEntry | undefined> {
  try {
    const activity = await getActivityById(activityId);
    return activity?.attendance[memberId];
  } catch (e) {
    console.log(`getAttendanceOfMember error: ${e}`);
    return undefined;
  }
}

export async function setAttendanceForMember(
  activityId: string,
  memberId: string,
  entry: AttendanceEntry
): Promise<boolean> {
  try {
    const attendanceSnapShot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(activityId)
      .collection(ATTENDANCE_COLLECTION)
      .doc(memberId)
      .set(entry);
    return true;
  } catch (e) {
    console.log(`setAttendanceForMember error: ${e}`);
    return false;
  }
}
