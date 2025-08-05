import { Member } from "@/models/member";
import { fetchMembers } from "@/redux/reducers/member-thunk";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";

export function useMemberList(): Member[] {
  const dispatch = useAppDispatch();

  const memberState = useAppSelector((state) => state.memberListReducer);

  useEffect(() => {
    if (memberState.memberList.length == 0) {
      dispatch(fetchMembers());
    }
  }, [memberState, dispatch]);

  return memberState.memberList;
}
