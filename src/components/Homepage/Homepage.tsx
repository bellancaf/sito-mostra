import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './components';
import { collages, books, diaryEntries } from '../../data';
import * as d3 from 'd3';
import './Homepage.css';

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
        collage: true,
        book: true,
        diary: true
    });

    useEffect(() => {
        createNetworkVisualization();
    }, [visibleTypes]);

    const createNetworkVisualization = () => {
        if (!networkRef.current) return;

        // Clear existing content
        d3.select(networkRef.current).selectAll("*").remove();

        // Create tooltip
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'network-tooltip')
            .style('opacity', 0);

        // Create nodes array
        const nodes: NodeDatum[] = [];
        const links: LinkDatum[] = [];

        // Add nodes based on visibility
        if (visibleTypes.book) {
            books.forEach(book => {
                nodes.push({ id: book.id, type: 'book' });
            });
        }

        if (visibleTypes.collage) {
            collages.forEach(collage => {
                nodes.push({ id: collage.id, type: 'collage' });
            });
        }

        if (visibleTypes.diary) {
            diaryEntries.forEach(diary => {
                nodes.push({ id: diary.id, type: 'diary' });
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
                        console.log(`Creating collage-book link: Collage "${collage.title}" -> Book "${books.find(b => b.id === bookId)?.title}"`);
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
                        console.log(`Creating book-diary link: Book "${book.title}" -> Diary "${diaryEntries.find(d => d.id === diaryId)?.title}"`);
                        links.push({
                            source: bookNode,
                            target: diaryNode
                        });
                    }
                });
            });
        }

        const width = networkRef.current.clientWidth;
        const height = 500;
        const nodeSize = 8;

        // Create SVG with zoom support
        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height);

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create container for nodes and links
        const container = svg.append('g');

        // Add zoom controls
        const zoomControls = svg.append('g')
            .attr('class', 'zoom-controls')
            .attr('transform', `translate(20, ${height - 80})`);

        zoomControls.append('rect')
            .attr('width', 30)
            .attr('height', 60)
            .attr('rx', 5)
            .attr('fill', 'white')
            .attr('stroke', '#ccc');

        // Zoom in button
        zoomControls.append('g')
            .attr('class', 'zoom-in')
            .attr('transform', 'translate(0, 0)')
            .on('click', () => {
                svg.transition()
                    .duration(300)
                    .call(zoom.scaleBy as any, 1.3);
            })
            .append('text')
            .attr('x', 15)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .text('+')
            .style('font-size', '20px')
            .style('cursor', 'pointer');

        // Zoom out button
        zoomControls.append('g')
            .attr('class', 'zoom-out')
            .attr('transform', 'translate(0, 30)')
            .on('click', () => {
                svg.transition()
                    .duration(300)
                    .call(zoom.scaleBy as any, 0.7);
            })
            .append('text')
            .attr('x', 15)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .text('−')
            .style('font-size', '20px')
            .style('cursor', 'pointer');

        // Create links
        const link = container.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6);

        // Create nodes with drag and click behavior
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
                    case 'diary': return '#ffff00';
                }
            })
            .style('cursor', 'pointer')
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
                }) as any)
            .on('click', (event, d) => {
                // Prevent navigation if we're dragging
                if (event.defaultPrevented) return;

                // Hide tooltip immediately when clicking
                tooltip.transition()
                    .duration(0)  // Immediate transition
                    .style('opacity', 0);

                // Navigate based on node type
                switch (d.type) {
                    case 'collage':
                        navigate(`/collages/${d.id}`);
                        break;
                    case 'book':
                        navigate(`/books/${d.id}`);
                        break;
                    case 'diary':
                        navigate(`/diary/${d.id}`);
                        break;
                }
            })
            .on('mouseover', (event, d) => {
                let title = '';
                switch (d.type) {
                    case 'book':
                        title = books.find(b => b.id === d.id)?.title || 'Unknown Book';
                        break;
                    case 'collage':
                        title = collages.find(c => c.id === d.id)?.title || 'Unknown Collage';
                        break;
                    case 'diary':
                        title = diaryEntries.find(de => de.id === d.id)?.title || 'Unknown Entry';
                        break;
                }
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`${title} (${d.type})<br/>Click to view details`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        // Force simulation with adjusted forces
        const simulation = d3.forceSimulation(nodes)
            // Link force with increased distance
            .force('link', d3.forceLink(links)
                .distance(100)  // Increased distance between connected nodes
                .strength(1)    // Maximum strength to maintain the desired distance
            )
            // Charge force (repulsion between nodes)
            .force('charge', d3.forceManyBody()
                .strength(-200)  // Stronger repulsion
                .distanceMin(10) // Minimum distance for repulsion
                .distanceMax(300) // Maximum distance for repulsion
            )
            // Center force to pull nodes toward the center
            .force('center', d3.forceCenter(width / 2, height / 2)
                .strength(0.1)  // Gentle pull toward center
            )
            // Collision force to prevent overlap
            .force('collision', d3.forceCollide()
                .radius(nodeSize * 2)
                .strength(1)    // Maximum strength to prevent overlap
            )
            // Boundary forces to keep nodes within the visible area
            .force('x', d3.forceX(width / 2)
                .strength(0.05)  // Gentle force toward center x
            )
            .force('y', d3.forceY(height / 2)
                .strength(0.05)  // Gentle force toward center y
            )
            // Contain nodes within bounds
            .force('bound', () => {
                const padding = 50; // Padding from edges
                nodes.forEach(node => {
                    // Ensure x position stays within bounds
                    if ((node as any).x < padding) (node as any).x = padding;
                    if ((node as any).x > width - padding) (node as any).x = width - padding;
                    // Ensure y position stays within bounds
                    if ((node as any).y < padding) (node as any).y = padding;
                    if ((node as any).y > height - padding) (node as any).y = height - padding;
                });
            })
            .on('tick', () => {
                // Constrain node positions within bounds during tick
                nodes.forEach(node => {
                    const padding = 50;
                    (node as any).x = Math.max(padding, Math.min(width - padding, (node as any).x));
                    (node as any).y = Math.max(padding, Math.min(height - padding, (node as any).y));
                });

                link
                    .attr('x1', d => (d.source as any).x)
                    .attr('y1', d => (d.source as any).y)
                    .attr('x2', d => (d.target as any).x)
                    .attr('y2', d => (d.target as any).y);

                node
                    .attr('x', d => (d as any).x - nodeSize / 2)
                    .attr('y', d => (d as any).y - nodeSize / 2);
            });

        // Initial simulation kick with higher alpha
        simulation.alpha(1).restart();

        // Cleanup function
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
        { type: 'diary', label: 'Diary Entries', color: '#ffff00' }
    ];

    return (
        <div className="homepage">
            <div className="network-visualization">
                <div className="network-intro">
                    <h2>My Paper Stories</h2>
                    <p>
                        As I travel around the world, I collect fragments of stories in paper form. 
                        I hunt for <span 
                            className={`filter-item ${!visibleTypes.book ? 'inactive' : ''}`}
                            onClick={() => toggleNodeType('book')}
                        >
                            <span 
                                className="color-square"
                                style={{ backgroundColor: '#0000ff' }}
                            />
                            <span className="filter-label">books</span>
                        </span> in second-hand shops and markets. 
                        When I find interesting ones, I write <span 
                            className={`filter-item ${!visibleTypes.diary ? 'inactive' : ''}`}
                            onClick={() => toggleNodeType('diary')}
                        >
                            <span 
                                className="color-square"
                                style={{ backgroundColor: '#ffff00' }}
                            />
                            <span className="filter-label">diary entries</span>
                        </span> about them, 
                        and eventually create <span 
                            className={`filter-item ${!visibleTypes.collage ? 'inactive' : ''}`}
                            onClick={() => toggleNodeType('collage')}
                        >
                            <span 
                                className="color-square"
                                style={{ backgroundColor: '#ff0000' }}
                            />
                            <span className="filter-label">collages</span>
                        </span> with their pages.
                    </p>
                </div>
                <svg ref={networkRef} className="network-graph"></svg>
            </div>
        </div>
    );
};

export default Homepage;