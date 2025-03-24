import { createContext, useState, useEffect, useMemo } from "react";
import { enable, disable } from "darkreader";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => 
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isDark) {
            enable({ brightness: 100, contrast: 90, sepia: 10 });
        } else {
            disable();
        }
        setIsReady(true); // Mark theme as applied
    }, [isDark]);

    const value = useMemo(() => ({ isDark, setIsDark }), [isDark]);

    if (!isReady) return null; // Prevent rendering until DarkReader is applied

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
