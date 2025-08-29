import { Activity } from "@/models/activity";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeAttendance, fetchGetActivityWhen } from "./activity-thunk";

interface ActivityState {
  // Date to AttendanceHistory
  activites: Record<string, Activity>;
}

const initialState: ActivityState = {
  activites: {},
};

const activitesReducer = createSlice({
  name: "activites",
  initialState: initialState,
  reducers: {
    updateCachedActivity(state, action: PayloadAction<Activity>) {
      const newActivity = action.payload;

      Logger.debug(`updateCachedActivity: ${stringify(newActivity)}`);

      state.activites = {
        ...state.activites,
        [dateToDotSeparated(newActivity.date)]: newActivity,
      };
    },
    removeCachedActivity(state, action: PayloadAction<Date>) {
      const removedActivityDate = action.payload;

      Logger.debug(`removeCachedActivity: ${stringify(removedActivityDate)}`);

      const { [dateToDotSeparated(removedActivityDate)]: _, ...rest } =
        state.activites;
      state.activites = rest;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetActivityWhen.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) {
        Logger.info(`fetchGetActivityWhen fail...`);
        return;
      }
      const activity = payload.data!;

      Logger.debug(`fetchGetActivityWhen: ${stringify(activity)}`);

      state.activites = {
        ...state.activites,
        [dateToDotSeparated(activity.date)]: activity,
      };

      Logger.debug(stringify(state.activites));
    });
    builder
      .addCase(changeAttendance.pending, (state, thing) => {
        const { activityId, userId, attendanceEntry } = thing.meta.arg;
        const dateKey = Object.keys(state.activites).find(
          (key) => state.activites[key].id === activityId
        );
        if (!dateKey) {
          Logger.info(`changeAttendance: dateKey not found`);
          return;
        }

        Logger.debug(`changeAttendance: ${stringify(dateKey)}`);
        state.activites[dateKey].attendance[userId] = attendanceEntry;
      })
      .addCase(changeAttendance.rejected, (state, action) => {
        // Retry or Undo state.
      });
  },
});

export const { updateCachedActivity, removeCachedActivity } =
  activitesReducer.actions;
export default activitesReducer;
