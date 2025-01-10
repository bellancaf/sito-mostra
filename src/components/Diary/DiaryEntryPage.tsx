import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiaryEntry, getRelatedBooks, getCollagesForDiaryEntry } from '../../data';
import { Collage } from '../../types';
import './DiaryEntryPage.css';
import Breadcrumbs from '../common/Breadcrumbs';

const DiaryEntryPage: React.FC = () => {
    const { id } = useParams();
    const [isVisible, setIsVisible] = useState(false);
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const entry = getDiaryEntry(id || '');
    
    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!entry) return <div className="not-found">Diary entry not found</div>;
    
    const relatedBooks = getRelatedBooks(entry.bookIds);
    const relatedCollages = getCollagesForDiaryEntry(entry.id);

    const toggleBook = (bookId: string) => {
        setExpandedBookId(expandedBookId === bookId ? null : bookId);
    };

    return (
        <div className={`diary-entry-page ${isVisible ? 'visible' : ''}`}>
            <Breadcrumbs 
                items={[
                    { label: 'diary', path: '/diary' },
                    { label: entry.title }
                ]} 
            />
            
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
                                <div 
                                    key={book.id} 
                                    className={`book-card ${expandedBookId === book.id ? 'expanded' : ''}`}
                                    onClick={() => toggleBook(book.id)}
                                >
                                    <div className="book-card-header">
                                        <h3>{book.title}</h3>
                                        <span className="book-year">{book.publishYear}</span>
                                    </div>
                                    
                                    {expandedBookId === book.id && (
                                        <div className="book-card-content">
                                            <p className="book-author">by {book.author}</p>
                                            <p className="book-description">{book.description}</p>
                                            <Link 
                                                to={`/books/${book.id}`} 
                                                className="read-more-link"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Read more →
                                            </Link>
                                        </div>
                                    )}
                                </div>
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