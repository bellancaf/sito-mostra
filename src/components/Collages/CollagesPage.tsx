import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collages } from '../../data';
import * as d3 from 'd3';
import './CollagesPage.css';
import CollagesSidebar from './components/CollagesSidebar';

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
            createNetworkVisualization();
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
            const nodes: NodeDatum[] = await Promise.all(collages.map(async collage => {
                const dimensions = await calculateDimensions(collage.image);
                return {
                    id: collage.id,
                    title: collage.title,
                    image: collage.image,
                    date: collage.date,
                    rectWidth: dimensions.width,
                    rectHeight: dimensions.height
                };
            }));

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

            // Create patterns for images
            const defs = svg.append('defs');
            nodes.forEach(node => {
                defs.append('pattern')
                    .attr('id', `image-${node.id}`)
                    .attr('width', 1)
                    .attr('height', 1)
                    .append('image')
                    .attr('href', node.image)
                    .attr('width', node.rectWidth!)
                    .attr('height', node.rectHeight!)
                    .attr('preserveAspectRatio', 'xMidYMid slice');
            });

            const link = container.append('g')
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', 1.5);

            const nodeGroup = container.append('g')
                .selectAll('g')
                .data(nodes)
                .join('g');

            // Add rectangles with image patterns
            nodeGroup
                .append('rect')
                .attr('width', d => d.rectWidth!)
                .attr('height', d => d.rectHeight!)
                .attr('fill', d => `url(#image-${d.id})`);

            // Add title background
            nodeGroup
                .append('rect')
                .attr('width', d => d.rectWidth!)
                .attr('height', 40)
                .attr('y', d => d.rectHeight! - 40)
                .attr('fill', 'rgba(0, 0, 0, 0.7)')
                .style('opacity', 0);

            // Add title text
            const titleText = nodeGroup
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('x', d => d.rectWidth! / 2)
                .attr('y', d => d.rectHeight! - 15)
                .attr('fill', '#ffffff')
                .text(d => d.title)
                .style('opacity', 0)
                .style('font-size', '10px');

            const simulation = d3.forceSimulation<NodeDatum>(nodes)
                .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
                    .id(d => d.id)
                    .distance(350))
                .force('charge', d3.forceManyBody()
                    .strength(-1200))
                .force('collision', d3.forceCollide()
                    .radius(d => Math.sqrt(targetArea) / 1.5))
                .force('center', d3.forceCenter(width / 2, height / 2))
                // Add boundary forces
                .force('x', d3.forceX(width / 2).strength(0.1))
                .force('y', d3.forceY(height / 2).strength(0.1))
                .force('boundary', () => {
                    for (const node of nodes) {
                        // Keep nodes within bounds
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
                    event.preventDefault();
                    const collage = collages.find(c => c.id === d.id);
                    if (collage) {
                        setSelectedCollage(collage);
                    }
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
                nodes.forEach(node => {
                    node.x = Math.max(margin, Math.min(width - margin, node.x!));
                    node.y = Math.max(margin, Math.min(height - margin, node.y!));
                });

                link
                    .attr('x1', d => d.source.x!)
                    .attr('y1', d => d.source.y!)
                    .attr('x2', d => d.target.x!)
                    .attr('y2', d => d.target.y!);

                nodeGroup
                    .attr('transform', d => 
                        `translate(${d.x! - d.rectWidth!/2},${d.y! - d.rectHeight!/2})`
                    );
            });
        };

        setupVisualization();
    };

    return (
        <div className="collages-container">
            <div className="collages-main-content">
                <h1 className="collages-title">Collages</h1>
                
                <div className="view-toggle">
                    <span className={`toggle-label ${!isGridView ? 'active' : ''}`}>
                        Network View
                    </span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={isGridView}
                            onChange={() => setIsGridView(!isGridView)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                    <span className={`toggle-label ${isGridView ? 'active' : ''}`}>
                        Grid View
                    </span>
                </div>

                {isGridView ? (
                    <div className="collages-grid">
                        {collages.map(collage => (
                            <Link 
                                to={`/collages/${collage.id}`} 
                                key={collage.id}
                                className="collage-card"
                            >
                                <div className="collage-cover-container">
                                    <img 
                                        src={collage.image} 
                                        alt={collage.title} 
                                        className="collage-cover"
                                    />
                                </div>
                                <div className="collage-info">
                                    <h2>{collage.title}</h2>
                                    <span className="collage-date">{collage.date}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <svg ref={networkRef} className="collages-network"></svg>
                )}
            </div>
            
            <CollagesSidebar 
                collage={selectedCollage}
                onClose={() => setSelectedCollage(null)}
            />
        </div>
    );
};

export default CollagesPage; 