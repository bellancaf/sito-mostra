import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Book } from '../../../types';
import './BooksTimeline.css';
import { getImagePaths } from '../../../utils/imageUtils';
import useMediaQuery from '../../../hooks/useMediaQuery';

interface BooksTimelineProps {
    books: Book[];
}

const BooksTimeline: React.FC<BooksTimelineProps> = ({ books }) => {
    const timelineRef = useRef<SVGSVGElement>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (!timelineRef.current) return;

        // Adjust dimensions for mobile
        const width = timelineRef.current.clientWidth;
        const height = isMobile ? 400 : 600; // Shorter on mobile
        const margin = isMobile ? 
            { top: 20, right: 20, bottom: 20, left: 20 } : 
            { top: 40, right: 40, bottom: 40, left: 40 };

        // Clear any existing content
        d3.select(timelineRef.current).selectAll("*").remove();

        const squareSize = 12; // Smaller square size
        const squareGap = 3; // Smaller gap between squares
        const hoverImageWidth = 120; // Width of hover image
        const hoverImageHeight = 180; // Height of hover image

        const svg = d3.select(timelineRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create defs element for patterns and clips
        const defs = svg.append('defs');

        // Create the timeline container
        const container = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Calculate the year range
        const years = books.map(book => book.publishYear);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);

        // Create scales
        const yScale = d3.scaleLinear()
            .domain([minYear - 1, maxYear + 1]) // Add padding to the domain
            .range([0, height - margin.top - margin.bottom]);

        // Draw the timeline line
        container.append('line')
            .attr('class', 'timeline-line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - margin.top - margin.bottom);

        // Create year markers
        const yearStep = 5;
        const yearRange = d3.range(
            Math.floor(minYear / yearStep) * yearStep, 
            maxYear + yearStep, 
            yearStep
        );

        const yearMarkers = container.selectAll('.year-marker')
            .data(yearRange)
            .enter()
            .append('g')
            .attr('class', 'year-marker')
            .attr('transform', d => `translate(0, ${yScale(d)})`);

        yearMarkers.append('line')
            .attr('x1', -5)
            .attr('x2', 5)
            .attr('y1', 0)
            .attr('y2', 0);

        yearMarkers.append('text')
            .attr('x', -10)
            .attr('y', 0)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .text(d => d);

        // Group books by year
        const booksByYear = d3.group(books, d => d.publishYear);

        // Create hover container for book details
        const hoverContainer = svg.append('g')
            .attr('class', 'hover-container')
            .style('visibility', 'hidden');

        // Create an image container group
        const imageContainer = hoverContainer.append('g')
            .attr('class', 'image-container');

        // Add a clipping path for the image
        const clipPath = defs.append('clipPath')
            .attr('id', 'hover-image-clip')
            .append('rect')
            .attr('width', 80)  // Narrower width for consistent vertical look
            .attr('height', 120);

        // Just the image, with clipping path
        const hoverImage = imageContainer.append('image')
            .attr('width', 80)
            .attr('height', 120)
            .attr('clip-path', 'url(#hover-image-clip)')
            .attr('preserveAspectRatio', 'xMidYMid slice');

        // Create a text group for title and year - positioned closer to image
        const textGroup = hoverContainer.append('g')
            .attr('transform', 'translate(0, 130)'); // Reduced gap after image

        // Create an invisible container for text measurements
        const measureContainer = svg.append('g')
            .attr('class', 'measure-container')
            .style('visibility', 'hidden')
            .style('pointer-events', 'none');

        // Function to wrap text
        const wrapText = (text: string, width: number): string[] => {
            const words = text.split(/\s+/);
            const lines: string[] = [];
            let line = '';

            words.forEach(word => {
                const testLine = line + (line ? ' ' : '') + word;
                const testWidth = measureContainer
                    .append('text')
                    .style('font-family', 'var(--font-family-barcode)')
                    .style('font-size', 'var(--text-base)')
                    .text(testLine)
                    .node()!
                    .getComputedTextLength();

                // Clean up the measurement text element
                measureContainer.selectAll('*').remove();

                if (testWidth > width) {
                    lines.push(line);
                    line = word;
                } else {
                    line = testLine;
                }
            });
            
            lines.push(line);
            return lines;
        };

        // Title text - left aligned, with wrapping
        const titleLines = textGroup.append('g')
            .attr('class', 'title-lines');

        // Year text - positioned after title
        const hoverYear = textGroup.append('text')
            .attr('class', 'hover-year')
            .attr('text-anchor', 'start');

        // Create book squares
        Array.from(booksByYear.entries()).forEach(([year, yearBooks]) => {
            const baseY = yScale(+year);
            
            yearBooks.forEach((book, i) => {
                const square = container.append('rect')
                    .attr('class', 'book-square')
                    .attr('x', 20 + (i * (squareSize + squareGap)))
                    .attr('y', baseY - squareSize/2)
                    .attr('width', squareSize)
                    .attr('height', squareSize)
                    .attr('fill', 'var(--color-border)')
                    .attr('stroke', 'none')
                    .style('cursor', 'pointer')
                    .on('mouseover', function(event) {
                        const [mouseX, mouseY] = d3.pointer(event, svg.node());
                        
                        // Clear previous title lines
                        titleLines.selectAll('*').remove();
                        
                        // Wrap title text
                        const wrappedLines = wrapText(book.title, 80); // Match image width
                        
                        // Add each line
                        wrappedLines.forEach((line, i) => {
                            titleLines.append('text')
                                .attr('class', 'hover-title')
                                .attr('x', 0)
                                .attr('y', i * 20)
                                .text(line);
                        });

                        // Position year after the last line
                        hoverYear
                            .attr('x', 0)
                            .attr('y', wrappedLines.length * 20)
                            .text(`(${book.publishYear})`);

                        // Calculate dimensions with new consistent height
                        const totalHeight = 120 + ((wrappedLines.length + 1) * 20); // Image height + text height
                        const totalWidth = 80; // Narrower image width

                        // Calculate positions with boundary checking
                        let xPos = mouseX + 20;
                        let yPos = mouseY - totalHeight/2;

                        // Check right boundary
                        if (xPos + totalWidth > width - margin.right) {
                            xPos = mouseX - totalWidth - 20;
                        }

                        // Check top boundary
                        if (yPos < margin.top) {
                            yPos = margin.top;
                        }

                        // Check bottom boundary
                        if (yPos + totalHeight > height - margin.bottom) {
                            yPos = height - margin.bottom - totalHeight;
                        }

                        // Apply the calculated position
                        hoverContainer
                            .attr('transform', `translate(${xPos}, ${yPos})`)
                            .style('visibility', 'visible');
                        
                        const { thumbnail } = getImagePaths(book.coverImage || '');
                        hoverImage.attr('href', thumbnail);
                        
                        d3.select(this)
                            .attr('fill', 'var(--color-accent)');
                    })
                    .on('mouseout', function() {
                        hoverContainer.style('visibility', 'hidden');
                        d3.select(this)
                            .attr('fill', 'var(--color-border)');
                    })
                    .on('click', () => {
                        window.location.href = `/books/${book.id}`;
                    });

                // Adjust text and interaction for mobile
                if (isMobile) {
                    // Simplify hover interaction
                    square
                        .on('click', function(event) {
                            // Show a simpler tooltip
                            const tooltip = d3.select('.tooltip');
                            tooltip.html(`
                                <strong>${book.title}</strong><br>
                                ${book.publishYear}
                            `);
                            tooltip.style('visibility', 'visible');
                        });
                }
            });
        });

    }, [books, isMobile]);

    return (
        <div className="timeline-container">
            <svg 
                ref={timelineRef} 
                className={`books-timeline ${isMobile ? 'mobile' : ''}`}
            ></svg>
        </div>
    );
};

export default BooksTimeline; 