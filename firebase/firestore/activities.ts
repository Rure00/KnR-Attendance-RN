import { Activity, AttendanceEntry } from "@/models/activity";
import firestore from "@react-native-firebase/firestore";

const ACTIVITY_COLLECTION = "activity";
const ATTENDANCE_COLLECTION = "attendances";
const DATE_FILED = `date`;

export async function getAllActivities(): Promise<Activity[]> {
  try {
    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .get();

    const activities: Activity[] = await Promise.all(
      activityDocs.docs.map(async (doc) => {
        const data = doc.data();
        const id = doc.id;

        return {
          ...data,
          id,
          attendance: await fetchAttedanceCollection(id),
        } as Activity;
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
      return {
        ...snapshot.data(),
        id,
        attendance: await fetchAttedanceCollection(id),
      } as Activity;
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
          const id = doc.id;

          return {
            ...data,
            id,
            attendance: await fetchAttedanceCollection(id),
          } as Activity;
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
  activity: Omit<Activity, "id">
): Promise<boolean> {
  try {
    const activityDocs = await firestore()
      .collection(ACTIVITY_COLLECTION)
      .add(activity);

    return true;
  } catch (e) {
    console.log(`createNewActivity error: ${e}`);
    return false;
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
    attendance[doc.id] = doc.data() as AttendanceEntry;
  });

  return attendance;
}
