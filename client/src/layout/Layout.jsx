import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import LoggedInHeader from "../components/LoggedInHeader/LoggedInHeader"

function Layout(){
  return (
    <>
      <LoggedInHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
