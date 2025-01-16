import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collages } from '../../data';
import * as d3 from 'd3';
import './CollagesPage.css';
import CollagesSidebar from './components/CollagesSidebar';
import { FaThLarge, FaProjectDiagram } from 'react-icons/fa';
import StaticNoiseCollageCard from './components/StaticNoiseCollageCard';
import { drawStaticNoise } from '../Books/components/StaticNoiseBookCard';

interface NodeDatum {
    id: string;
    title: string;
    image: string;
    date: string;
    rectWidth?: number;
    rectHeight?: number;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface LinkDatum {
    source: NodeDatum;
    target: NodeDatum;
}

interface CollageData {
    id: string;
    title: string;
    image: string;
    date: string;
    bookIds: string[];
    description?: string;
}

const targetArea = 14400; // 120 * 120 pixels - target area for node rectangles

// Function to calculate dimensions maintaining aspect ratio and target area
const calculateDimensions = (imageUrl: string): Promise<{ width: number, height: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            // Calculate dimensions that maintain aspect ratio and target area
            const rectHeight = Math.sqrt(targetArea / aspectRatio);
            const rectWidth = rectHeight * aspectRatio;
            resolve({ width: rectWidth, height: rectHeight });
        };
        img.src = imageUrl;
    });
};

const CollagesPage: React.FC = () => {
    const [isGridView, setIsGridView] = useState(false);
    const [selectedCollage, setSelectedCollage] = useState<CollageData | null>(null);
    const networkRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!isGridView) {
            const updateNetworkSize = () => {
                if (!networkRef.current) return;
                
                // Set the SVG to fill the container height
                networkRef.current.style.height = 'calc(100vh - 200px)';
                createNetworkVisualization();
            };

            updateNetworkSize();
            window.addEventListener('resize', updateNetworkSize);
            
            return () => window.removeEventListener('resize', updateNetworkSize);
        }
    }, [isGridView]);

    const createNetworkVisualization = () => {
        if (!networkRef.current) return;

        const width = networkRef.current.clientWidth || 800;
        const height = networkRef.current.clientHeight || 600;
        const margin = 100; // Margin from edges

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.2, 3]) // Min and max zoom scale
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        // Clear existing SVG content
        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(zoom as any) // Enable zoom
            .on("dblclick.zoom", null); // Disable double-click zoom

        svg.selectAll("*").remove();

        // Create a container group for all elements
        const container = svg.append('g');

        const setupVisualization = async () => {
            const nodes: NodeDatum[] = collages.map(collage => ({
                id: collage.id,
                title: collage.title,
                image: collage.image,
                date: collage.date,
                rectWidth: 10,  // Fixed size for dots
                rectHeight: 10
            }));

            // Create links array first
            const links: LinkDatum[] = [];
            for (let i = 0; i < collages.length; i++) {
                for (let j = i + 1; j < collages.length; j++) {
                    const sharedBooks = collages[i].bookIds.filter(bookId => 
                        collages[j].bookIds.includes(bookId)
                    );
                    if (sharedBooks.length > 0) {
                        links.push({ source: nodes[i], target: nodes[j] });
                    }
                }
            }

            // Create links group and append it first (so it's behind)
            const linksGroup = container.append('g')
                .attr('class', 'links-group')
                .lower(); // Force links to back

            const link = linksGroup.selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', 1.5);

            // Create nodes group
            const nodeGroup = container.append('g')
                .selectAll('g')
                .data(nodes)
                .join('g')
                .style('cursor', 'pointer')
                .on('click', (event, d) => {
                    event.preventDefault();
                    const collage = collages.find(c => c.id === d.id);
                    if (collage) {
                        setSelectedCollage(collage);
                    }
                });

            // Add circles for nodes
            nodeGroup.append('circle')
                .attr('r', 5)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .attr('stroke-width', 1);

            // Add hover interaction
            nodeGroup
                .on('mouseenter', function() {
                    d3.select(this).select('circle')
                        .transition()
                        .duration(200)
                        .attr('r', 7)
                        .attr('fill', 'var(--color-accent)');
                })
                .on('mouseleave', function() {
                    d3.select(this).select('circle')
                        .transition()
                        .duration(200)
                        .attr('r', 5)
                        .attr('fill', 'black');
                });

            const simulation = d3.forceSimulation<NodeDatum>(nodes)
                .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
                    .id(d => d.id)
                    .distance(100))  // Reduced distance for smaller visualization
                .force('charge', d3.forceManyBody()
                    .strength(-200))  // Reduced strength for smaller visualization
                .force('collision', d3.forceCollide()
                    .radius(10))  // Smaller collision radius
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('x', d3.forceX(width / 2).strength(0.1))
                .force('y', d3.forceY(height / 2).strength(0.1))
                .force('boundary', () => {
                    for (const node of nodes) {
                        node.x = Math.max(margin, Math.min(width - margin, node.x!));
                        node.y = Math.max(margin, Math.min(height - margin, node.y!));
                    }
                });

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

            // Reset zoom button
            zoomControls.append('g')
                .attr('class', 'zoom-reset')
                .attr('transform', `translate(60, 0)`)
                .on('click', () => {
                    svg.transition()
                        .duration(300)
                        .call(zoom.transform as any, d3.zoomIdentity);
                })
                .append('text')
                .attr('text-anchor', 'middle')
                .text('Reset')
                .style('font-size', '12px')
                .style('cursor', 'pointer');

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
                    .attr('x1', (d: LinkDatum) => d.source.x!)
                    .attr('y1', (d: LinkDatum) => d.source.y!)
                    .attr('x2', (d: LinkDatum) => d.target.x!)
                    .attr('y2', (d: LinkDatum) => d.target.y!);

                nodeGroup.attr('transform', d => `translate(${d.x},${d.y})`);
            });
        };

        setupVisualization();
    };

    return (
        <div className="collages-container">
            <div className="collages-main-content">
                <div className="collages-left-column">
                    <div className="title-section">
                        <h1 className="collages-title">Collages</h1>
                        <p className="collages-description">
                            Here you can find my collages. You can see them in a{' '}
                            <span 
                                className={`view-option ${!isGridView ? 'active' : ''}`}
                                onClick={() => setIsGridView(false)}
                            >
                                <FaProjectDiagram className="view-icon" />
                                <span className="view-label">network</span>
                            </span>
                            {' '}or{' '}
                            <span 
                                className={`view-option ${isGridView ? 'active' : ''}`}
                                onClick={() => setIsGridView(true)}
                            >
                                <FaThLarge className="view-icon" />
                                <span className="view-label">grid</span>
                            </span>
                            {' '}view.
                        </p>
                    </div>
                    <div className="collages-network">
                        <svg ref={networkRef} className="collages-network"></svg>
                    </div>
                </div>

                <div className="collages-grid">
                    {collages.map(collage => (
                        <StaticNoiseCollageCard
                            key={collage.id}
                            id={collage.id}
                            title={collage.title}
                            date={collage.date}
                            image={collage.image}
                        />
                    ))}
                </div>
            </div>
            
            <CollagesSidebar 
                collage={selectedCollage}
                onClose={() => setSelectedCollage(null)}
            />
        </div>
    );
};

export default CollagesPage; 