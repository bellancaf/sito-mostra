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
                    <h1>Statement</h1>
                    
                    <section className="statement-main">
                        <p>I collect whatever catches my eye—maps, bits of text, stray pages, unidentifiable scraps—and allow these fragments to guide me. I also ask people to send me things, whatever they like, to add to my archive. My intent isn't to preserve History, but to rediscover stories that feel human in a way that is playful and open-ended. I place these objects side by side and see what stories emerge. It's the closest I come to that childlike sense of wonder: handling each piece, rearranging it, and letting my intuition reshape its meaning.</p>

                        <p>I don't follow a precise method or seek a single "correct" outcome, nor I plan the narrative before starting a piece. This work exists for me first, a space to explore the playfulness of stories, of history, of people and memory. Once I finish a piece, it's only a starting point—an open dialogue for anyone who sees it. There's no final word or grand statement; each collage holds multiple narratives. I want people to find their own story in there.</p>

                        <p>Mine is not art that seeks to be understood, it is not a barrier between people looking and a correct interpretation of the world. It is a collection of memories, some are spelled out, some are hidden. It is the fuzzy image of a potential story, anyone can and should give their own interpretation. By letting these materials speak on their own, I'm simply offering a point of entry into an evolving conversation.</p>

                        <p>The practice, hinges on the idea that the personal is political and vice versa. I am aware that my activism happens outside of the studio, that art struggles to be a key element of change and that silly collages will not take us to the promised land.</p>

                        <p>However my practice cannot but be influenced by my thoughts my wants and my hopes. The idea of putting together History and personal stories, the research of political material, conflating different struggles and creating these intersectionalists narratives… all of this is political. Is political because I am political. The viewers interpretation is going to be political because we all are political.</p>
                    </section>

                    <section className="archive-section">
                        <h2>The archive</h2>
                        
                        <p>I want to preserve the initial stories, I don't see the material for its aestethic value only, I see it charged with stories, mine of when I got it, the actual context of the item, when was it created/published. I therefore store in the same archive my personal stories of hunting material.</p>

                        <p>I then add the entries of the actual items i collect and the information I have on it. At the end of a piece I then spend a bit of time narrating the stories I see there and creating the connections with all the material I used. The archive is then public allowing everyone to navigate it and have fun running from one place to the other.</p>
                    </section>
                </article>
            </div>
        </>
    );
};

export default StatementPage; 