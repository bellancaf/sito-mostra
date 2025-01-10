import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSwitch.css';

const ThemeSwitch: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();

    return (
        <button 
            className={`theme-switch ${isDarkMode ? 'dark' : 'light'}`}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
        >
            <span className="icon">
                {isDarkMode ? '☀️' : '🌙'}
            </span>
        </button>
    );
};

export default ThemeSwitch; 