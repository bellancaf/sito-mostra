import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

interface NavBarProps {
	isNavbarVisible: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isNavbarVisible }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

	const imageStyles = {
		width: isMobile ? '10%' : '20%',
		height: isMobile ? '10%' : '20%',
		borderRadius: 'var(--radius-full)',
		objectFit: 'contain' as const
	};

    return (
        <>
			{isNavbarVisible && (
				<>
					<nav className="navbar">
						<div className="navbar-container">
							<div className="navbar-brand">
								<Link to="/">
									<img src="/images/butt.png" alt="Brand Logo" style={imageStyles} />
								</Link>
							</div>
							<div className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
								<span className="hamburger"></span>
								<span className="hamburger"></span>
								<span className="hamburger"></span>
							</div>
							<div className={`navbar-links`}>
								<ul>
									<li><Link to="/mostra">Mostra</Link></li>
								</ul>
							</div>
						</div>
					</nav>

					{isMobile && (
						<div className={`side-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
							<ul>
								<li><Link to="/" onClick={toggleMobileMenu}>Home</Link></li>
								<li><Link to="/mostra" onClick={toggleMobileMenu}>Mostra</Link></li>
							</ul>
						</div>
					)}

					{isMobileMenuOpen && <div className="navbar-overlay open" onClick={toggleMobileMenu}></div>}
				</>
			)}
        </>
    );
};

export default NavBar;
