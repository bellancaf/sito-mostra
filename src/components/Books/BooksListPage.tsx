import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { books, getCollagesForBook } from '../../data';
import * as d3 from 'd3';
import './BooksListPage.css';
import BooksTimeline from './components/BooksTimeline';

interface NodeDatum {
    id: string;
    title: string;
    coverImage: string;
    author: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface LinkDatum {
    source: NodeDatum;
    target: NodeDatum;
}

type ViewMode = 'grid' | 'network' | 'timeline';

const BooksListPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const networkRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (viewMode === 'network') {
            createNetworkVisualization();
        }
    }, [viewMode]);

    const createNetworkVisualization = () => {
        if (!networkRef.current) return;

        const width = networkRef.current.clientWidth || 800;
        const height = networkRef.current.clientHeight || 600;
        const imageWidth = 80;
        const imageHeight = 120;

        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height);

        // Clear any existing content
        svg.selectAll("*").remove();

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
                if (i < j) {  // Avoid duplicate links
                    const collagesForBook1 = getCollagesForBook(book1.id);
                    const collagesForBook2 = getCollagesForBook(book2.id);
                    const sharedCollages = collagesForBook1.filter(collage => 
                        collagesForBook2.some(c => c.id === collage.id)
                    );
                    if (sharedCollages.length > 0) {
                        links.push({ 
                            source: nodes[i], 
                            target: nodes[j]
                        });
                    }
                }
            });
        });

        const simulation = d3.forceSimulation<NodeDatum>(nodes)
            .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
                .id(d => d.id)
                .distance(250))
            .force('charge', d3.forceManyBody()
                .strength(-800))
            .force('collision', d3.forceCollide()
                .radius(Math.max(imageWidth, imageHeight) / 1.5))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Create patterns for book covers
        const defs = svg.append('defs');
        nodes.forEach(node => {
            defs.append('pattern')
                .attr('id', `image-${node.id}`)
                .attr('width', 1)
                .attr('height', 1)
                .append('image')
                .attr('href', node.coverImage)
                .attr('width', imageWidth)
                .attr('height', imageHeight)
                .attr('preserveAspectRatio', 'xMidYMid slice');
        });

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 1.5);

        const nodeGroup = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g');

        // Add rectangles with book covers
        nodeGroup
            .append('rect')
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('fill', d => `url(#image-${d.id})`);

        // Add title background
        nodeGroup
            .append('rect')
            .attr('width', imageWidth)
            .attr('height', 40)
            .attr('fill', 'rgba(0, 0, 0, 0.7)')
            .style('opacity', 0);

        // Add title text
        const titleText = nodeGroup
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('dy', 20)
            .text(d => d.title)
            .style('opacity', 0)
            .style('font-size', '10px');

        // Hover effects
        nodeGroup
            .on('mouseover', function() {
                const group = d3.select(this);
                group.select('text').style('opacity', 1);
                group.select('rect:nth-child(2)').style('opacity', 1);
            })
            .on('mouseout', function() {
                const group = d3.select(this);
                group.select('text').style('opacity', 0);
                group.select('rect:nth-child(2)').style('opacity', 0);
            })
            .on('click', (event, d) => {
                window.location.href = `/books/${d.id}`;
            });

        // Drag behavior
        const dragBehavior = d3.drag<SVGGElement, NodeDatum>()
            .on('start', (event: any) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                const d = event.subject;
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event: any) => {
                const d = event.subject;
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event: any) => {
                if (!event.active) simulation.alphaTarget(0);
                const d = event.subject;
                d.fx = null;
                d.fy = null;
            });

        nodeGroup.call(dragBehavior as any);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x!)
                .attr('y1', d => d.source.y!)
                .attr('x2', d => d.target.x!)
                .attr('y2', d => d.target.y!);

            nodeGroup
                .attr('transform', d => `translate(${d.x! - imageWidth/2},${d.y! - imageHeight/2})`);

            titleText
                .attr('x', imageWidth / 2);
        });
    };

    return (
        <div className="books-container">
            <h1 className="books-title">Books</h1>
            
            <div className="view-controls">
                <button 
                    className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                >
                    grid
                </button>
                <button 
                    className={`view-button ${viewMode === 'network' ? 'active' : ''}`}
                    onClick={() => setViewMode('network')}
                >
                    network
                </button>
                <button 
                    className={`view-button ${viewMode === 'timeline' ? 'active' : ''}`}
                    onClick={() => setViewMode('timeline')}
                >
                    timeline
                </button>
            </div>

            {viewMode === 'grid' && (
                <div className="books-grid">
                    {books.map(book => (
                        <Link 
                            to={`/books/${book.id}`} 
                            key={book.id}
                            className="book-card"
                        >
                            <div className="book-cover-container">
                                <img 
                                    src={book.coverImage} 
                                    alt={book.title} 
                                    className="book-cover"
                                />
                            </div>
                            <div className="book-info">
                                <h2>{book.title}</h2>
                                <span className="book-author">{book.author}</span>
                                <span className="book-year">{book.publishYear}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            
            {viewMode === 'network' && (
                <svg ref={networkRef} className="books-network"></svg>
            )}
            
            {viewMode === 'timeline' && (
                <BooksTimeline books={books} />
            )}
        </div>
    );
};

export default BooksListPage; 