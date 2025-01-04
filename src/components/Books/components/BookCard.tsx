import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../../types';
import './BookCard.css';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    return (
        <Link to={`/books/${book.id}`} className="book-card">
            <div className="book-cover-container">
                <img src={book.coverImage} alt={book.title} className="book-cover" />
            </div>
            <div className="book-info">
                <h2>{book.title}</h2>
                <span className="book-author">{book.author}</span>
                <span className="book-year">{book.publishYear}</span>
            </div>
        </Link>
    );
};

export default BookCard; 