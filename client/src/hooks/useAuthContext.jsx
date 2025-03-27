import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // Import from context file

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default useAuthContext;