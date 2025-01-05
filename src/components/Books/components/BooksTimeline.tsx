import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Book } from '../../../types';
import './BooksTimeline.css';

interface BooksTimelineProps {
    books: Book[];
}

const BooksTimeline: React.FC<BooksTimelineProps> = ({ books }) => {
    const timelineRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!timelineRef.current) return;

        // Clear any existing content
        d3.select(timelineRef.current).selectAll("*").remove();

        const margin = { top: 40, right: 40, bottom: 40, left: 60 };
        const width = timelineRef.current.clientWidth;
        const height = Math.max(600, books.length * 60);

        const imageWidth = 60;  // Adjust size as needed
        const imageHeight = 90; // Adjust size as needed

        const svg = d3.select(timelineRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create the timeline container
        const container = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Calculate the year range
        const years = books.map(book => book.publishYear);
        const minYear = Math.min(...years);
        const maxYear = 2025;

        // Create scales
        const yScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([0, height - margin.top - margin.bottom]);

        // Draw the timeline line
        container.append('line')
            .attr('class', 'timeline-line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', height - margin.top - margin.bottom);

        // Create year markers (every 5 years)
        const yearStep = 5;
        const yearRange = d3.range(
            Math.floor(minYear / yearStep) * yearStep, 
            maxYear, 
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

        // Sort books by year
        const sortedBooks = [...books].sort((a, b) => a.publishYear - b.publishYear);

        // Create patterns for book covers
        const defs = svg.append('defs');
        sortedBooks.forEach(book => {
            defs.append('pattern')
                .attr('id', `timeline-image-${book.id}`)
                .attr('width', 1)
                .attr('height', 1)
                .append('image')
                .attr('href', book.coverImage)
                .attr('width', imageWidth)
                .attr('height', imageHeight)
                .attr('preserveAspectRatio', 'xMidYMid meet');
        });

        // Create book cover rectangles
        const bookGroups = container.selectAll('.book-group')
            .data(sortedBooks)
            .enter()
            .append('g')
            .attr('class', 'book-group')
            .attr('transform', d => `translate(20, ${yScale(d.publishYear) - imageHeight/2})`);

        // Add the book covers
        bookGroups.append('rect')
            .attr('width', imageWidth)
            .attr('height', imageHeight)
            .attr('fill', d => `url(#timeline-image-${d.id})`)
            .style('cursor', 'pointer')
            .on('click', (event, d) => {
                window.location.href = `/books/${d.id}`;
            });

        // Optional: Add hover effect with book title
        bookGroups.append('title')
            .text(d => `${d.title} (${d.publishYear})`);

    }, [books]);

    return (
        <div className="books-timeline">
            <svg ref={timelineRef}></svg>
        </div>
    );
};

export default BooksTimeline; 