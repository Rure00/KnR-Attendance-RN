import { getAttendanceByActivityId } from "@/firebase/firestore/attendance";
import { Activity, AttendanceEntry } from "@/models/activity";
import { useEffect, useState } from "react";

export function useAttendance(
  activity?: Activity
): Record<string, AttendanceEntry> | undefined {
  const [record, setRecord] = useState<
    Record<string, AttendanceEntry> | undefined
  >(undefined);

  useEffect(() => {
    if (!activity) {
      setRecord(undefined);
      return;
    }

    (async () => {
      if (record && Object.entries(record).length === 0) {
        const result = await getAttendanceByActivityId(activity.id);
        if (result.isSuccess) {
          setRecord(result.data!);
        }
      }
    })();
  }, [record, activity]);

  return record;
}
