import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollage, getRelatedBooks } from '../../data';
import { Book } from '../../types';
import './CollagePage.css';
import Breadcrumbs from '../common/Breadcrumbs';
import { FaExpand } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

const CollagePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
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
                                        <h3>{book.title} ({book.publishYear})</h3>
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
                    </div>
                </aside>

                <main className="collage-main">
                    <div className="collage-image-container">
                        <button 
                            className="fullscreen-toggle"
                            onClick={() => setIsLightboxOpen(true)}
                            aria-label="Open fullscreen"
                        >
                            <FaExpand />
                        </button>
                        <img 
                            src={collage.image} 
                            alt={collage.title} 
                            className="collage-image"
                        />
                        
                        <Lightbox
                            open={isLightboxOpen}
                            close={() => setIsLightboxOpen(false)}
                            slides={[{ src: collage.image }]}
                            plugins={[Zoom]}
                            render={{
                                buttonPrev: () => null,
                                buttonNext: () => null
                            }}
                            zoom={{
                                wheelZoomDistanceFactor: 100,
                                pinchZoomDistanceFactor: 100,
                                scrollToZoom: true
                            }}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CollagePage; 