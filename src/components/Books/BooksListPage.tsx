import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, Location } from 'react-router-dom';
import { books, getCollagesForBook } from '../../data';
import * as d3 from 'd3';
import './BooksListPage.css';
import BooksTimeline from './components/BooksTimeline';
import { IconContext } from 'react-icons';
import StaticNoiseBookCard from './components/StaticNoiseBookCard';
import { getImagePaths } from '../../utils/imageUtils';
import { MdGridOn, MdAccountTree, MdTimeline } from 'react-icons/md';
import useMediaQuery from '../../hooks/useMediaQuery';
import MobileNotice from '../common/MobileNotice';

interface NodeDatum {
    id: string;
    title: string;
    coverImage: string;
    author: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    animationFrame?: number;
}

interface LinkDatum {
    source: NodeDatum;
    target: NodeDatum;
    strength?: number;
}

type ViewMode = 'grid' | 'network' | 'timeline';

const getLocationString = (location: string | { toString(): string } | undefined): string | undefined => {
    if (!location) return undefined;
    if (typeof location === 'string') return location;
    return location.toString();
};

const GridIcon = MdGridOn as React.ElementType;
const NetworkIcon = MdAccountTree as React.ElementType;
const TimelineIcon = MdTimeline as React.ElementType;

const BooksListPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const networkRef = useRef<SVGSVGElement | null>(null);
    const canvasRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
    const animationFrames = useRef<{ [key: string]: number }>({});
    const isHovering = useRef<{ [key: string]: boolean }>({});
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (viewMode === 'network' && !isMobile) {
            createNetworkVisualization();
        }

        return () => {
            // Cleanup D3 event listeners
            if (networkRef.current) {
                d3.select(networkRef.current).on('.zoom', null);
            }
        };
    }, [viewMode, isMobile]);

    // Force grid view on mobile
    useEffect(() => {
        if (isMobile && viewMode !== 'grid') {
            setViewMode('grid');
        }
    }, [isMobile]);

    const createNetworkVisualization = () => {
        if (!networkRef.current || isMobile) return; // Don't create network on mobile

        const width = networkRef.current.clientWidth || 1200;
        const height = 600;
        const nodeSize = 100;

        // Add zoom behavior with interrupt check
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.2, 3])
            .on('zoom', (event) => {
                if (!event.sourceEvent) return; // Ignore zoom events without source event
                if (event.sourceEvent.type === 'wheel' && event.sourceEvent.ctrlKey) {
                    event.preventDefault(); // Prevent browser zoom on Ctrl+Wheel
                }
                container.attr('transform', event.transform);
            })
            .filter(event => {
                // Disable zoom on mobile devices
                if (isMobile) return false;
                // Allow only mouse wheel and drag events
                return !event.ctrlKey && !event.button && event.type !== 'dblclick';
            });

        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(zoom)
            .on("dblclick.zoom", null);

        // Clear any existing content
        svg.selectAll("*").remove();

        // Create defs first for patterns
        const defs = svg.append('defs');

        // Create a container group for all elements
        const container = svg.append('g')
            .attr('transform', `translate(${width/2},${height/2})`);

        // Create nodes from books
        const nodes: NodeDatum[] = books.map(book => ({
            id: book.id,
            title: book.title,
            coverImage: book.coverImage,
            author: book.author
        }));

        // Create links between books that appear in the same collage
        const links: LinkDatum[] = [];
        books.forEach((book1, i) => {
            books.forEach((book2, j) => {
                if (i < j) {
                    const collagesForBook1 = getCollagesForBook(book1.id);
                    const collagesForBook2 = getCollagesForBook(book2.id);
                    const sharedCollages = collagesForBook1.filter(collage => 
                        collagesForBook2.some(c => c.id === collage.id)
                    );
                    if (sharedCollages.length > 0) {
                        links.push({ 
                            source: nodes[i], 
                            target: nodes[j],
                            strength: sharedCollages.length
                        });
                    }
                }
            });
        });

        // Create patterns for book covers with static noise
        nodes.forEach(node => {
            const pattern = defs.append('pattern')
                .attr('id', `cover-${node.id}`)
                .attr('width', 1)
                .attr('height', 1);

            const canvas = document.createElement('canvas');
            canvas.width = nodeSize;
            canvas.height = nodeSize;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            const { thumbnail } = getImagePaths(node.coverImage || '');
            img.onload = () => {
                // Draw image
                ctx.drawImage(img, 0, 0, nodeSize, nodeSize);
                
                // Add static noise
                const imageData = ctx.getImageData(0, 0, nodeSize, nodeSize);
                const data = imageData.data;

                // Add semi-transparent noise
                for (let i = 0; i < data.length; i += 4) {
                    const value = Math.random() * 255;
                    data[i + 3] = value * 0.3;
                }

                // Add colored dots
                const primaryColors = [[255, 0, 0], [255, 255, 0], [0, 0, 255]];
                const numDots = 15;
                for (let i = 0; i < numDots; i++) {
                    const x = Math.floor(Math.random() * nodeSize);
                    const y = Math.floor(Math.random() * nodeSize);
                    const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
                    const pixelIndex = (y * nodeSize + x) * 4;
                    
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            const index = pixelIndex + (dy * nodeSize + dx) * 4;
                            if (index < data.length - 3) {
                                data[index] = color[0];
                                data[index + 1] = color[1];
                                data[index + 2] = color[2];
                                data[index + 3] = 255;
                            }
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                
                // Update pattern
                pattern.append('image')
                    .attr('href', canvas.toDataURL())
                    .attr('width', nodeSize)
                    .attr('height', nodeSize)
                    .attr('preserveAspectRatio', 'xMidYMid slice');
            };
            img.src = thumbnail;
        });

        // Create nodes group first but don't draw yet
        const nodesGroup = container.append('g')
            .attr('class', 'nodes-group');

        // Create and draw links group
        const linksGroup = container.append('g')
            .attr('class', 'links-group')
            .lower(); // Force links to back

        // Draw all links
        const link = linksGroup.selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt((d.strength || 1) * 2));

        // Draw all nodes
        const node = nodesGroup.selectAll('g')
            .data(nodes)
            .join('g')
            .style('cursor', 'pointer') // Add pointer cursor
            .on('click', (event, d) => {
                navigate(`/books/${d.id}`);
            })
            .call(d3.drag<SVGGElement, NodeDatum>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended) as any);

        // Add white background rectangles to ensure links are hidden
        node.append('rect')
            .attr('width', nodeSize)
            .attr('height', nodeSize)
            .attr('x', -nodeSize/2)
            .attr('y', -nodeSize/2)
            .attr('fill', 'white');

        // Add rectangles with book covers
        node.append('rect')
            .attr('width', nodeSize)
            .attr('height', nodeSize)
            .attr('x', -nodeSize/2)
            .attr('y', -nodeSize/2)
            .attr('fill', d => `url(#cover-${d.id})`);

        // Create the force simulation
        const simulation = d3.forceSimulation<NodeDatum>(nodes)
            .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
                .id(d => d.id)
                .distance(200)
                .strength(d => (d.strength || 1) * 0.1)) // Further reduced link strength
            .force('charge', d3.forceManyBody()
                .strength(-300)) // Further reduced repulsion
            .force('collide', d3.forceCollide()
                .radius(nodeSize * 0.8)
                .strength(0.3)) // Further reduced collision strength
            .force('x', d3.forceX().strength(0.02)) // Further reduced centering force
            .force('y', d3.forceY().strength(0.02)) // Further reduced centering force
            .velocityDecay(0.6); // Increased velocity decay for slower movement

        // Add hover interaction for static noise effect
        node.on('mouseenter', function(event, d) {
            const pattern = defs.select(`#cover-${d.id}`);
            const canvas = document.createElement('canvas');
            canvas.width = nodeSize;
            canvas.height = nodeSize;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            const { thumbnail } = getImagePaths(d.coverImage || '');
            img.onerror = () => {
                // Use default pattern if image fails to load
                drawDefaultPattern(ctx, nodeSize, nodeSize);
                startAnimation();
            };
            
            function startAnimation() {
                let lastDrawTime = performance.now();
                function animate() {
                    if (!ctx) return;
                    
                    const now = performance.now();
                    if (now - lastDrawTime < 100) {
                        d.animationFrame = requestAnimationFrame(animate);
                        return;
                    }
                    lastDrawTime = now;
                    
                    // Draw image
                    ctx.drawImage(img, 0, 0, nodeSize, nodeSize);
                    
                    // Add noise effect
                    const imageData = ctx.getImageData(0, 0, nodeSize, nodeSize);
                    const data = imageData.data;

                    // Add semi-transparent noise
                    for (let i = 0; i < data.length; i += 4) {
                        const value = Math.random() * 255;
                        data[i + 3] = value * 0.3;
                    }

                    // Add colored dots
                    const primaryColors = [[255, 0, 0], [255, 255, 0], [0, 0, 255]];
                    const numDots = 15;
                    for (let i = 0; i < numDots; i++) {
                        const x = Math.floor(Math.random() * nodeSize);
                        const y = Math.floor(Math.random() * nodeSize);
                        const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
                        const pixelIndex = (y * nodeSize + x) * 4;
                        
                        for (let dy = 0; dy < 2; dy++) {
                            for (let dx = 0; dx < 2; dx++) {
                                const index = pixelIndex + (dy * nodeSize + dx) * 4;
                                if (index < data.length - 3) {
                                    data[index] = color[0];
                                    data[index + 1] = color[1];
                                    data[index + 2] = color[2];
                                    data[index + 3] = 255;
                                }
                            }
                        }
                    }

                    ctx.putImageData(imageData, 0, 0);
                    
                    // Update pattern
                    pattern.select('image')
                        .attr('href', canvas.toDataURL());

                    d.animationFrame = requestAnimationFrame(animate);
                }
                animate();
            }

            // Wait for image to load before starting animation
            img.onload = startAnimation;
            img.src = thumbnail;
        })
        .on('mouseleave', function(event, d) {
            if (d.animationFrame) {
                cancelAnimationFrame(d.animationFrame);
                delete d.animationFrame;
            }
            
            const pattern = defs.select(`#cover-${d.id}`);
            const canvas = document.createElement('canvas');
            canvas.width = nodeSize;
            canvas.height = nodeSize;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            const { thumbnail } = getImagePaths(d.coverImage || '');
            img.onerror = () => {
                // Use default pattern if image fails to load
                drawDefaultPattern(ctx, nodeSize, nodeSize);
                pattern.select('image')
                    .attr('href', canvas.toDataURL());
            };
            
            img.onload = () => {
                // Draw final static frame
                ctx.drawImage(img, 0, 0, nodeSize, nodeSize);
                
                // Add static noise one last time
                const imageData = ctx.getImageData(0, 0, nodeSize, nodeSize);
                const data = imageData.data;

                // Add semi-transparent noise
                for (let i = 0; i < data.length; i += 4) {
                    const value = Math.random() * 255;
                    data[i + 3] = value * 0.3;
                }

                // Add colored dots
                const primaryColors = [[255, 0, 0], [255, 255, 0], [0, 0, 255]];
                const numDots = 15;
                for (let i = 0; i < numDots; i++) {
                    const x = Math.floor(Math.random() * nodeSize);
                    const y = Math.floor(Math.random() * nodeSize);
                    const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
                    const pixelIndex = (y * nodeSize + x) * 4;
                    
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            const index = pixelIndex + (dy * nodeSize + dx) * 4;
                            if (index < data.length - 3) {
                                data[index] = color[0];
                                data[index + 1] = color[1];
                                data[index + 2] = color[2];
                                data[index + 3] = 255;
                            }
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                pattern.select('image')
                    .attr('href', canvas.toDataURL());
            };
            img.src = thumbnail;
        });

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.1).restart(); // Reduced alpha target
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        // Update positions on each tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x!)
                .attr('y1', d => d.source.y!)
                .attr('x2', d => d.target.x!)
                .attr('y2', d => d.target.y!);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    };

    const drawDefaultPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Fill with a light gray background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        
        // Add some simple geometric pattern
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        
        // Draw diagonal lines
        for (let i = 0; i < width + height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(0, i);
            ctx.stroke();
        }
    };

    const drawNoiseOverlay = (
        ctx: CanvasRenderingContext2D, 
        img: HTMLImageElement,
        width: number,
        height: number
    ) => {
        return new Promise<void>((resolve) => {
            img.onerror = () => {
                // Draw default pattern if image fails to load
                drawDefaultPattern(ctx, width, height);
                drawNoiseEffect();
                resolve();
            };

            if (!img.complete || img.naturalWidth === 0) {
                img.onload = () => {
                    drawNoiseEffect(true);
                    resolve();
                };
            } else {
                drawNoiseEffect(true);
                resolve();
            }

            function drawNoiseEffect(hasImage: boolean = false) {
                if (hasImage) {
                    // Draw the image first if we have one
                    try {
                        ctx.drawImage(img, 0, 0, width, height);
                    } catch (e) {
                        // If drawing fails, use default pattern
                        drawDefaultPattern(ctx, width, height);
                    }
                }

                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                // Draw semi-transparent noise
                for (let i = 0; i < data.length; i += 4) {
                    const value = Math.random() * 255;
                    data[i + 3] = value * 0.3; // 30% opacity for noise
                }

                // Add colored dots
                const primaryColors = [
                    [255, 0, 0],    // Red
                    [255, 255, 0],  // Yellow
                    [0, 0, 255]     // Blue
                ];

                const numDots = 50;
                for (let i = 0; i < numDots; i++) {
                    const x = Math.floor(Math.random() * width);
                    const y = Math.floor(Math.random() * height);
                    const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
                    const pixelIndex = (y * width + x) * 4;

                    // Draw a 2x2 pixel dot
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            const index = pixelIndex + (dy * width + dx) * 4;
                            if (index < data.length - 3) {
                                data[index] = color[0];
                                data[index + 1] = color[1];
                                data[index + 2] = color[2];
                                data[index + 3] = 255;
                            }
                        }
                    }
                }

                ctx.putImageData(imageData, 0, 0);
            }
        });
    };

    const handleMouseEnter = async (bookId: string) => {
        isHovering.current[bookId] = true;
        const canvas = canvasRefs.current[bookId];
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        const { thumbnail } = getImagePaths(books.find(b => b.id === bookId)?.coverImage || '');

        const animate = async () => {
            if (!isHovering.current[bookId]) return;
            await drawNoiseOverlay(ctx, img, canvas.width, canvas.height);
            animationFrames.current[bookId] = requestAnimationFrame(animate);
        };
        animate();
    };

    const handleMouseLeave = (bookId: string) => {
        isHovering.current[bookId] = false;
        if (animationFrames.current[bookId]) {
            cancelAnimationFrame(animationFrames.current[bookId]);
        }

        // Reset to original image
        const canvas = canvasRefs.current[bookId];
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        const { thumbnail } = getImagePaths(books.find(b => b.id === bookId)?.coverImage || '');
        img.src = thumbnail;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };

    return (
        <>
            {isMobile && <MobileNotice />}
            <IconContext.Provider value={{ className: 'view-icon' }}>
                <div className="books-container">
                    <div className="books-main-content">
                        <div className="books-header">
                            <div className="title-section">
                                <h1 className="books-title">Books</h1>
                                {!isMobile ? (
                                    <p className="books-description">
                                        Here you can find my books. You can see them in a{' '}
                                        <span 
                                            className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <GridIcon />
                                            <span className="view-label">grid</span>
                                        </span>
                                        {', '}
                                        <span 
                                            className={`view-option ${viewMode === 'network' ? 'active' : ''}`}
                                            onClick={() => setViewMode('network')}
                                        >
                                            <NetworkIcon />
                                            <span className="view-label">network</span>
                                        </span>
                                        {' '}or{' '}
                                        <span 
                                            className={`view-option ${viewMode === 'timeline' ? 'active' : ''}`}
                                            onClick={() => setViewMode('timeline')}
                                        >
                                            <TimelineIcon />
                                            <span className="view-label">timeline</span>
                                        </span>
                                        {' '}view.
                                    </p>
                                ) : (
                                    <p className="books-description-mobile">
                                        Browse through my collection of books.
                                    </p>
                                )}
                            </div>
                        </div>

                        {viewMode === 'grid' && (
                            <div className="books-grid">
                                {books.map(book => {
                                    const { thumbnail } = getImagePaths(book.coverImage || '');
                                    return (
                                        <StaticNoiseBookCard
                                            key={book.id}
                                            id={book.id}
                                            title={book.title}
                                            author={book.author}
                                            publishYear={book.publishYear}
                                            coverImage={thumbnail}
                                            location={getLocationString(book.location)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                        
                        {viewMode === 'network' && (
                            <svg ref={networkRef} className="books-network"></svg>
                        )}
                        
                        {viewMode === 'timeline' && (
                            <BooksTimeline books={books} />
                        )}
                    </div>
                </div>
            </IconContext.Provider>
        </>
    );
};

export default BooksListPage;