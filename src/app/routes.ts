import { Credentials } from "@/modules";
import { Repositories } from "@/modules/Repositories";

export const routes = {
  credential: { link: "/", name: "Credentials", element: Credentials },
  repositories: {
    link: "/repositories",
    name: "Repositories",
    element: Repositories,
  },
};
