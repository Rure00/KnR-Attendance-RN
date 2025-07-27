import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import memberUpdateMiddleware from "./member-update-middleware";
import activitesReducer from "./reducers/activity-reducer";
import memberListReducer from "./reducers/member-list-reducer";

const rootReducer = combineReducers({
  memberListReducer: memberListReducer.reducer,
  activitiesReducer: activitesReducer.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(memberUpdateMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
