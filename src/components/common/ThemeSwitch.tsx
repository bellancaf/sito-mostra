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
            {isDarkMode ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 13C4.5 13 2 10 2 8C2 6 4.5 3 8 3C6 5 6 11 8 13Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
            )}
        </button>
    );
};

export default ThemeSwitch; 