import "bootstrap/dist/css/bootstrap.min.css";
import './app.css'
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./routes/mainRoutes";

const App = () => {
  return <>
  <AuthProvider>
  <RouterProvider router={router} />
  </AuthProvider>
  </>
};

export default App; 


