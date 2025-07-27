import { Activity } from "@/models/activity";
import { dateToDotSeparated } from "@/utils/dateToDotSeparated";
import { createSlice } from "@reduxjs/toolkit";
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGetActivityWhen.fulfilled, (state, { payload }) => {
      if (payload == undefined) return;
      state.activites[dateToDotSeparated(payload.date)] = payload;
    });
  },
});

export default activitesReducer;
