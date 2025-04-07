import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook, getCollagesForBook, getRelatedDiaryEntries } from '../../data';
import { Collage } from '../../types';
import './BookPage.css';
import Breadcrumbs from '../common/Breadcrumbs';
import { getImagePaths } from '../../utils/imageUtils';

const BookPage: React.FC = () => {
    const { id } = useParams();
    const book = getBook(id || '');
    const [isVisible, setIsVisible] = useState(false);
    
    const { full: fullImage } = getImagePaths(book?.coverImage || '');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Add fallback image handling
    const handleImageError = () => {
        setImageError(true);
        console.error(`Failed to load image: ${fullImage}`);
    };

    if (!book) return <div className="not-found">Book not found</div>;
    
    // Get collages that reference this book
    const relatedCollages = getCollagesForBook(book.id);

    // Get diary entries that this book references
    const diaryEntries = getRelatedDiaryEntries(book.diaryIds);

    return (
        <div className={`book-page ${isVisible ? 'visible' : ''}`}>
            <Breadcrumbs 
                items={[
                    { label: 'books', path: '/books' },
                    { label: book.title }
                ]} 
            />
            
            <div className="book-main">
                <div className="book-header">
                    <img 
                        src={fullImage}
                        alt={book.title} 
                        className="book-cover-large"
                        onError={handleImageError}
                    />
                    <div className="book-info">
                        <h1>{book.title}</h1>
                        <h2>{book.author}</h2>
                        <span className="book-year">{book.publishYear}</span>
                        <p className="book-description">{book.description}</p>
                        
                        {book.location && (
                            <div className="book-location">
                                <h3>Found at</h3>
                                <div className="location-details">
                                    <span className="location-name">{book.location.name}</span>
                                    <div className="location-meta">
                                        <span className="location-city">{book.location.city}</span>
                                        <span className="location-country">{book.location.country}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="book-related">
                <section className="related-collages">
                    <h2>Featured In</h2>
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

                <section className="book-diary-entries">
                    <h2>Diary Mentions</h2>
                    <div className="entries-list">
                        {diaryEntries.map(entry => (
                            <Link 
                                to={`/diary/${entry.id}`} 
                                key={entry.id}
                                className="diary-entry-preview"
                            >
                                <div className="entry-meta">
                                    <time>{entry.date}</time>
                                    {entry.location && (
                                        <span className="location">{entry.location}</span>
                                    )}
                                </div>
                                <h3>{entry.title}</h3>
                                <p>{entry.content.substring(0, 150)}...</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BookPage; 