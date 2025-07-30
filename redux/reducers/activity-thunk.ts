import {
  ActivityEntity,
  createNewActivity,
  deleteActivity,
  getActivityByDate,
  updateActivity,
} from "@/firebase/firestore/activities";
import { Result } from "@/firebase/result";
import { Activity } from "@/models/activity";
import { createAsyncThunk } from "@reduxjs/toolkit";

const GET_ACTIVITY_WHEN = "activites/get";
const CREAT_ACTIVITY = "activites/create";
const DELETE_ACTIVITY = "activites/delete";
const UPDATE_ACTIVITY = "activites/update";

export const fetchGetActivityWhen = createAsyncThunk(
  GET_ACTIVITY_WHEN,
  async (date: Date, thunkAPI) => {
    const response = await getActivityByDate(date);
    return response;
  }
);

export const fetchCreateActivity = createAsyncThunk(
  CREAT_ACTIVITY,
  async (act: ActivityEntity, thunkAPI) => {
    const result = await createNewActivity(act);
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
