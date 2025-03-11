import { FC, useEffect } from "react";
import { Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { useCreateRepoMutation, useUpdateRepoMutation } from "@/shared/api";
import { isFetchBaseQueryError, isGithubApiErrorData } from "@/shared/utils";
import { capitalizeFirstLetter } from "@/shared/utils";
import { Repo } from "@/shared/types";
import { useAppSelector } from "@/app";
import { FormState } from "./types";

const DEFAULT_VISIBILITY = "Public";

export const Form: FC<{
  name?: string;
  onClose: () => void;
  data?: Repo;
}> = ({ name, onClose, data }) => {
  const isEdit = !!name;
  const { login } = useAppSelector((state) => state.credentials);

  const form = useForm<FormState>({
    initialValues: {
      name: "",
      description: "",
      visibility: DEFAULT_VISIBILITY,
    },
  });

  const [
    submitCreate,
    {
      isSuccess: isCreateSuccess,
      isLoading: isCreateLoading,
      error: createError,
      isError: isCreateError,
    },
  ] = useCreateRepoMutation();
  const [
    submitUpdate,
    {
      isSuccess: isUpdateSuccess,
      isLoading: isUpdateLoading,
      error: updateError,
      isError: isUpdateError,
    },
  ] = useUpdateRepoMutation();

  useEffect(() => {
    const isError = isCreateError || isUpdateError;

    if (isError) {
      const error = createError || updateError;
      let message = isEdit
        ? "Editing the repository failed."
        : "Failed to create repository.";

      if (isFetchBaseQueryError(error) && isGithubApiErrorData(error.data)) {
        message = error.data.message;

        error.data.errors?.forEach((item) => {
          form.setFieldError(
            item.field === "private" ? "visibility" : item.field,
            capitalizeFirstLetter(item.message)
          );
        });
      }

      notifications.show({
        message,
        color: "red",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateError, isUpdateError]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      notifications.show({
        message: isCreateSuccess
          ? "Repository added successfully"
          : "Repository updated successfully",
        color: "green",
      });
      onClose();
    }
  }, [isCreateSuccess, isUpdateSuccess, onClose]);

  useEffect(() => {
    if (isEdit && data) {
      form.setValues({
        name: data.name,
        description: data.description,
        visibility: data.private ? "Private" : "Public",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isEdit]);

  const isDisabled = !form.values.name || !form.values.visibility;

  const handleSubmit = (values: FormState) => {
    const params = {
      description: values.description,
      private: values.visibility === "Private",
    };

    if (isEdit) {
      submitUpdate({ owner: login, repo: name, data: params });
    } else {
      submitCreate({ ...params, name: values.name });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {!isEdit && (
          <TextInput
            required
            label="Name"
            value={form.values.name}
            onChange={(event) =>
              form.setFieldValue("name", event.currentTarget.value)
            }
            radius="md"
            error={form.errors.name}
          />
        )}

        <TextInput
          label="Description"
          value={form.values.description}
          onChange={(event) =>
            form.setFieldValue("description", event.currentTarget.value)
          }
          radius="md"
          error={form.errors.description}
        />
        <Select
          required
          label="Visibility"
          value={form.values.visibility}
          onChange={(value) =>
            form.setFieldValue("visibility", value || DEFAULT_VISIBILITY)
          }
          radius="md"
          data={["Public", "Private"]}
          error={form.errors.visibility}
        />
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button
          disabled={isDisabled}
          type="submit"
          radius="xl"
          loading={isCreateLoading || isUpdateLoading}
        >
          Save
        </Button>
      </Group>
    </form>
  );
};
