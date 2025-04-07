import React from 'react';
import { Link } from 'react-router-dom';
import './CollagesSidebar.css';

interface CollageData {
    id: string;
    title: string;
    image: string;
    date: string;
    bookIds: string[];
    description?: string;
}

interface CollagesSidebarProps {
    selectedYear: number | null;
    onYearSelect: (year: number | null) => void;
}

const CollagesSidebar: React.FC<CollagesSidebarProps> = ({ selectedYear, onYearSelect }) => {
    if (!selectedYear) return null;

    return (
        <div className={`collages-sidebar ${selectedYear ? 'open' : ''}`}>
            <button className="close-button" onClick={() => onYearSelect(null)}>×</button>
            
            <div className="sidebar-content">
                <h2>{selectedYear} Collages</h2>
                <p className="date">{selectedYear} Collages</p>
                
                <img 
                    src={`https://via.placeholder.com/150?text=${selectedYear}`} 
                    alt={selectedYear.toString()} 
                    className="sidebar-image"
                />
                
                <Link 
                    to={`/collages/${selectedYear}`} 
                    className="view-more-button"
                >
                    discover more
                </Link>
            </div>
        </div>
    );
};

export default CollagesSidebar; 