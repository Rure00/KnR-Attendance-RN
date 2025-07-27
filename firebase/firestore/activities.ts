import { Activity, AttendanceEntry } from "@/models/activity";
import firestore from "@react-native-firebase/firestore";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";
const DATE_FILED = `date`;

export interface ActivityEntity
  extends Omit<
    Activity,
    "id" | "attended" | "late" | "notAttended" | "unexcused" | "entire"
  > {}

export async function getAllActivities(): Promise<Activity[]> {
  try {
    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .get();

    const activities: Activity[] = await Promise.all(
      activityDocs.docs.map(async (doc) => {
        const data = doc.data();

        const activityEntity = {
          ...data,
          attendance: await fetchAttedanceCollection(doc.id),
        } as ActivityEntity;

        return fetchActivityEntity(doc.id, activityEntity);
      })
    );
    return activities;
  } catch (e) {
    console.log(`getAllActivities error: ${e}`);
    return [];
  }
}

export async function getActivityById(
  id: string
): Promise<Activity | undefined> {
  try {
    const snapshot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(id)
      .get();

    if (!snapshot.exists()) {
      return undefined;
    } else {
      const data = snapshot.data();

      const activityEntity = {
        ...data,
        attendance: await fetchAttedanceCollection(id),
      } as ActivityEntity;

      return fetchActivityEntity(id, activityEntity);
    }
  } catch (e) {
    console.log(`getActivityById error: ${e}`);
    return undefined;
  }
}

export async function getActivityByDate(
  date: Date
): Promise<Activity | undefined> {
  try {
    const snapshot = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .where(DATE_FILED, `==`, date)
      .get();

    if (snapshot.empty) {
      return undefined;
    } else {
      const activity = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const activityEntity = {
            ...data,
            attendance: await fetchAttedanceCollection(doc.id),
          } as ActivityEntity;

          return fetchActivityEntity(doc.id, activityEntity);
        })
      );

      return activity[0];
    }
  } catch (e) {
    console.log(`getActivityByDate error: ${e}`);
    return undefined;
  }
}

export async function createNewActivity(
  activity: Omit<ActivityEntity, "id">
): Promise<string | undefined> {
  try {
    const entity: Omit<ActivityEntity, "attendance"> = {
      ...activity,
    };

    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .add(entity);

    return activityDocs.id;
  } catch (e) {
    console.log(`createNewActivity error: ${e}`);
    return undefined;
  }
}

export async function deleteActivity(activity: Activity): Promise<boolean> {
  try {
    await firestore().collection(ACTIVITY_COLLECTION).doc(activity.id).delete();
    return true;
  } catch (e) {
    console.log(`deleteActivity error: ${e}`);
    return false;
  }
}

export async function updateActivity(activity: Activity): Promise<boolean> {
  try {
    await firestore()
      .collection(ACTIVITY_COLLECTION)
      .doc(activity.id)
      .set(activity);

    return true;
  } catch (e) {
    console.log(`updateActivity error: ${e}`);
    return false;
  }
}

async function fetchAttedanceCollection(
  activityId: string
): Promise<Record<string, AttendanceEntry>> {
  const attendanceSnapShot = await firestore()
    .collection(ACTIVITY_COLLECTION)
    .doc(activityId)
    .collection(ATTENDANCE_COLLECTION)
    .get();

  const attendance: Record<string, AttendanceEntry> = {};
  attendanceSnapShot.docs.forEach((doc) => {
    attendance[doc.id] = {
      ...(doc.data() as AttendanceEntry),
    };
  });

  return attendance;
}

async function fetchActivityEntity(
  id: string,
  entity: ActivityEntity
): Promise<Activity> {
  const members = Object.entries(entity.attendance);
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
    ...entity,
    id,
    entire,
    attended,
    late,
    notAttended,
    unexcused,
  } as Activity;
}
