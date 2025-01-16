import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StaticTransition from '../common/StaticTransition';
import { collages, books, diaryEntries } from '../../data';
import * as d3 from 'd3';
import './Homepage.css';

const useScrambleText = (targetText: string, interval = 50, stepCount = 20, delay = 0) => {
    const [displayText, setDisplayText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isAnimating) return;

        // Wait for the specified delay before starting the animation
        const delayTimeout = setTimeout(() => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const targetArray = targetText.split('');
            let currentArray = Array(targetArray.length).fill('');
            let step = 0;

            setIsAnimating(true);

            const scramble = () => {
                if (step <= stepCount) {
                    const scrambledArray = currentArray.map((char, index) =>
                        Math.random() > step / stepCount ? chars[Math.floor(Math.random() * chars.length)] : targetArray[index]
                    );

                    currentArray = scrambledArray.map((char, index) =>
                        scrambledArray[index] === targetArray[index] ? targetArray[index] : ''
                    );

                    setDisplayText(scrambledArray.join(''));

                    step++;
                    setTimeout(scramble, interval);
                } else {
                    setDisplayText(targetText);
                    setIsAnimating(false);
                }
            };

            scramble();
        }, delay);

        return () => {
            clearTimeout(delayTimeout);
            setIsAnimating(false);
        };
    }, [targetText, interval, stepCount, delay]);

    return displayText;
};

const useTypewriter = (text: string, speed = 50, delay = 0) => {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const startTyping = () => {
            let currentIndex = 0;
            
            const type = () => {
                if (currentIndex <= text.length) {
                    setDisplayText(text.slice(0, currentIndex));
                    currentIndex++;
                    timeoutId = setTimeout(type, speed);
                } else {
                    setIsComplete(true);
                }
            };
            
            type();
        };

        // Start after delay
        const delayTimeout = setTimeout(startTyping, delay);

        // Cursor blinking effect
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(delayTimeout);
            clearInterval(cursorInterval);
        };
    }, [text, speed, delay]);

    return { text: displayText, cursor: showCursor, isComplete };
};

interface HomepageProps {
    setIsNavbarVisible: (visible: boolean) => void;
    isNavbarVisible: boolean;
}

interface NodeDatum {
    id: string;
    type: 'book' | 'collage' | 'diary';
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    label?: string;
}

type NodeType = 'collage' | 'book' | 'diary';

interface ButtonData {
    type: NodeType;
    label: string;
    color: string;
}

interface LinkDatum {
    source: NodeDatum;
    target: NodeDatum;
}

const Homepage: React.FC<HomepageProps> = ({ setIsNavbarVisible, isNavbarVisible }) => {
    const networkRef = useRef<SVGSVGElement | null>(null);
    const navigate = useNavigate();
    const [visibleTypes, setVisibleTypes] = useState<Record<NodeType, boolean>>({
        collage: false,
        book: false,
        diary: false
    });
    const [isVisible, setIsVisible] = useState(false);
    const [showTransition, setShowTransition] = useState(true);
    const [currentText, setCurrentText] = useState('');
    const [currentLabelType, setCurrentLabelType] = useState<NodeType | null>(null);
    
    // Start the scramble effect after the static transition
    const scrambledTitle = useScrambleText("My Paper Stories", 50, 40, 1000);

    // First sentence
    const introText = useTypewriter(
        "As I travel around the world, I collect fragments of stories in paper form.",
        40, // Speed per character
        2500 // Delay = static (1000) + scramble (2000) - 500ms overlap
    );

    // Second part starts after first part is complete
    const secondText = useTypewriter(
        "I hunt for books in second-hand shops and markets. When I find interesting ones, I write diary entries about them, and eventually create collages with their pages.",
        40,
        introText.isComplete ? 0 : 999999 // Only start when first part is complete
    );

    // Watch for keywords in the typed text and show corresponding nodes
    useEffect(() => {
        const fullText = introText.text + (introText.isComplete ? " " + secondText.text : "");
        setCurrentText(fullText);

        if (fullText.includes("books") && !visibleTypes.book) {
            setVisibleTypes(prev => ({ ...prev, book: true }));
            setCurrentLabelType('book');  // Show book titles immediately
        }
        
        if (fullText.includes("diary entries") && !visibleTypes.diary) {
            setVisibleTypes(prev => ({ ...prev, diary: true }));
            setCurrentLabelType('diary');  // Show diary dates immediately
        }
        
        if (fullText.includes("collages") && !visibleTypes.collage) {
            setVisibleTypes(prev => ({ ...prev, collage: true }));
            setCurrentLabelType('collage');  // Show collage titles immediately
            
            // After 2s, hide all labels and enable interactivity
            const timer = setTimeout(() => {
                setCurrentLabelType(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [introText.text, secondText.text, visibleTypes]);

    // Function to render clickable item with proper styling
    const renderClickableItem = (type: NodeType, text: string, color: string) => (
        <span 
            className={`filter-item ${!visibleTypes[type] ? 'inactive' : ''}`}
            onClick={() => toggleNodeType(type)}
        >
            <span 
                className="color-square"
                style={{ backgroundColor: color }}
            />
            <span className="filter-label">{text}</span>
        </span>
    );

    // Function to process text and replace keywords with styled components
    const processText = (text: string) => {
        const parts = text.split(/(books|diary entries|collages)/);
        return parts.map((part, index) => {
            switch (part) {
                case 'books':
                    return renderClickableItem('book', 'books', '#0000ff');
                case 'diary entries':
                    return renderClickableItem('diary', 'diary entries', '#00ff00');
                case 'collages':
                    return renderClickableItem('collage', 'collages', '#ff0000');
                default:
                    return part;
            }
        });
    };

    useEffect(() => {
        // Make the content ready but invisible immediately
        setIsVisible(true);
        
        // After 1 second, start fading out the static
        setTimeout(() => {
            setShowTransition(false);
        }, 1000);
    }, []);

    useEffect(() => {
        if (isVisible) {
            createNetworkVisualization();
        }
    }, [visibleTypes, isVisible]);

    const createNetworkVisualization = () => {
        if (!networkRef.current) return;

        // Clear existing content
        d3.select(networkRef.current).selectAll("*").remove();

        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'network-tooltip')
            .style('opacity', 0);

        const width = networkRef.current.clientWidth;
        const height = networkRef.current.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Create nodes array
        const nodes: NodeDatum[] = [];
        const links: LinkDatum[] = [];

        // Add nodes based on visibility with initial center positions
        if (visibleTypes.book) {
            books.forEach(book => {
                nodes.push({ 
                    id: book.id, 
                    type: 'book',
                    x: centerX,
                    y: centerY,
                    label: `${book.title} (${book.publishYear})`
                });
            });
        }

        if (visibleTypes.collage) {
            collages.forEach(collage => {
                nodes.push({ 
                    id: collage.id, 
                    type: 'collage',
                    x: centerX,
                    y: centerY,
                    label: collage.title
                });
            });
        }

        if (visibleTypes.diary) {
            diaryEntries.forEach(diary => {
                nodes.push({ 
                    id: diary.id, 
                    type: 'diary',
                    x: centerX,
                    y: centerY,
                    label: diary.date
                });
            });
        }

        // Create links between collages and their books
        if (visibleTypes.collage && visibleTypes.book) {
            collages.forEach(collage => {
                const collageNode = nodes.find(n => n.id === collage.id && n.type === 'collage');
                if (!collageNode) return;

                collage.bookIds.forEach(bookId => {
                    const bookNode = nodes.find(n => n.id === bookId && n.type === 'book');
                    if (bookNode) {
                        links.push({
                            source: collageNode,
                            target: bookNode
                        });
                    }
                });
            });
        }

        // Create links between books and their diary entries
        if (visibleTypes.book && visibleTypes.diary) {
            books.forEach(book => {
                const bookNode = nodes.find(n => n.id === book.id && n.type === 'book');
                if (!bookNode) return;

                book.diaryIds.forEach(diaryId => {
                    const diaryNode = nodes.find(n => n.id === diaryId && n.type === 'diary');
                    if (diaryNode) {
                        links.push({
                            source: bookNode,
                            target: diaryNode
                        });
                    }
                });
            });
        }

        const nodeSize = 8;

        // Create SVG and container
        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height);

        const container = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Add links
        const link = container.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('class', 'network-link entering');

        // Add nodes
        const node = container.append('g')
            .selectAll('rect')
            .data(nodes)
            .join('rect')
            .attr('width', nodeSize)
            .attr('height', nodeSize)
            .attr('fill', d => {
                switch (d.type) {
                    case 'collage': return '#ff0000';
                    case 'book': return '#0000ff';
                    case 'diary': return '#00ff00';
                }
            })
            .attr('class', 'network-node entering')
            .attr('x', centerX - nodeSize / 2)
            .attr('y', centerY - nodeSize / 2)
            .style('cursor', 'pointer')
            .on('click', function(event: any, d: any) {
                // Prevent navigation if we're dragging
                if (event.defaultPrevented) return;

                // Hide tooltip immediately when clicking
                tooltip.transition()
                    .duration(0)
                    .style('opacity', 0);

                // Navigate based on node type
                const node = d as NodeDatum;
                switch (node.type) {
                    case 'collage':
                        navigate(`/collages/${node.id}`);
                        break;
                    case 'book':
                        navigate(`/books/${node.id}`);
                        break;
                    case 'diary':
                        navigate(`/diary/${node.id}`);
                        break;
                }
            })
            .on('mouseover', function(event: any, d: any) {
                const node = d as NodeDatum;
                let tooltipContent = '';
                let nodeType = '';
                
                switch (node.type) {
                    case 'book':
                        const book = books.find(b => b.id === node.id);
                        if (book) {
                            tooltipContent = `${book.title} (${book.publishYear})`;
                            nodeType = 'book-tooltip';
                        }
                        break;
                    case 'collage':
                        const collage = collages.find(c => c.id === node.id);
                        if (collage) {
                            tooltipContent = collage.title;
                            nodeType = 'collage-tooltip';
                        }
                        break;
                    case 'diary':
                        const diary = diaryEntries.find(de => de.id === node.id);
                        if (diary) {
                            tooltipContent = `${diary.title} - ${diary.date}`;
                            nodeType = 'diary-tooltip';
                        }
                        break;
                }
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip
                    .attr('class', `network-tooltip ${nodeType}`)
                    .html(tooltipContent)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .call(d3.drag<SVGRectElement, NodeDatum>()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }) as any);

        // Add labels
        const labels = container.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .text(d => d.label || '')
            .attr('class', d => `node-label ${d.type}-label ${d.type === currentLabelType ? 'visible' : 'fading'}`)
            .attr('text-anchor', 'middle')
            .attr('dy', 20);

        // Trigger animations after a brief delay
        setTimeout(() => {
            container.selectAll('.network-node.entering')
                .classed('entering', false)
                .classed('visible', true);

            container.selectAll('.network-link.entering')
                .classed('entering', false)
                .classed('visible', true);
        }, 0);

        // Force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .distance(100)
                .strength(1)
            )
            .force('charge', d3.forceManyBody()
                .strength(-200)
                .distanceMin(10)
                .distanceMax(300)
            )
            .force('center', d3.forceCenter(width / 2, height / 2)
                .strength(0.1)
            )
            .force('collision', d3.forceCollide()
                .radius(nodeSize * 2)
                .strength(1)
            )
            .force('x', d3.forceX(width / 2)
                .strength(0.05)
            )
            .force('y', d3.forceY(height / 2)
                .strength(0.05)
            )
            .on('tick', () => {
                // Update link positions
                link
                    .attr('x1', d => (d.source as any).x)
                    .attr('y1', d => (d.source as any).y)
                    .attr('x2', d => (d.target as any).x)
                    .attr('y2', d => (d.target as any).y);

                // Update node positions
                node
                    .attr('x', d => (d as any).x - nodeSize / 2)
                    .attr('y', d => (d as any).y - nodeSize / 2);

                // Update label positions
                labels
                    .attr('x', d => (d as any).x)
                    .attr('y', d => (d as any).y);
            });

        // Initial simulation kick with higher alpha
        simulation.alpha(1).restart();

        return () => {
            tooltip.remove();
        };
    };

    const toggleNodeType = (type: NodeType) => {
        setVisibleTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const buttonData: ButtonData[] = [
        { type: 'collage', label: 'Collages', color: '#ff0000' },
        { type: 'book', label: 'Books', color: '#0000ff' },
        { type: 'diary', label: 'Diary Entries', color: '#00ff00' }
    ];

    return (
        <>
            <StaticTransition 
                isVisible={showTransition} 
                duration={800}
            />
            <div className={`homepage ${isVisible ? 'visible' : ''}`}>
                <div className="homepage-content">
                    <div className="text-section">
                        <div className="network-intro">
                            <h2 className="scramble-text">{scrambledTitle}</h2>
                            <p className="typewriter-text">
                                {introText.text}
                                {introText.isComplete && (
                                    <>{" "}{processText(secondText.text)}</>
                                )}
                                <span className={`cursor ${
                                    (!introText.isComplete || !secondText.isComplete) && 
                                    (introText.isComplete ? secondText.cursor : introText.cursor) 
                                        ? 'visible' 
                                        : ''
                                }`}>|</span>
                            </p>
                        </div>
                    </div>
                    <div className="network-section">
                        <svg ref={networkRef} className="network-graph"></svg>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homepage;