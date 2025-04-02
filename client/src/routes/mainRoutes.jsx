import { createBrowserRouter } from "react-router-dom";
import Layout from '../layout/Layout';
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SpecialistCategoryPage from '../pages/SpecialistCategoryPage/SpecialistCategoryPage';
import SearchSpecialistPage from "../pages/SearchSpecialistPage/SearchSpecialistPage";
import PatientDashbaordPage from "../pages/PatientDashboardPage/PatientDashboardPage";
import DoctorProfilePage from "../pages/DoctorProfilePage/DoctorProfilePage";
import BookAppointmentPage from "../pages/BookAppointmmentPage/BookAppointmentPage";
import AppointmentsPage from "../pages/AppointmentsPage/AppointmentsPage";
import ReportsPage from "../pages/ReportsPage/ReportsPage";
import PrescriptionsPage from '../pages/PrescriptionsPage/PrescriptionsPage'
import ViewPrescriptionPage from '../pages/ViewPrescriptionPage/ViewPrescriptionPage'
import DoctorDashboardPage from "../pages/DoctorDashboardPage/DoctorDashboardPage";
import DoctorPrescriptionPage from "../pages/DoctorPrescriptionPage/DoctorPrescriptionPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, 
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/Login", element: <LoginPage /> },
        { path: "/SpecialistCategory", element: <SpecialistCategoryPage />},
        { path: "/SearchSpecialist/:specializationName", element: <SearchSpecialistPage /> },
        { path: "/patient/dashboard", element:<PatientDashbaordPage />},
        { path: "/specialistProfile/:id", element:<DoctorProfilePage />},
        { path: "/specialistProfile/:id/:doctorName/:fee/bookAppointment", element:<BookAppointmentPage /> }, 
        { path: "/patient/appointments", element:<AppointmentsPage /> },
        { path: "/patient/reports", element:<ReportsPage /> },
        { path: "/patient/prescriptions", element:<PrescriptionsPage /> },
        { path: "/patient/prescriptions/view/:id", element:<ViewPrescriptionPage />},
        { path:"/doctor/dashboard/", element:<DoctorDashboardPage />},
        { path:"/doctor/dashboard/appointment/:apptId/prescription/", element:<DoctorPrescriptionPage />}
      ],
    },
    { path: "*", element: <ErrorPage /> },
]);

export default router;
