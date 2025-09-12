import { Activity, AttendanceEntry } from "@/models/activity";
import { AttendanceStatus } from "@/models/attendace-status";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config";
import { Result } from "../result";
import { getAttendanceByActivityId } from "./attendance";
import { getAllMembers } from "./members";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";
const DATE_FIELD = `date`;

export async function getAllActivities(): Promise<Result<Activity[]>> {
  try {
    const activityColRef = collection(db, ACTIVITY_COLLECTION);

    const activitySnapshot = await getDocs(activityColRef);

    const activities: Activity[] = await Promise.all(
      activitySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const dateStr = data.date;
        return fetchActivityEntity(doc.id, dateStr);
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
  Logger.debug(`getActivityById starts`)
  try {
    const activityDoc = await getDoc(doc(db, ACTIVITY_COLLECTION, id));

    if (!activityDoc.exists()) {
      Logger.info(`getActivityById: activityDoc not exists.`);
      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    } else {
      const dateStr = activityDoc.data()!.date;
      const activity = await fetchActivityEntity(id, dateStr);

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
    const dateQuery = dateToDotSeparated(date);
    const q = query(
      collection(db, ACTIVITY_COLLECTION),
      where(DATE_FIELD, `==`, dateQuery)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Logger.info(`getActivityByDate: querySnapshot is empty.`);

      return {
        message: "",
        isSuccess: false,
        data: undefined,
      };
    } else {
      Logger.info(`getActivityByDate: getDocs success.`);

      const activity = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          return fetchActivityEntity(doc.id, dateQuery);
        })
      );

      Logger.debug(`getActivityByDate success: ${stringify(activity)}`);

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
    const dateStr = dateToDotSeparated(date);
    const entity = { date: dateStr };

    const activityDocs = await addDoc(
      collection(db, ACTIVITY_COLLECTION),
      entity
    );
    await setAttendanceDefault(activityDocs.id);

    // fetch
    const activity = await fetchActivityEntity(activityDocs.id, dateStr);
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
    await deleteDoc(doc(db, ACTIVITY_COLLECTION, activity.id));
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

    await updateDoc(doc(db, ACTIVITY_COLLECTION, activity.id), entity);
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

async function fetchActivityEntity(
  id: string,
  date: string
): Promise<Activity> {
  const attendances = await getAttendanceByActivityId(id);
  if (!attendances.isSuccess) {
    const msg = "fetchActivityEntity: getAttendanceByActivityId fail"
    Logger.error(msg)
    throw new Error(msg);
  } else {
    Logger.debug("fetchActivityEntity: getAttendanceByActivityId success")
  }

  const attedanceArray = Object.entries(attendances.data!);

  let entire = 0;
  let attended = 0;
  let late = 0;
  let notAttended = 0;
  let unexcused = 0;

  attedanceArray.forEach((it) => {
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
        createdAt: dateToDotSeparated(new Date()),
        status: "불참" as AttendanceStatus,
      };
    });

    const activityDocRef = doc(db, ACTIVITY_COLLECTION, activityId);

    if (attendanceEntries !== undefined) {
      const batch = writeBatch(db);

      Object.entries(attendanceEntries).forEach(([id, entry]) => {
        const entryDocRef = doc(
          collection(activityDocRef, ATTENDANCE_COLLECTION),
          id
        );
        batch.set(entryDocRef, entry);
      });

      await batch.commit();
    }

    return false;
  } catch (e) {
    Logger.error(`setAttendanceForMember error: ${stringify(e)}`);
    return false;
  }
}
