import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HtmlPage from "./pages/Html1.jsx";
import CssPage from "./pages/CssPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import JavascriptPage from "./pages/JavascriptPage.jsx";
import TailwindPage from "./pages/TailwindPage.jsx";
import GithubPage from "./pages/GithubPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/html",
    element: <HtmlPage />,
  },
  {
    path: "/css",
    element: <CssPage />,
  },
  {
    path: "/js",
    element: <JavascriptPage />,
  },
  {
    path: "/tailwind",
    element: <TailwindPage />,
  },
  {
    path: "/github",
    element: <GithubPage />,
  },
  {
    path: "/community",
    element: <CommunityPage />,
  }
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
