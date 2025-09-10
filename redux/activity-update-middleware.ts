import { Logger } from "@/utils/Logger";
import { stringify } from "@/utils/stringify";
import { createListenerMiddleware, isAsyncThunkAction } from "@reduxjs/toolkit";
import {
  removeCachedActivity,
  updateCachedActivity,
} from "./reducers/activity-reducer";
import {
  fetchCreateActivity,
  fetchDeleteActivity,
  fetchGetActivityWhen,
  fetchUpdateActivity,
} from "./reducers/activity-thunk";

const activityUpdateMiddleware = createListenerMiddleware();

activityUpdateMiddleware.startListening({
  predicate: (action, currentState, previousState) =>
    isAsyncThunkAction(
      fetchGetActivityWhen,
      fetchCreateActivity,
      fetchUpdateActivity,
      fetchDeleteActivity
    )(action),
  effect: async (action, listenerApi) => {
    Logger.debug(`🔥 listener received action: ${action.type}`, action);

    if (fetchGetActivityWhen.fulfilled.match(action)) {
      const activityResult = action.payload;
      if (activityResult.isSuccess) {
        listenerApi.dispatch(updateCachedActivity(activityResult.data!));
        Logger.debug(`fetchGetActivityWhen: ${stringify(activityResult.data)}`);
      } else {
        Logger.info(`fetchGetActivityWhen fail`);
      }
    } else if (fetchCreateActivity.fulfilled.match(action)) {
      const activityResult = action.payload;
      if (activityResult.isSuccess) {
        listenerApi.dispatch(updateCachedActivity(activityResult.data!));
        Logger.debug(`fetchCreateActivity: ${stringify(activityResult.data)}`);
      } else {
        Logger.info(`fetchCreateActivity fail`);
      }
    } else if (fetchUpdateActivity.fulfilled.match(action)) {
      const activityResult = action.payload;
      if (activityResult.isSuccess) {
        listenerApi.dispatch(updateCachedActivity(activityResult.data!));
        Logger.debug(`fetchUpdateActivity: ${stringify(activityResult.data)}`);
      } else {
        Logger.info(`fetchUpdateActivity fail`);
      }
    } else if (fetchDeleteActivity.fulfilled.match(action)) {
      const deleteResult = action.payload;
      if (deleteResult.isSuccess) {
        const deletedDate = action.meta.arg.date;
        listenerApi.dispatch(removeCachedActivity(deletedDate));
        Logger.debug(`removeCachedActivity: ${stringify(deletedDate)}`);
      } else {
        Logger.info(`removeCachedActivity fail`);
      }
    }
  },
});

export default activityUpdateMiddleware;
