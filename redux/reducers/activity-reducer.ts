import { Activity } from "@/models/activity";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
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
      state.activites[dateToDotSeparated(newActivity.date)] = newActivity;
    },
    removeCachedActivity(state, action: PayloadAction<Date>) {
      const removedActivityDate = action.payload;
      const { [dateToDotSeparated(removedActivityDate)]: _, ...rest } =
        state.activites;
      state.activites = rest;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetActivityWhen.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) return;
      const activity = payload.data!;
      state.activites[dateToDotSeparated(activity.date)] = activity;
    });
    builder
      .addCase(changeAttendance.pending, (state, thing) => {
        const { activityId, userId, attendanceEntry } = thing.meta.arg;
        const activityEntry = Object.entries(state.activites).find(
          ([_, activity]) => activity.id === activityId
        );
        if (!activityEntry) return;

        const [dateKey, activity] = activityEntry;
        activity.attendance[userId] = attendanceEntry;
      })
      .addCase(changeAttendance.rejected, (state, action) => {
        // Retry or Undo state.
      });
  },
});

export const { updateCachedActivity, removeCachedActivity } =
  activitesReducer.actions;
export default activitesReducer;
