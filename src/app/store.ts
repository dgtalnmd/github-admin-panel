import { configureStore } from "@reduxjs/toolkit";

import { credentialsReducer } from "@/shared/slices";
import { githubApi } from "@/shared/api";
import { rtkQueryErrorLogger } from "./rtkQueryErrorLogger";

export const store = configureStore({
  reducer: {
    credentials: credentialsReducer,
    githubApi: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
