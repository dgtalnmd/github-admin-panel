import { Alert, Loader, Modal } from "@mantine/core";
import { FC, useEffect } from "react";

import classes from "./DetailModal.module.css";

import { useLazyGetRepoQuery } from "@/shared/api";

import { useAppSelector } from "@/app";

import { View, Form } from "./components";
import { notifications } from "@mantine/notifications";

export const DetailModal: FC<{
  onClose: () => void;
  name?: string;
  mode: "view" | "form";
}> = ({ onClose, name, mode }) => {
  const { login } = useAppSelector((state) => state.credentials);

  const [
    getRepo,
    {
      data,
      isSuccess: isGetRepoSuccess,
      isFetching: isGetRepoFetching,
      isError,
    },
  ] = useLazyGetRepoQuery();

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
          ? "View repository parameters"
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
      ) : mode === "view" && data ? (
        <View repo={data} />
      ) : (
        <Form
          isGetRepoSuccess={isGetRepoSuccess}
          name={name}
          onClose={onClose}
          data={data}
        />
      )}
    </Modal>
  );
};
