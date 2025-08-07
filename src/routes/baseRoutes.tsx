import Home from "@/pages/Home";
import VisualizationsList from "@/pages/VisualizationsList";
import SidebarDemoPage from "@/pages/SidebarDemo";
import NotFound from "@/pages/NotFound";

interface BaseRoute {
  path: string;
  element: JSX.Element;
}

export const baseRoutes: BaseRoute[] = [
  { path: "/", element: <Home /> },
  { path: "/visualizations", element: <VisualizationsList /> },
  { path: "/sidebar-demo", element: <SidebarDemoPage /> },
  { path: "*", element: <NotFound /> },
];
