import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

interface NavBarProps {
	isNavbarVisible: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isNavbarVisible }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

	useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            
            // Close mobile menu when switching to desktop
            if (!mobile && isMobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

	useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

	const renderNavLinks = (isMobileView: boolean = false) => {
        return [
            { path: '/collages', label: 'collages' },
            { path: '/books', label: 'library' },
            { path: '/diary', label: 'diary' },
            { path: '/statement', label: 'statement' }
        ].map((item) => (
            <li key={item.path}>
                <Link 
                    to={item.path}
                    className={`nav-link-container ${
                        isMobileView ? 'mobile' : ''
                    } ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                    onClick={isMobileView ? toggleMobileMenu : undefined}
                >
                    <span className="barcode-text">{item.label}</span>
                </Link>
            </li>
        ));
    };

    return (
        <>
            {isNavbarVisible && (
                <>
                    <nav className={`navbar ${isVisible ? 'visible' : ''}`}>
                        <div className="navbar-container">
                            <div className="navbar-brand">
                                <Link to="/">
                                    <img 
                                        src="/images/logo-dark.png" 
                                        alt="Brand Logo" 
                                        className={`brand-logo ${isMobile ? 'mobile' : ''}`}
                                    />
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <div className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
									onClick={toggleMobileMenu} 
									aria-label="Toggle mobile menu">
                                {[0, 1, 2].map((_, index) => (
                                    <span key={index} className="hamburger"></span>
                                ))}
                            </div>

                            {/* Desktop Navigation */}
                            <div className="navbar-links">
                                <ul>
                                    {renderNavLinks()}
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Side Drawer */}
                    {isMobile && (
                        <div className={`side-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
                            <ul>
                                {renderNavLinks(true)}
                            </ul>
                        </div>
                    )}

                    {isMobileMenuOpen && (
                        <div className="navbar-overlay open" onClick={toggleMobileMenu}></div>
                    )}
                </>
            )}
        </>
    );
};

export default NavBar;
