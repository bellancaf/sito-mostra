import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { diaryEntries } from '../../data';
import './DiaryListPage.css';

const DiaryListPage: React.FC = () => {
    const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );

        cardsRef.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="diary-list-page">
            <h1 className="diary-title">Diary Entries</h1>
            <div className="diary-entries-grid">
                {diaryEntries.map((entry, index) => (
                    <Link 
                        ref={el => cardsRef.current[index] = el}
                        to={`/diary/${entry.id}`} 
                        key={entry.id}
                        className="diary-card"
                    >
                        <div className="diary-card-content">
                            <div className="diary-card-meta">
                                <time>{entry.date}</time>
                                {entry.location && (
                                    <span className="location">{entry.location}</span>
                                )}
                            </div>
                            <h2>{entry.title}</h2>
                            <p>{entry.content.substring(0, 150)}...</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DiaryListPage; 