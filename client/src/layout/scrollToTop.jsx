import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation(); // Detects route changes

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // Runs when the route changes

    return null; // No UI needed
};

export default ScrollToTop;
