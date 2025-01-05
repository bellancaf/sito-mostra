import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCollage, getRelatedBooks } from '../../data';
import { Book } from '../../types';
import './CollagePage.css';
import Breadcrumbs from '../common/Breadcrumbs';

const CollagePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const collage = getCollage(id || '');
    const relatedBooks = getRelatedBooks(collage?.bookIds || []);

    if (!collage) {
        return <div>Collage not found</div>;
    }

    const toggleBook = (bookId: string) => {
        setExpandedBookId(expandedBookId === bookId ? null : bookId);
    };

    return (
        <div className="collage-page">
            <Breadcrumbs 
                items={[
                    { label: 'collages', path: '/collages' },
                    { label: collage.title }
                ]} 
            />
            
            <header className="collage-header">
                <h1>{collage.title}</h1>
                <span className="collage-date">{collage.date}</span>
            </header>
            
            <div className="collage-content">
                <aside className="sidebar">
                    {collage.description && (
                        <div className="collage-description-section">
                            <h2>Description</h2>
                            <div className="collage-description">
                                <p>{collage.description}</p>
                            </div>
                        </div>
                    )}

                    <div className="books-section">
                        <h2>Related Books</h2>
                        <div className="books-list">
                            {relatedBooks.map((book: Book) => (
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
                                            <img 
                                                src={book.coverImage} 
                                                alt={book.title} 
                                                className="book-cover"
                                            />
                                            <p className="book-author">by {book.author}</p>
                                            <p className="book-description">{book.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="collage-main">
                    <div className="collage-image-container">
                        <img 
                            src={collage.image} 
                            alt={collage.title} 
                            className="collage-image"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CollagePage; 