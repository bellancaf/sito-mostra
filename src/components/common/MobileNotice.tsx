import React, { useState } from 'react';
import './MobileNotice.css';

const MobileNotice: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    return isVisible ? (
        <div className="mobile-notice">
            <div className="mobile-notice-content">
                <p>This website is optimized for desktop viewing. Some interactive features may not be available on mobile devices.</p>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="mobile-notice-close"
                >
                    Got it
                </button>
            </div>
        </div>
    ) : null;
};

export default MobileNotice; 