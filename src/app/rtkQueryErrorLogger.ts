import { isFetchBaseQueryError } from "@/shared/utils";
import { notifications } from "@mantine/notifications";
import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit";

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
