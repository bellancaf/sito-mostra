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
    collage: CollageData | null;
    onClose: () => void;
}

const CollagesSidebar: React.FC<CollagesSidebarProps> = ({ collage, onClose }) => {
    if (!collage) return null;

    return (
        <div className={`collages-sidebar ${collage ? 'open' : ''}`}>
            <button className="close-button" onClick={onClose}>×</button>
            
            <div className="sidebar-content">
                <h2>{collage.title}</h2>
                <p className="date">{collage.date}</p>
                
                <img 
                    src={collage.image} 
                    alt={collage.title} 
                    className="sidebar-image"
                />
                
                {collage.description && (
                    <p className="description">{collage.description}</p>
                )}
                
                <Link 
                    to={`/collages/${collage.id}`} 
                    className="view-more-button"
                >
                    discover more
                </Link>
            </div>
        </div>
    );
};

export default CollagesSidebar; 