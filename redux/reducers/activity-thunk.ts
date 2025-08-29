import {
  createNewActivity,
  deleteActivity,
  getActivityByDate,
  updateActivity,
} from "@/firebase/firestore/activities";
import { setAttendanceForMember } from "@/firebase/firestore/attendance";
import { Result } from "@/firebase/result";
import { Activity, AttendanceEntry } from "@/models/activity";
import { createAsyncThunk } from "@reduxjs/toolkit";

const GET_ACTIVITY_WHEN = "activites/get";
const CREAT_ACTIVITY = "activites/create";
const DELETE_ACTIVITY = "activites/delete";
const UPDATE_ACTIVITY = "activites/update";
const CHANGE_ATTENDANCE = "activites/attendance";

export const fetchGetActivityWhen = createAsyncThunk(
  GET_ACTIVITY_WHEN,
  async (date: Date, thunkAPI) => {
    const response = await getActivityByDate(date);
    return response;
  }
);

export const fetchCreateActivity = createAsyncThunk(
  CREAT_ACTIVITY,
  async (date: Date, thunkAPI) => {
    const result = await createNewActivity(date);
    return result;
  }
);

export const fetchDeleteActivity = createAsyncThunk(
  DELETE_ACTIVITY,
  async (activity: Activity, thunkAPI) => {
    const response = await deleteActivity(activity);
    return response;
  }
);

export const fetchUpdateActivity = createAsyncThunk<Result<Activity>, Activity>(
  UPDATE_ACTIVITY,
  async (activity, thunkAPI) => {
    const response = await updateActivity(activity);
    return response;
  }
);

type ChangeAttednaceAction = {
  activityId: string;
  userId: string;
  attendanceEntry: AttendanceEntry;
};
export const changeAttendance = createAsyncThunk<
  Result<ChangeAttednaceAction>,
  ChangeAttednaceAction
>(
  CHANGE_ATTENDANCE,
  async ({ activityId, userId, attendanceEntry }, thunkAPI) => {
    const response = await setAttendanceForMember(
      activityId,
      userId,
      attendanceEntry
    );

    return {
      message: "",
      data: {
        activityId,
        userId,
        attendanceEntry,
      },
      isSuccess: response.isSuccess,
    };
  }
);
