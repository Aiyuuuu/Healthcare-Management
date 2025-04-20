import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import api from "../services/api"; // Your API service

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email, password, role) => {
        try {
            // API call to your backend login endpoint
            const response = await api.post("/auth/login", {
                email,
                password,
                role
            });

            // Assuming response has { user, token }
            const { user: userData, token } = response.data;
            
            localStorage.setItem("user", JSON.stringify({
                ...userData,
                token // Store token with user object
            }));
            
            setUser({ ...userData, token });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Login failed" 
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        // Optional: Call backend logout endpoint
    };

    // Add token to API headers
    useEffect(() => {
        if (user?.token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;