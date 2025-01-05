import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer/Footer';
import Homepage from './components/Homepage/Homepage';
import CollagesPage from './components/Collages/CollagesPage';
import CollagePage from './components/Collages/CollagePage';
import BooksListPage from './components/Books/BooksListPage';
import BookPage from './components/Books/BookPage';
import DiaryListPage from './components/Diary/DiaryListPage';
import DiaryEntryPage from './components/Diary/DiaryEntryPage';

import './App.css';
import './styles/main.css'

const App: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = React.useState(true);

    return (
        <Router>
            <div className="app">
                <NavBar isNavbarVisible={isNavbarVisible} />
                <main>
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <Homepage 
                                    setIsNavbarVisible={setIsNavbarVisible}
                                    isNavbarVisible={isNavbarVisible}
                                />
                            } 
                        />
                        <Route path="/collages" element={<CollagesPage />} />
                        <Route path="/collages/:id" element={<CollagePage />} />
                        <Route path="/books" element={<BooksListPage />} />
                        <Route path="/books/:id" element={<BookPage />} />
                        <Route path="/diary" element={<DiaryListPage />} />
                        <Route path="/diary/:id" element={<DiaryEntryPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
