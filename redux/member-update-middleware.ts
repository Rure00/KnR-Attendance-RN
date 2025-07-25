import { createListenerMiddleware, isAsyncThunkAction } from "@reduxjs/toolkit";
import {
  fetchDeleteMember,
  fetchMembers,
  fetchNewMember,
  fetchUpdateMember,
} from "./reducers/member-thunk";

const memberUpdateMiddleware = createListenerMiddleware();

memberUpdateMiddleware.startListening({
  predicate: (action, currentState, previousState) =>
    isAsyncThunkAction(
      fetchNewMember,
      fetchUpdateMember,
      fetchDeleteMember
    )(action),
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(fetchMembers());
  },
});

export default memberUpdateMiddleware;
