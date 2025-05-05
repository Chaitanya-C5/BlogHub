import { useContext } from "react";
import ThemeContext from "../utils/ThemeContext";

export const useTheme = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    return { darkMode, toggleDarkMode };
}
