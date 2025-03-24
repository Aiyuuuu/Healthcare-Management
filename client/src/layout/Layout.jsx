import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PatientHeader from "../components/PatientHeader/PatientHeader";
import useAuthContext from "../hooks/useAuthContext"; // Import the auth hook

function Layout() {
  const { user } = useAuthContext(); // Get auth status

  return (
    <>
      {/* {user ? (user.role === 'patient' ? <PatientHeader /> : user.role === 'doctor' ? <DoctorHeader /> : <Header />) : <Header />} */}
      <PatientHeader />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
