import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PatientHeader from "../components/PatientHeader/PatientHeader";
import useAuthContext from "../hooks/useAuthContext";
import DoctorHeader from "../components/DoctorHeader/DoctorHeader";

function Layout() {
  const { user } = useAuthContext();

  // Fixed the function name and casing
  const renderHeader = () => {
    if (user) {
      const role = user.role?.toLowerCase();
      if(user.role){ ((user.role!='patient') && (user.role!='doctor')) && console.log("invalid user role. rendering default header") }// Fixed toLowerCase() spelling
      switch(role) {
        case 'patient':
          return <PatientHeader />;
        case 'doctor':
          return <DoctorHeader />;
        default:
          return <Header />;
      }
    }
    return <Header />;
  };

  return (
    <>
      {renderHeader()}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;