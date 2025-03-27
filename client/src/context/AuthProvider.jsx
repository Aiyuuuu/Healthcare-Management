import { useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Always check localStorage first
        const storedUser = localStorage.getItem("user");
        
        // Create mock user if no user exists
        if (!storedUser) {
            const mockUser = {
                patient_id: "1",
                name: "mr bemaar",
                email: "patient@example.com",
                role: "patient"
            };
            localStorage.setItem("user", JSON.stringify(mockUser));
            return mockUser;
        }
        
        return JSON.parse(storedUser);
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;