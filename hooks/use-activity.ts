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
    (state) => state.activitiesReducer.activities[key]
  );

  const activites = useAppSelector(
    (state) => state.activitiesReducer.activities
  )
  Logger.debug(`useActivity: ${stringify(activites)}`)

  useEffect(() => {
    if (!activity) {
      Logger.debug(`call fetchGetActivityWhen: ${date} (${key})`)
      dispatch(fetchGetActivityWhen(date));
    }
  }, [activity, date, key,dispatch]);

  Logger.debug(`date: ${stringify(date)} -> ${stringify(activity)}`);

  return activity;
}
