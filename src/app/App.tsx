import { BrowserRouter, Route, Routes } from "react-router";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { routes } from "./routes";
import { Layout } from "./Layout/Layout";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export const App = () => {
  return (
    <MantineProvider>
      <ModalsProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {Object.entries(routes).map(([id, route]) => {
                const Element = route.element;

                return (
                  <Route key={id} path={route.link} element={<Element />} />
                );
              })}
            </Routes>
          </Layout>
        </BrowserRouter>
        <Notifications />
      </ModalsProvider>
    </MantineProvider>
  );
};
