import { Member } from "@/models/member";
import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
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
      if (!payload.isSuccess) {
        Logger.info(`fetchMembers fail...`);
        return;
      }

      Logger.debug(`fetchMembers ${stringify(payload.data)}`);

      state.memberList = payload.data!;
      payload.data?.forEach((it) => {
        state.memberRecord[it.id] = it;
      });
    });
    builder.addCase(fetchNewMember.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) {
        Logger.info(`fetchNewMember fail...`);
        return;
      }

      Logger.debug(`fetchNewMember: ${stringify(!payload.data)}`);
    });
    builder.addCase(fetchUpdateMember.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) {
        Logger.info(`fetchUpdateMember fail...`);
        return;
      }

      Logger.debug(`fetchUpdateMember: ${stringify(!payload.data)}`);
    });
    builder.addCase(fetchDeleteMember.fulfilled, (state, { payload }) => {
      if (!payload.isSuccess) {
        Logger.info(`fetchDeleteMember fail...`);
        return;
      }

      Logger.debug(`fetchDeleteMember: ${stringify(!payload.data)}`);
    });
  },
});

export default memberListReducer;
