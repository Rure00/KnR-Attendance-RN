//thunks.tsx
import { createAsyncThunk } from "@reduxjs/toolkit";

export const GET_COUNTER_INFO_URL = "counter/getInfos";

export const fetchInfos = createAsyncThunk(
  GET_COUNTER_INFO_URL,
  async (userId: number, thunkAPI) => {
    const response = "success";

    await setTimeout(() => {}, 500);

    if (Math.random() < 0.8) return response;
    else return thunkAPI.rejectWithValue({ error: "Fail" });
  }
);
