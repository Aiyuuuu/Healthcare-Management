import "bootstrap/dist/css/bootstrap.min.css";
import './app.css'
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { RouterProvider } from "react-router-dom";
import router from "./routes/mainRoutes";

const App = () => {
  return <>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </>
};

export default App;


