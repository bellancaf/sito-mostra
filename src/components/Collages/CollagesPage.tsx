import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collages } from '../../data';
import './CollagesPage.css';
import CollagesSidebar from './components/CollagesSidebar';
import StaticNoiseCollageCard from './components/StaticNoiseCollageCard';
import { getImagePaths } from '../../utils/imageUtils';
import useMediaQuery from '../../hooks/useMediaQuery';
import MobileNotice from '../common/MobileNotice';

const CollagesPage: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const filteredCollages = selectedYear 
        ? collages.filter(collage => new Date(collage.date).getFullYear() === selectedYear)
        : collages;

    return (
        <>
            {isMobile && <MobileNotice />}
            <div className={`collages-container ${isMobile ? 'mobile' : ''}`}>
                {!isMobile && (
                    <CollagesSidebar 
                        selectedYear={selectedYear}
                        onYearSelect={setSelectedYear}
                    />
                )}

                <div className="collages-main-content">
                    <div className="collages-header">
                        <h1>Collages</h1>
                        {isMobile && (
                            <select 
                                value={selectedYear || ''} 
                                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                                className="year-select-mobile"
                            >
                                <option value="">All Years</option>
                                {Array.from(new Set(collages.map(c => new Date(c.date).getFullYear())))
                                    .sort((a, b) => b - a)
                                    .map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))
                                }
                            </select>
                        )}
                    </div>

                    <div className="collages-grid">
                        {filteredCollages.map(collage => {
                            const { thumbnail } = getImagePaths(collage.image);
                            return (
                                <StaticNoiseCollageCard
                                    key={collage.id}
                                    id={collage.id}
                                    title={collage.title}
                                    date={collage.date}
                                    image={thumbnail}
                                    simplified={isMobile}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CollagesPage; 