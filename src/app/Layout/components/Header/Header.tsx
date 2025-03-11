import { NavLink } from "react-router";
import { Container, Group } from "@mantine/core";

import { routes } from "@/app/routes";
import classes from "./Header.module.css";

export const Header = () => {
  const items = Object.entries(routes).map(([id, route]) => (
    <NavLink key={id} to={route.link} className={classes.link}>
      {route.name}
    </NavLink>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
      </Container>
    </header>
  );
};
