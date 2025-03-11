import { FC, PropsWithChildren } from "react";
import { AppShell, AppShellMain, Container } from "@mantine/core";

import { Header } from "./components";
import classes from "./Layout.module.css";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <AppShell>
      <Header />
      <AppShellMain className={classes.main}>
        <Container>{children}</Container>
      </AppShellMain>
    </AppShell>
  );
};
