import { FC, useEffect } from "react";

import { Alert, Loader, Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { useLazyGetRepoQuery } from "@/shared/api";
import { useAppSelector } from "@/app";
import { View, Form } from "./components";

import classes from "./DetailModal.module.css";

export const DetailModal: FC<{
  onClose: () => void;
  name?: string;
  mode: "view" | "form";
}> = ({ onClose, name, mode }) => {
  const { login } = useAppSelector((state) => state.credentials);

  const [getRepo, { data, isFetching: isGetRepoFetching, isError }] =
    useLazyGetRepoQuery();

  useEffect(() => {
    if (isError) {
      notifications.show({
        message: "Error getting repository",
        color: "red",
      });
      onClose();
    }
  }, [isError, onClose]);

  useEffect(() => {
    if (login && name) {
      getRepo({ owner: login, name });
    }
  }, [getRepo, login, name]);

  return (
    <Modal
      classNames={{ inner: classes.modalInner }}
      title={
        mode === "view"
          ? "View repository details"
          : name
          ? `Editing repository "${name}"`
          : "Add new repository"
      }
      opened
      onClose={onClose}
    >
      {name && isGetRepoFetching ? (
        <div
          style={{ minHeight: mode === "view" ? 141 : 282 }}
          className={classes.loaderContainer}
        >
          <Loader />
        </div>
      ) : !!name && !data ? (
        <Alert color="red">Error loading repository data</Alert>
      ) : mode === "view" ? (
        <View repo={data!} />
      ) : (
        <Form name={name} onClose={onClose} data={data} />
      )}
    </Modal>
  );
};
