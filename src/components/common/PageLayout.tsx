import React, { useState, useEffect } from 'react';
import StaticTransition from './StaticTransition';
import StaticBackground from './StaticBackground';

interface PageLayoutProps {
    children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTransition, setShowTransition] = useState(true);
    
    useEffect(() => {
        // Make the content ready but invisible immediately
        setIsVisible(true);
        
        // After 1 second, start fading out the static
        setTimeout(() => {
            setShowTransition(false);
        }, 1000);
    }, []);

    return (
        <>
            <StaticTransition 
                isVisible={showTransition} 
                duration={800}
            />
            <div className={`page-content ${isVisible ? 'visible' : ''}`}>
                <StaticBackground />
                {children}
            </div>
        </>
    );
};

export default PageLayout; 