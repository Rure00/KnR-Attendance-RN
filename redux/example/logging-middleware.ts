import { createListenerMiddleware } from "@reduxjs/toolkit";

const logginMiddleware = createListenerMiddleware();

logginMiddleware.startListening({
  predicate: (action, currentState, previousState) => true,
  effect: async (action, listenerApi) => {
    const prevState = listenerApi.getOriginalState();
    const nextState = listenerApi.getState();

    console.log(
      `Reducer called ${action.type}: value changed from ${prevState} to ${nextState}`
    );
  },
});

export default logginMiddleware;
