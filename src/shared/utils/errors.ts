import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error != null && "status" in error;
};

type GithubApiError = {
  status: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
};

export const isGithubApiErrorData = (
  errorData: unknown
): errorData is GithubApiError => {
  return (
    typeof errorData === "object" &&
    errorData != null &&
    "status" in errorData &&
    "message" in errorData
  );
};
