import { getAttendanceByActivityId } from "@/firebase/firestore/attendance";
import { Activity, AttendanceEntry } from "@/models/activity";
import { useEffect, useState } from "react";

export function useAttendance(
  activity?: Activity
): Record<string, AttendanceEntry> | undefined {
  if(!activity) return undefined;

  const [record, setRecord] = useState<Record<string, AttendanceEntry>>({});

  useEffect(() => {
    (async () => {
      if (Object.entries(record).length == 0) {
        const result = await getAttendanceByActivityId(activity.id);
        if (result.isSuccess) {
          setRecord(result.data!);
        }
      }
    })();
  }, [activity]);

  return record;
}
