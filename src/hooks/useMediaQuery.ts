import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(
        // Check if window is defined (for SSR)
        typeof window !== 'undefined' 
            ? window.matchMedia(query).matches
            : false
    );

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia(query);
            
            const updateMatches = () => setMatches(mediaQuery.matches);
            
            // Initial check
            updateMatches();
            
            // Add listener
            mediaQuery.addEventListener('change', updateMatches);
            
            // Cleanup
            return () => {
                mediaQuery.removeEventListener('change', updateMatches);
            };
        }
    }, [query]);

    return matches;
};

export default useMediaQuery; 