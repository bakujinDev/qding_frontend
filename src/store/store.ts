import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import commonSlice from "./reducer/commonReducer";

export function makeStore() {
  return configureStore({
    reducer: {
      common: commonSlice.reducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export default store;
