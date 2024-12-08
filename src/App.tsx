import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './components/Homepage/Homepage';
import NavBar from './components/Navbar/NavBar';
import Mostra from './components/Mostra/Mostra';

import './styles/main.css';

const AppContent: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const location = useLocation();


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial checks
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname, isMobile]); // Add isMobile as dependency

    // const HomeComponent = isMobile ? MobileHomepage : HomePage;
    const HomeComponent = HomePage;
    
    return (
        <>
            <NavBar isNavbarVisible={isNavbarVisible} />
            <Routes>
                <Route path="/" element={
                    <HomeComponent 
                        setIsNavbarVisible={setIsNavbarVisible} 
                        isNavbarVisible={isNavbarVisible}
                    />
                } />
                <Route path="/homepage" element={
                    <HomeComponent 
                        setIsNavbarVisible={setIsNavbarVisible} 
                        isNavbarVisible={isNavbarVisible}
                    />
                } />
                <Route path="/mostra" element={<Mostra />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
