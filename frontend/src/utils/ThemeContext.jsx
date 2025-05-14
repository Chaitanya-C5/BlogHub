import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        setDarkMode(storedTheme === "dark");
    }
    , []);

    const toggleDarkMode = () => {
        localStorage.setItem("theme", darkMode ? "light" : "dark");
        setDarkMode((prevMode) => !prevMode);
    }

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    )
}


ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ThemeContext;