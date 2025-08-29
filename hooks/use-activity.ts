import { Activity } from "@/models/activity";
import { fetchGetActivityWhen } from "@/redux/reducers/activity-thunk";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { useEffect } from "react";

export function useActivity(date: Date): Activity | undefined {
  const key = dateToDotSeparated(date);
  const dispatch = useAppDispatch();

  const activity = useAppSelector(
    (state) => state.activitiesReducer.activites[key]
  );

  useEffect(() => {
    if (!activity) {
      dispatch(fetchGetActivityWhen(date));
    }
  }, [activity, date, dispatch]);

  Logger.debug(`date: ${stringify(date)} -> ₩n ${stringify(activity)}`);

  return activity;
}
