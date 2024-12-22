import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer: React.FC = () => {
    const { innerWidth: width } = window;
    const isMobile = width < 768;
    const [isVisible, setIsVisible] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    const socialLinks = [
        { icon: faFacebook, url: 'https://www.facebook.com/puzziwuzzi' },
        { icon: faInstagram, url: 'https://www.instagram.com/puzziwuzzi' },
        { icon: faTwitter, url: 'https://www.twitter.com/puzziwuzzi' },
    ];

    React.useEffect(() => {
        // Small delay to trigger the animation after mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const mainColor = '#111827';
    const secondaryColor = '#fbbd23';

    return (
        <footer className={`footer-container ${isVisible ? 'visible' : ''}`}>
            <div className="footer-content">
                <div className="footer-inner">
                    <div className="social-links">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <FontAwesomeIcon 
                                    icon={link.icon} 
                                    size={isMobile ? "lg" : "xl"} // "lg" is roughly 18px, "2x" is roughly 32px
                                    color={hoveredIndex === index ? secondaryColor : mainColor}
                                />
                            </a>
                        ))}
                    </div>
                    <span className={`email ${isMobile ? 'mobile' : ''}`}>
                        puzziwuzzi@gmail.com
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;