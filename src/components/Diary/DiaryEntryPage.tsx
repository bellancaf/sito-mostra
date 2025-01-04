import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiaryEntry, getRelatedBooks, getRelatedCollages } from '../../data';
import './DiaryEntryPage.css';
import ExpandableBookCard from '../Books/components/ExpandableBookCard';

const DiaryEntryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isVisible, setIsVisible] = useState(false);
    const entry = getDiaryEntry(id || "");
    
    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!entry) return <div className="not-found">Entry not found</div>;
    
    const relatedBooks = getRelatedBooks(entry.bookIds);
    const relatedCollages = getRelatedCollages(entry.collageIds);

    return (
        <div className={`diary-entry-page ${isVisible ? 'visible' : ''}`}>
            <article className="diary-entry-main">
                <header className="diary-entry-header">
                    <div className="diary-entry-meta">
                        <time className="entry-date">{entry.date}</time>
                        {entry.location && (
                            <span className="entry-location">{entry.location}</span>
                        )}
                        {entry.mood && (
                            <span className="entry-mood">{entry.mood}</span>
                        )}
                    </div>
                    <h1>{entry.title}</h1>
                </header>
                
                <div className="diary-entry-content">
                    {entry.content}
                </div>
            </article>
            
            <div className="diary-entry-related">
                {relatedBooks.length > 0 && (
                    <section className="related-books">
                        <h2>Books Mentioned</h2>
                        <div className="books-list">
                            {relatedBooks.map(book => (
                                <ExpandableBookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </section>
                )}
                
                {relatedCollages.length > 0 && (
                    <section className="related-collages">
                        <h2>Related Collages</h2>
                        <div className="collages-grid">
                            {relatedCollages.map(collage => (
                                <Link 
                                    to={`/collages/${collage.id}`} 
                                    key={collage.id}
                                    className="collage-card-mini"
                                >
                                    <img src={collage.image} alt={collage.title} />
                                    <div className="collage-info">
                                        <h3>{collage.title}</h3>
                                        <span className="collage-date">{collage.date}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default DiaryEntryPage; 