import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collages } from '../../data';
import * as d3 from 'd3';
import './CollagesPage.css';
import StaticNoiseCollageCard from './components/StaticNoiseCollageCard';

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
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const networkRef = useRef<SVGSVGElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const updateNetworkSize = () => {
            if (!networkRef.current) return;
            
            networkRef.current.style.height = 'calc(100vh - 400px)';
            createNetworkVisualization();
        };

        updateNetworkSize();
        window.addEventListener('resize', updateNetworkSize);
        
        return () => window.removeEventListener('resize', updateNetworkSize);
    }, []);

    const createNetworkVisualization = () => {
        if (!networkRef.current) return;

        const width = networkRef.current.clientWidth || 800;
        const height = networkRef.current.clientHeight || 600;
        const margin = 50;

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.2, 3])
            .on('zoom', (event) => {
                container.attr('transform', event.transform);
            });

        // Clear existing SVG content
        const svg = d3.select(networkRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(zoom as any)
            .on("dblclick.zoom", null);

        svg.selectAll("*").remove();

        // Create a container group for all elements
        const container = svg.append('g');

        const setupVisualization = async () => {
            const nodes: NodeDatum[] = collages.map(collage => ({
                id: collage.id,
                title: collage.title,
                image: collage.image,
                date: collage.date,
                rectWidth: 10,
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
                    navigate(`/collages/${d.id}`);
                })
                .on('mouseenter', (event, d) => {
                    d3.select(event.currentTarget).select('circle')
                        .transition()
                        .duration(200)
                        .attr('r', 7)
                        .attr('fill', 'var(--color-accent)');
                    setHoveredNodeId(d.id);
                })
                .on('mouseleave', (event) => {
                    d3.select(event.currentTarget).select('circle')
                        .transition()
                        .duration(200)
                        .attr('r', 5)
                        .attr('fill', 'black');
                    setHoveredNodeId(null);
                });

            // Add circles for nodes
            nodeGroup.append('circle')
                .attr('r', 5)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .attr('stroke-width', 1);

            const simulation = d3.forceSimulation<NodeDatum>(nodes)
                .force('link', d3.forceLink<NodeDatum, LinkDatum>(links)
                    .id(d => d.id)
                    .distance(70))
                .force('charge', d3.forceManyBody()
                    .strength(-150))
                .force('collision', d3.forceCollide()
                    .radius(8))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('x', d3.forceX(width / 2).strength(0.15))
                .force('y', d3.forceY(height / 2).strength(0.15))
                .force('boundary', () => {
                    for (const node of nodes) {
                        node.x = Math.max(margin, Math.min(width - margin, node.x!));
                        node.y = Math.max(margin, Math.min(height - margin, node.y!));
                    }
                });

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
                            Here you can find my collages.
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
                            forceHover={hoveredNodeId === collage.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollagesPage; 