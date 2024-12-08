import React, { useState } from 'react';
import './Mostra.css';

interface Artwork {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    year: number;
    description: string;
}

const artworks: Artwork[] = [
    {
        id: 1,
        title: "The sadness of trees",
        artist: "Sadderton McPhilly",
        imageUrl: "/images/sad-trees.jpeg",
        year: 2024,
        description: "When trees are sad, they look like this."
    },
    {
        id: 2,
        title: "The sadness of the sun",
        artist: "Melancholinton McGeiver",
        imageUrl: "/images/sad-sun.jpeg",
        year: 2024,
        description: "When the sun is sad, you better hide."
    }
];

const Mostra: React.FC = () => {
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    const openModal = (artwork: Artwork) => {
        setSelectedArtwork(artwork);
    };

    const closeModal = () => {
        setSelectedArtwork(null);
    };

    return (
        <div className="mostra-container">
            <h1 className="mostra-title">Our Gallery</h1>
            
            <div className="artwork-grid">
                {artworks.map((artwork) => (
                    <div 
                        key={artwork.id} 
                        className="artwork-card"
                        onClick={() => openModal(artwork)}
                    >
                        <img 
                            src={artwork.imageUrl} 
                            alt={artwork.title} 
                            className="artwork-image"
                        />
                        <div className="artwork-info">
                            <h3>{artwork.title}</h3>
                            <p>{artwork.artist}</p>
                            <span>{artwork.year}</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedArtwork && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <img 
                            src={selectedArtwork.imageUrl} 
                            alt={selectedArtwork.title} 
                            className="modal-image"
                        />
                        <div className="modal-info">
                            <h2>{selectedArtwork.title}</h2>
                            <h3>{selectedArtwork.artist}</h3>
                            <p>{selectedArtwork.year}</p>
                            <p>{selectedArtwork.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mostra;