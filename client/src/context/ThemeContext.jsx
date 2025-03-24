import { createContext, useState, useEffect, useMemo } from "react";
import { enable, disable } from "darkreader";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    });
    const [isReady, setIsReady] = useState(false);

    // Apply the theme instantly on mount
    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("light", !isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");

        if (isDark) {
            enable({ brightness: 100, contrast: 90, sepia: 10 });
        } else {
            disable();
        }

        setTimeout(() => setIsReady(true), 50); // Small delay to prevent flashing
    }, [isDark]);

    const value = useMemo(() => ({ isDark, setIsDark }), [isDark]);

    return (
        <ThemeContext.Provider value={value}>
            {isReady ? children : null}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
