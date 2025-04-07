import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from './components/common/PageLayout';

import NavBar from './components/Navbar/NavBar';
import Footer from './components/Footer/Footer';
import Homepage from './components/Homepage/Homepage';
import CollagesPage from './components/Collages/CollagesPage';
import CollagePage from './components/Collages/CollagePage';
import BooksListPage from './components/Books/BooksListPage';
import BookPage from './components/Books/BookPage';
import DiaryListPage from './components/Diary/DiaryListPage';
import DiaryEntryPage from './components/Diary/DiaryEntryPage';
import StatementPage from './components/Statement/StatementPage';
import StaticNoisePage from './components/StaticNoise/StaticNoisePage';

import './App.css';
import './styles/main.css'
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
    const [isNavbarVisible, setIsNavbarVisible] = React.useState(true);

    React.useEffect(() => {
        console.log('App component mounted');
        console.log('Current theme:', document.body.className);
        console.log('NavBar visibility:', isNavbarVisible);
        
        // Force light theme for debugging
        document.body.className = 'light-theme';

        // Add detailed error logging
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global error:', {
                message,
                source,
                lineno,
                colno,
                error
            });
            return false;
        };

        window.onunhandledrejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        };
    }, [isNavbarVisible]);

    // Wrap component with PageLayout for top-level routes
    const withPageLayout = (Component: React.FC<any>, props: any = {}) => (
        <PageLayout>
            <Component {...props} />
        </PageLayout>
    );

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Router>
                    <div className="app" style={{ background: 'white', color: 'black' }}>
                        <NavBar isNavbarVisible={isNavbarVisible} />
                        <main style={{ background: 'white', color: 'black' }}>
                            <div style={{ padding: '20px', background: 'yellow', color: 'black' }}>
                                Debug: App is rendering
                            </div>
                            <Routes>
                                <Route 
                                    path="/" 
                                    element={withPageLayout(Homepage, { 
                                        setIsNavbarVisible,
                                        isNavbarVisible
                                    })} 
                                />
                                <Route 
                                    path="/collages" 
                                    element={withPageLayout(CollagesPage)} 
                                />
                                <Route 
                                    path="/collages/:id" 
                                    element={withPageLayout(CollagePage)} 
                                />
                                <Route 
                                    path="/books" 
                                    element={withPageLayout(BooksListPage)} 
                                />
                                <Route 
                                    path="/books/:id" 
                                    element={withPageLayout(BookPage)} 
                                />
                                <Route 
                                    path="/diary" 
                                    element={withPageLayout(DiaryListPage)} 
                                />
                                <Route 
                                    path="/diary/:id" 
                                    element={withPageLayout(DiaryEntryPage)} 
                                />
                                <Route 
                                    path="/statement" 
                                    element={withPageLayout(StatementPage)} 
                                />
                                <Route 
                                    path="/static-noise" 
                                    element={withPageLayout(StaticNoisePage)} 
                                />
                                <Route 
                                    path="/test" 
                                    element={<div style={{padding: '20px', color: 'white'}}>Test Route Working</div>} 
                                />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;
