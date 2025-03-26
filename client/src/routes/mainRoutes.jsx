import { createBrowserRouter } from "react-router-dom";
import Layout from '../layout/Layout';
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SpecialistCategoryPage from '../pages/SpecialistCategoryPage/SpecialistCategoryPage';
import SearchSpecialistPage from "../pages/SearchSpecialistPage/SearchSpecialistPage";
import PatientDashbaordPage from "../pages/PatientDashboardPage/PatientDashboardPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, 
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/Login", element: <LoginPage /> },
        { path: "/SpecialistCategory", element: <SpecialistCategoryPage />},
        { path: "/SearchSpecialist/:specializationName", element: <SearchSpecialistPage /> },
        { path: "/patientDashboard", element:<PatientDashbaordPage/>} 
        // { path: "/specialistProfile/:id", element: <specialistProfilePage />}
      ],
    },
    { path: "*", element: <ErrorPage /> },
]);

export default router;
