import { useDispatch } from "react-redux";
import {
  Button,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { setCredentials } from "@/shared/slices";
import { useAppSelector } from "@/app";

import { githubApi } from "@/shared/api";

export const Credentials = () => {
  const dispatch = useDispatch();

  const { login, token } = useAppSelector((state) => state.credentials);

  const form = useForm({
    initialValues: {
      login,
      token,
    },
  });

  const isDisabled =
    !form.values.login ||
    !form.values.token ||
    (login === form.values.login && token === form.values.token);

  return (
    <>
      <Flex
        justify="space-between"
        style={{ marginBottom: 15, padding: "0 10px" }}
      >
        <Title order={3}>Github Credentials</Title>
      </Flex>
      <Paper style={{ maxWidth: 500 }} radius="md" p="xl" withBorder>
        <form
          onSubmit={form.onSubmit(async (values) => {
            dispatch(setCredentials(values));
            dispatch(githubApi.util.resetApiState());
            notifications.show({
              message: "Credentials saved successfully",
              color: "green",
            });
          })}
        >
          <Stack>
            <TextInput
              required
              label="Login"
              placeholder="Enter Github login"
              value={form.values.login}
              onChange={(event) =>
                form.setFieldValue("login", event.currentTarget.value)
              }
              radius="md"
            />

            <PasswordInput
              required
              label="Token"
              placeholder="Enter Github API token"
              value={form.values.token}
              onChange={(event) =>
                form.setFieldValue("token", event.currentTarget.value)
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Button disabled={isDisabled} type="submit" radius="xl">
              Save
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};
