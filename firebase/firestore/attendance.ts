import { AttendanceEntry } from "@/models/activity";
import {
  AttendanceHistory,
  YearlyAttendance,
} from "@/models/attedance-history";
import { dotSeparatedToDate } from "@/utils/dotSeparatedToDate";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../config";
import { Result } from "../result";
import { getActivityById, getAllActivities } from "./activities";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";

export async function getAttendanceByActivityId(
  activityId: string
): Promise<Result<Record<string, AttendanceEntry>>> {
  try {
    Logger.debug("getAttendanceByActivityId starts");

    const activityDocRef = doc(db, ACTIVITY_COLLECTION, activityId);
    const attendanceColRef = collection(activityDocRef, ATTENDANCE_COLLECTION);

    const attendance: Record<string, AttendanceEntry> = {};
    const querySnapshot = await getDocs(attendanceColRef);
    querySnapshot.forEach((doc) => {
      attendance[doc.id] = doc.data() as AttendanceEntry;
    });

    return {
      message: "",
      isSuccess: true,
      data: attendance,
    };
  } catch (e) {
    Logger.error(`getAttendanceByActivityId error: ${stringify(e)}`);
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
  Logger.debug("getAttendanceOfMember starts");
  try {
    const result = await getActivityById(activityId);
    if (result.isSuccess) {
      Logger.debug(
        `getAttendanceOfMember success: ${stringify(
          result.data!.attendance[memberId]
        )}`
      );
      return {
        message: "",
        isSuccess: true,
        data: result.data!.attendance[memberId],
      };
    } else {
      Logger.debug(`getAttendanceOfMember fail`);
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    }
  } catch (e) {
    Logger.error(`getAttendanceOfMember error: ${stringify(e)}`);
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
  Logger.debug(`setAttendanceForMember starts`);
  try {
    const activityDocRef = doc(db, ACTIVITY_COLLECTION, activityId);
    const attendanceColRef = collection(activityDocRef, ATTENDANCE_COLLECTION);

    await setDoc(doc(attendanceColRef, memberId), entry);

    Logger.debug(`setAttendanceForMember success: ${true}`);

    return {
      message: "",
      isSuccess: true,
      data: true,
    };
  } catch (e) {
    Logger.error(`setAttendanceForMember error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function getAllHistoryOfMember(
  memberId: string
): Promise<Result<AttendanceHistory | undefined>> {
  Logger.debug(`getAllHistoryOfMember starts`);

  try {
    let attendanceRate = 0;
    let total = 0;
    let attendNum = 0;
    let nonAttendNum = 0;
    let lateNum = 0;
    let forcibleNum = 0;

    const yearlyAttendanceMap = new Map<number, YearlyAttendance>();

    const activities = (await getAllActivities()).data ?? [];
    activities.forEach((it) => {
      const entry = it.attendance[memberId];
      if (!entry) return; // 해당 member 기록 없으면 skip

      const date = dotSeparatedToDate(it.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1~12월

      total++;
      switch (entry.status) {
        case "참석":
          attendNum++;
          break;
        case "불참":
          nonAttendNum++;
          break;
        case "지각":
          lateNum++;
          break;
        case "무단":
          forcibleNum++;
          break;
      }

      if (!yearlyAttendanceMap.has(year)) {
        yearlyAttendanceMap.set(year, {
          year,
          monthlyAttendances: {},
        });
      }
      const yearly = yearlyAttendanceMap.get(year)!;
      if (!yearly.monthlyAttendances[month]) {
        yearly.monthlyAttendances[month] = [];
      }
      yearly.monthlyAttendances[month].push({
        date: it.date,
        attendance: entry.status,
      });
    });

    if (total > 0) {
      attendanceRate = Math.round((attendNum / total) * 100);
    }

    const result: AttendanceHistory = {
      memberId,
      attendanceRate,
      total,
      attendNum,
      nonAttendNum,
      lateNum,
      forcibleNum,
      yearlyAttendance: Array.from(yearlyAttendanceMap.values()),
    };

    Logger.debug(`getAllHistoryOfMember success: ${stringify(result)}`);

    return {
      message: "",
      isSuccess: true,
      data: result,
    };
  } catch (e) {
    Logger.error(`setAttendanceForMember error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}
