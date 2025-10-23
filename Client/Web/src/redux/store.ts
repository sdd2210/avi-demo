import { configureStore } from "@reduxjs/toolkit";
import globalStateSlice from "./globalStateSlice";
import accountSlice from "./accountSlice";


export const store = configureStore({
  reducer: {
    global_state: globalStateSlice,
    account_state: accountSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

