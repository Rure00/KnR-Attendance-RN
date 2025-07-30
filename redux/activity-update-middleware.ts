import { createListenerMiddleware, isAsyncThunkAction } from "@reduxjs/toolkit";
import {
  removeCachedActivity,
  updateCachedActivity,
} from "./reducers/activity-reducer";
import {
  fetchCreateActivity,
  fetchDeleteActivity,
  fetchUpdateActivity,
} from "./reducers/activity-thunk";

const memberUpdateMiddleware = createListenerMiddleware();

memberUpdateMiddleware.startListening({
  predicate: (action, currentState, previousState) =>
    isAsyncThunkAction(
      fetchCreateActivity,
      fetchUpdateActivity,
      fetchDeleteActivity
    )(action),
  effect: async (action, listenerApi) => {
    if (
      fetchCreateActivity.fulfilled.match(action) ||
      fetchUpdateActivity.fulfilled.match(action)
    ) {
      const activityResult = action.payload;
      if (activityResult.isSuccess) {
        listenerApi.dispatch(updateCachedActivity(activityResult.data!));
      }
    } else if (fetchDeleteActivity.fulfilled.match(action)) {
      const deleteResult = action.payload;
      if (deleteResult.isSuccess) {
        const deletedDate = action.meta.arg.date;
        listenerApi.dispatch(removeCachedActivity(deletedDate));
      }
    }
  },
});

export default memberUpdateMiddleware;
