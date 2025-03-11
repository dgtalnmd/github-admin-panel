import { useDeleteRepoMutation, useLazyGetReposQuery } from "@/shared/api";
import { useAppSelector } from "@/app";
import {
  ActionIcon,
  Alert,
  Button,
  Flex,
  Pagination,
  ScrollArea,
  Table,
  Title,
  Tooltip,
} from "@mantine/core";
import classes from "./Repositories.module.css";
import { IconEye, IconTrash, IconEdit } from "@tabler/icons-react";
import { DetailModal } from "./components";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { isFetchBaseQueryError } from "@/shared/utils";
import { PageLoader } from "@/shared/components";
import { ITEMS_PER_PAGE } from "./const";
import { ModalParams } from "./types";

export const Repositories = () => {
  const { login } = useAppSelector((state) => state.credentials);
  const [page, setPage] = useState(1);

  const [modalParams, setModalParams] = useState<ModalParams>();

  const [
    deleteRepo,
    {
      isSuccess: isDeleteSuccess,
      isLoading: isDeleteLoading,
      isError: isDeletingError,
    },
  ] = useDeleteRepoMutation();
  useEffect(() => {
    if (isDeletingError) {
      notifications.show({
        message: "Error deleting repository",
        color: "red",
      });
    }
  }, [isDeletingError]);
  useEffect(() => {
    if (isDeleteSuccess) {
      notifications.show({
        message: "The repository has been successfully deleted.",
        color: "green",
      });
    }
  }, [isDeleteSuccess]);

  const [deletingName, setDeletingName] = useState<null | string>(null);
  const confirmDelete = (name: string) => {
    setDeletingName(name);
    modals.openConfirmModal({
      title: "Confirm deletion",
      children: `Are you sure you want to delete repository "${name}"?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => deleteRepo({ owner: login, repo: name }),
      classNames: { inner: classes.modalInner },
    });
  };

  const [getRepos, { data, isLoading, isError, isFetching, error }] =
    useLazyGetReposQuery();

  useEffect(() => {
    if (login) {
      getRepos({
        owner: login,
        page,
        perPage: ITEMS_PER_PAGE,
      });
    }
  }, [getRepos, login, page]);

  useEffect(() => {
    if (!data?.items.length && page !== 1) {
      setPage((prev) => prev - 1);
    }
  }, [data?.items.length, page]);

  if (!login) return <Alert>Please provide your Github credentials</Alert>;
  if (isError) {
    if (isFetchBaseQueryError(error) && error.status === 401) {
      return (
        <Alert color="red">
          Authorization error. Please provide valid GitHub credentials.
        </Alert>
      );
    }
    return <Alert color="red">Error loading repositories</Alert>;
  }
  if (!data || isLoading) return <PageLoader />;

  const rows = data.items.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.description || "-"}</Table.Td>
      <Table.Td>{row.private ? "Private" : "Public"}</Table.Td>
      <Table.Td className={classes.actionsColumn}>
        <Tooltip label="View">
          <ActionIcon
            variant="transparent"
            title="View"
            disabled={isDeleteLoading}
            onClick={() => setModalParams({ repoName: row.name, mode: "view" })}
          >
            <IconEye />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Edit">
          <ActionIcon
            variant="transparent"
            title="Edit"
            disabled={isDeleteLoading}
            onClick={() => {
              setModalParams({ repoName: row.name, mode: "form" });
            }}
          >
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            onClick={() => confirmDelete(row.name)}
            variant="transparent"
            title="Delete"
            disabled={isDeleteLoading}
            loading={isDeleteLoading && deletingName === row.name}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Flex
        justify="space-between"
        style={{ marginBottom: 15, padding: "0 10px" }}
      >
        <Title order={3}>List of Repositories</Title>
        <Button
          onClick={() => {
            setModalParams({ mode: "form" });
          }}
        >
          Add new
        </Button>
      </Flex>
      {!data.items.length ? (
        <Alert>No repositories</Alert>
      ) : (
        <>
          {isFetching && <PageLoader />}

          <ScrollArea>
            <Table miw={700}>
              <Table.Thead className={classes.header}>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Visibility</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>

          <Flex justify="center">
            <Pagination
              mt="lg"
              total={Math.ceil(data.total_count / ITEMS_PER_PAGE)}
              value={page}
              onChange={setPage}
              hideWithOnePage
            />
          </Flex>
        </>
      )}

      {modalParams?.mode && (
        <DetailModal
          onClose={() => setModalParams({ mode: null })}
          name={modalParams.repoName}
          mode={modalParams.mode}
        />
      )}
    </>
  );
};
