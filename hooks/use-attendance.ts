import { getAttendanceByActivityId } from "@/firebase/firestore/attendance";
import { Activity, AttendanceEntry } from "@/models/activity";
import { useEffect, useState } from "react";

export function useAttendance(
  activity: Activity
): Record<string, AttendanceEntry> {
  const [record, setRecord] = useState<Record<string, AttendanceEntry>>({});

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (Object.entries(record).length == 0) {
        const result = await getAttendanceByActivityId(activity.id);
        if (result.isSuccess && isMounted) {
          setRecord(result.data!);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activity]);

  return record;
}
