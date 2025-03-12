import { Loader, LoadingOverlay } from "@mantine/core";

export const PageLoader = () => {
  return (
    <LoadingOverlay
      visible
      pos="fixed"
      loaderProps={{ children: <Loader /> }}
    />
  );
};
