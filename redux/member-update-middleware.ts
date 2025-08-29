import { Logger } from "@/utils/Logger";
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
    if (fetchNewMember.fulfilled.match(action)) {
      if (action.payload.isSuccess) {
        Logger.debug(`fetchNewMember success`);
      } else {
        Logger.info(`fetchNewMember fail`);
      }
    } else if (fetchUpdateMember.fulfilled.match(action)) {
      if (action.payload.isSuccess) {
        Logger.debug(`fetchUpdateMember success`);
      } else {
        Logger.info(`fetchUpdateMember fail`);
      }
    } else if (fetchDeleteMember.fulfilled.match(action)) {
      if (action.payload.isSuccess) {
        Logger.debug(`fetchDeleteMember success`);
      } else {
        Logger.info(`fetchDeleteMember fail`);
      }
    }

    listenerApi.dispatch(fetchMembers());
  },
});

export default memberUpdateMiddleware;
