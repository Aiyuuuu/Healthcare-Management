import "bootstrap/dist/css/bootstrap.min.css";
import './app.css'
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { RouterProvider } from "react-router-dom";
import ToastNotification from "./components/ToastNotification/ToastNotification";
import router from "./routes/mainRoutes";

const App = () => {
  return <>
    <ThemeProvider>
      <AuthProvider>
        <ToastNotification />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </>
};

export default App;


