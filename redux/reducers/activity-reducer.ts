import { Activity } from "@/models/activity";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { changeAttendance, fetchGetActivityWhen } from "./activity-thunk";

interface ActivityState {
  // Date to AttendanceHistory
  activities: Record<string, Activity>;
}

const initialState: ActivityState = {
  activities: {},
};

const activitesReducer = createSlice({
  name: "activites",
  initialState: initialState,
  reducers: {
    updateCachedActivity(state, action: PayloadAction<Activity>) {
      const newActivity = action.payload;

      Logger.debug(`updateCachedActivity: ${stringify(newActivity)}`);

      state.activities = {
        ...state.activities,
        [newActivity.date]: newActivity,
      };
    },
    removeCachedActivity(state, action: PayloadAction<string>) {
      const removedActivityDate = action.payload;

      Logger.debug(`removeCachedActivity: ${stringify(removedActivityDate)}`);

      const { removedActivityDate: _, ...rest } = state.activities;
      state.activities = rest;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetActivityWhen.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) {
        Logger.info(`fetchGetActivityWhen fail...`);
        return;
      }
      const activity = payload.data;

      Logger.debug(`fetchGetActivityWhen: ${stringify(activity)}`);

      if (activity !== undefined) {
        state.activities = {
          ...state.activities,
          [activity.date]: activity,
        };
      }

      Logger.debug(stringify(state.activities));
    });
    builder
      .addCase(changeAttendance.pending, (state, thing) => {
        const { activityId, userId, attendanceEntry } = thing.meta.arg;
        const dateKey = Object.keys(state.activities).find(
          (key) => state.activities[key].id === activityId
        );
        if (!dateKey) {
          Logger.info(`changeAttendance: dateKey not found`);
          return;
        }

        Logger.debug(`changeAttendance: ${stringify(dateKey)}`);
        state.activities[dateKey].attendance[userId] = attendanceEntry;
      })
      .addCase(changeAttendance.rejected, (state, action) => {
        // Retry or Undo state.
      });
  },
});

export const { updateCachedActivity, removeCachedActivity } =
  activitesReducer.actions;
export default activitesReducer;
