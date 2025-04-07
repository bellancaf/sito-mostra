import React, { useState, useEffect } from 'react';
import StatementBackground from './StatementBackground';
import StaticTransition from '../common/StaticTransition';
import './StatementPage.css';

const StatementPage: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showTransition, setShowTransition] = useState(true);
    
    useEffect(() => {
        // Show static noise for 2 seconds then fade out
        setTimeout(() => {
            setShowTransition(false);
            setIsVisible(true);
        }, 1000);
    }, []);

    return (
        <>
            <StaticTransition 
                isVisible={showTransition} 
                duration={800} // Faster fade out
            />
            <div className={`statement-page ${isVisible ? 'visible' : ''}`}>
                <StatementBackground />
                <article className="statement-content">
                    <h1 className="statement-title">Statement</h1>
                    
                    <section className="statement-section">
                        <p className="statement-text">I've been told art statements are important.</p>
                        <p className="statement-text">I struggle to understand the importance of things.</p>
                        <p className="statement-text">I struggle to write this because I don't really know what to say about the things I do.</p>
                        <p className="statement-text">I struggle to understand where to put my focus.</p>
                        <p className="statement-text">Reflecting on the things I do feels very often a way to justify their existence, to rationalise their purpose and intent.</p>
                        <p className="statement-text">I struggle to understand how purposeful my actions can be.</p>
                        <p className="statement-text">And yet, sitting with my unambitious creations, caring for them, and giving them a place to inhabit makes me believe I can do beautiful things, makes believe I can contribute, say things people might resonate with and enjoy the process in the meantime.</p>
                        <p className="statement-text">So I struggle less, I put this words together here and move on with my day.</p>
                    </section>

                    <section className="statement-section">
                        <h2 className="statement-subtitle">Process</h2>
                        <p className="statement-text">It took me a while to understand that the creative process starts from a need, to deconstructing the silly idea that the art is the product.</p>
                        <p className="statement-text">The frustrations of not being able to actually create but only having ideas about potential creations was overwhelming at time, so I'd hide my notebook -- embarassed by my lack of talent -- and would keep the ideas between me and myself.</p>
                        <p className="statement-text">And then I stumbled upon old books, maps, stray pages. It was fun to discover them. I started stacking them up.</p>
                        <p className="statement-text">With time I started cautiously putting them together, just to discover what my hands would guide me to do.</p>
                        <p className="statement-text">In those moments the static noise in my head calmed down. I kept going for hours.</p>
                        <p className="statement-text">Awed by this newfound joy I kept doing it; the artifacts on this site are the outcome of this process.</p>
                    </section>
                </article>
            </div>
        </>
    );
};

export default StatementPage; 