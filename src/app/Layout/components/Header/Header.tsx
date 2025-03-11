import { Container, Group } from "@mantine/core";
import classes from "./Header.module.css";
import { routes } from "@/app/routes";
import { NavLink } from "react-router";

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
