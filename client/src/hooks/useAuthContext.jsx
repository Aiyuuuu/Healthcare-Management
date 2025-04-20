import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAuthContext = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return {
        ...context,
        // New helpers (optional)
        isAuthenticated: !!context.user?.token,
        isDoctor: context.user?.role === 'doctor',
        isPatient: context.user?.role === 'patient'
    };
};

export default useAuthContext;