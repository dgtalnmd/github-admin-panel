import { FC } from "react";
import { Repo } from "@/shared/types";
import { Text } from "@mantine/core";

export const View: FC<{ repo: Repo }> = ({ repo }) => {
  return (
    <>
      <Text fz="sm">Name</Text>
      <Text mb={"xs"} fz="xs" c="dimmed">
        {repo.name}
      </Text>

      <Text fz="sm">Description</Text>
      <Text mb={"xs"} fz="xs" c="dimmed">
        {repo.description || "-"}
      </Text>

      <Text fz="sm">Visibility</Text>
      <Text fz="xs" c="dimmed">
        {repo.private ? "Private" : "Public"}
      </Text>
    </>
  );
};
