import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";
import { notifications } from "@mantine/notifications";

import { isFetchBaseQueryError } from "@/shared/utils";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (
      isFetchBaseQueryError(action.payload) &&
      action.payload.status === 401
    ) {
      notifications.show({
        message:
          "Authorization error. Please provide valid GitHub credentials.",
        color: "red",
      });
    }
  }

  return next(action);
};
