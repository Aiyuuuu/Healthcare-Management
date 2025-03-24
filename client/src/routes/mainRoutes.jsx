import { createBrowserRouter } from "react-router-dom";
import Layout from '../layout/Layout'
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from '../pages/ErrorPage/ErrorPage';

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Layout component wraps all child routes
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/Login", element: <LoginPage /> },
      ],
    },
    { path: "*", element: <ErrorPage /> },
  ]);

export default router;
