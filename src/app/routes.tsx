import { createBrowserRouter } from "react-router";
import { ProjectsScreen } from "./screens/ProjectsScreen";
import { ProjectMapScreen } from "./screens/ProjectMapScreen";
import { BackofficeScreen } from "./screens/BackofficeScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ProjectsScreen,
  },
  {
    path: "/project/:projectId",
    Component: ProjectMapScreen,
  },
  {
    path: "/backoffice",
    Component: BackofficeScreen,
  },
]);
