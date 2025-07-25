import {
  createNewMember,
  deleteMember,
  getAllMembers,
  updateMember,
} from "@/firebase/firestore/members";
import { Member } from "@/models/member";
import { createAsyncThunk } from "@reduxjs/toolkit";

const GET_ALL_MEMBERS = "members/get";
const CREATE_NEW_MEMBER = "members/create";
const UPDATE_MEMBER = "members/update";
const DELTE_MEMBER = "members/delete";

export const fetchMembers = createAsyncThunk(
  GET_ALL_MEMBERS,
  async (thunkAPI) => {
    const response = await getAllMembers();
    return response;
  }
);

export const fetchNewMember = createAsyncThunk(
  CREATE_NEW_MEMBER,
  async (member: Omit<Member, "id">, thunkAPI) => {
    const response = await createNewMember(member);
    return response;
  }
);

export const fetchUpdateMember = createAsyncThunk(
  UPDATE_MEMBER,
  async (member: Member, thunkAPI) => {
    const response = await updateMember(member);
    return response;
  }
);

export const fetchDeleteMember = createAsyncThunk(
  DELTE_MEMBER,
  async (member: Member, thunkAPI) => {
    const response = await deleteMember(member);
    return response;
  }
);
