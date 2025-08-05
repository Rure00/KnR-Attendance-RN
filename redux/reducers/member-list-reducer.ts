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
  memberRecord: Record<string, Member>;
}

const initialState: MemberListState = {
  memberList: [],
  memberRecord: {},
};

const memberListReducer = createSlice({
  name: "memberList",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) return;
      state.memberList = payload.data!;
      payload.data?.forEach((it) => {
        state.memberRecord[it.id] = it;
      });
    });
    builder.addCase(fetchNewMember.fulfilled, (state, { payload }) => {});
    builder.addCase(fetchUpdateMember.fulfilled, (state, { payload }) => {});
    builder.addCase(fetchDeleteMember.fulfilled, (state, { payload }) => {});
  },
});

export default memberListReducer;
