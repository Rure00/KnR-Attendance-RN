import { Member } from "@/models/member";
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDeleteMember,
  fetchMembers,
  fetchNewMember,
  fetchUpdateMember,
} from "./member-thunk";

interface MemberListState {
  memberList: Member[];
}

const initialState: MemberListState = {
  memberList: [],
};

const memberListReducer = createSlice({
  name: "memberList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.fulfilled, (state, { payload }) => {
      state.memberList = payload;
    });
    builder.addCase(fetchNewMember.fulfilled, (state, { payload }) => {});
    builder.addCase(fetchUpdateMember.fulfilled, (state, { payload }) => {});
    builder.addCase(fetchDeleteMember.fulfilled, (state, { payload }) => {});
  },
});

export default memberListReducer;
