import { Loader, LoadingOverlay } from "@mantine/core";

export const PageLoader = () => {
  return <LoadingOverlay visible loaderProps={{ children: <Loader /> }} />;
};
