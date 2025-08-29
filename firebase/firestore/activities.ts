import { Activity, AttendanceEntry } from "@/models/activity";
import { AttendanceStatus } from "@/models/attendace-status";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { Result } from "../result";
import { getAttendanceByActivityId } from "./attendance";
import { getAllMembers } from "./members";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";
const DATE_FILED = `date`;

export async function getAllActivities(): Promise<Result<Activity[]>> {
  try {
    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .get();

    const activities: Activity[] = await Promise.all(
      activityDocs.docs.map(async (doc) => {
        const ts = doc.data().date as Timestamp;
        return fetchActivityEntity(doc.id, ts.toDate());
      })
    );
    return {
      message: "",
      isSuccess: true,
      data: activities,
    };
  } catch (e) {
    Logger.error(`getAllActivities error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function getActivityById(id: string): Promise<Result<Activity>> {
  try {
    const snapshot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(id)
      .get();

    if (!snapshot.exists()) {
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    } else {
      const ts = snapshot.data()!.date as Timestamp;
      const activity = await fetchActivityEntity(id, ts.toDate());
      return {
        message: "",
        isSuccess: true,
        data: activity,
      };
    }
  } catch (e) {
    Logger.error(`getActivityById error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function getActivityByDate(date: Date): Promise<Result<Activity>> {
  try {
    const snapshot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .where(DATE_FILED, `==`, date)
      .get();

    if (snapshot.empty) {
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    } else {
      const activity = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const ts = doc.data().date as Timestamp;
          return fetchActivityEntity(doc.id, ts.toDate());
        })
      );

      return {
        message: "",
        isSuccess: true,
        data: activity[0],
      };
    }
  } catch (e) {
    Logger.error(`getActivityByDate error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function createNewActivity(date: Date): Promise<Result<Activity>> {
  try {
    const entity = { date: date };

    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .add(entity);

    await setAttendanceDefault(activityDocs.id);

    // fetch
    const activity = await fetchActivityEntity(activityDocs.id, date);
    return {
      message: "",
      isSuccess: true,
      data: activity,
    };
  } catch (e) {
    Logger.error(`createNewActivity error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function deleteActivity(
  activity: Activity
): Promise<Result<boolean>> {
  try {
    await firestore().collection(ACTIVITY_COLLECTION).doc(activity.id).delete();
    return {
      message: "",
      isSuccess: true,
      data: true,
    };
  } catch (e) {
    Logger.error(`deleteActivity error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

export async function updateActivity(
  activity: Activity
): Promise<Result<Activity>> {
  try {
    // Change to ActivityEntity.
    const entity = { date: activity.date };
    const attendances = activity.attendance;

    await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(activity.id)
      .set(entity);

    const updated = await fetchActivityEntity(activity.id, activity.date);

    return {
      message: "",
      isSuccess: true,
      data: updated,
    };
  } catch (e) {
    Logger.error(`updateActivity error: ${stringify(e)}`);
    return {
      message: "",
      isSuccess: false,
      data: undefined,
    };
  }
}

async function fetchActivityEntity(id: string, date: Date): Promise<Activity> {
  const attendances = await getAttendanceByActivityId(id);
  const members = Object.entries(attendances.data!.attendance);

  let entire = 0;
  let attended = 0;
  let late = 0;
  let notAttended = 0;
  let unexcused = 0;

  members.forEach((it) => {
    switch (it[1].status) {
      case "참석":
        attended++;
        break;
      case "지각":
        late++;
        break;
      case "불참":
        notAttended++;
        break;
      case "무단":
        unexcused++;
        break;
    }

    entire++;
  });

  return {
    id,
    date,
    entire,
    attended,
    late,
    notAttended,
    unexcused,
  } as Activity;
}

async function setAttendanceDefault(activityId: string): Promise<boolean> {
  try {
    const attendanceEntries: Record<string, AttendanceEntry> = {};

    (await getAllMembers()).data?.forEach((member) => {
      attendanceEntries[member.id] = {
        createdAt: new Date(),
        status: "불참" as AttendanceStatus,
      };
    });

    const collections = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(activityId)
      .collection(ATTENDANCE_COLLECTION);

    if (attendanceEntries != undefined) {
      const batchWrites = Object.entries(attendanceEntries).map(
        ([id, entry]) => {
          return collections.doc(id).set(entry);
        }
      );

      await Promise.all(batchWrites);
      return true;
    }

    return false;
  } catch (e) {
    Logger.error(`setAttendanceForMember error: ${stringify(e)}`);
    return false;
  }
}
