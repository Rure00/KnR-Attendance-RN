import { getAttendanceByActivityId } from "@/firebase/firestore/attendance";
import { Activity, AttendanceEntry } from "@/models/activity";
import { useEffect, useState } from "react";

export function useAttendance(
  activity?: Activity
): Record<string, AttendanceEntry> | undefined {
  const [record, setRecord] = useState<Record<string, AttendanceEntry>>({});

  useEffect(() => {
    async function getAttendance() {
      if (activity && Object.keys(record).length === 0) {
        const result = await getAttendanceByActivityId(activity.id);
        if (result.isSuccess) {
          setRecord(result.data);
        }
      }
    }

    getAttendance();
  }, [record, activity]);

  if (activity === undefined) {
    return undefined;
  }

  return record;
}
