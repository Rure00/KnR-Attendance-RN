import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchInfos } from "../extra-reducers/thunk";

interface ContentsStateType {
  // 슬라이스 초기 상태 타입
  count: number;
}

const initialState: ContentsStateType = {
  count: 0,
};

export const logout = createAction("auth/logout");

const counterReducer = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: {
    increment(state, action: PayloadAction<number>) {
      console.log(action.payload);
      state.count = +action.payload;
    },
    decrement(state, action: PayloadAction<number>) {
      console.log(action.payload);
      state.count = -action.payload;
    },
    weirdAction(state) {
      console.log(`Weird!`);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInfos.fulfilled, (state, { payload }) => {
      console.log("success extra Reducer", payload);
      state.count + 10;
    }),
      builder.addCase(fetchInfos.rejected, (state, { payload }) => {
        console.log("reject extra Reducer", payload);
        state.count = state.count - 10;
      }),
      builder.addCase(fetchInfos.pending, (state, { payload }) => {
        console.log("pending extra Reducer", payload);
      }),
      builder.addCase(logout, (state, { payload }) => {
        console.log("do logout!", payload);
      });
  },
});

export const { increment, decrement, weirdAction } = counterReducer.actions;
export default counterReducer;
