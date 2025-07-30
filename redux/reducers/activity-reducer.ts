import { Activity } from "@/models/activity";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGetActivityWhen } from "./activity-thunk";

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
  },
});

export const { updateCachedActivity, removeCachedActivity } =
  activitesReducer.actions;
export default activitesReducer;
