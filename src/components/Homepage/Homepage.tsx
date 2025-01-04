import React from 'react';
import { HeroSection } from './components';
import './Homepage.css';

interface HomepageProps {
    setIsNavbarVisible: (visible: boolean) => void;
    isNavbarVisible: boolean;
}

const Homepage: React.FC<HomepageProps> = ({ setIsNavbarVisible, isNavbarVisible }) => {
    return (
        <div className="homepage">
            <HeroSection />
        </div>
    );
};

export default Homepage;