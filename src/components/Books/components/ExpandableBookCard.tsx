import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../../types';
import './ExpandableBookCard.css';

interface ExpandableBookCardProps {
    book: Book;
}

const ExpandableBookCard: React.FC<ExpandableBookCardProps> = ({ book }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div 
            className={`expandable-book-card ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="book-card-preview">
                <img 
                    src={book.coverImage} 
                    alt={book.title} 
                    className="book-cover"
                />
                <div className="book-preview-info">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                </div>
                <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
            </div>
            
            {isExpanded && (
                <div className="book-card-details" onClick={(e) => e.stopPropagation()}>
                    <p className="book-description">{book.description}</p>
                    <div className="book-metadata">
                        <span className="book-year">{book.publishYear}</span>
                    </div>
                    <Link 
                        to={`/books/${book.id}`}
                        className="view-book-link"
                    >
                        View Book Details
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ExpandableBookCard; 