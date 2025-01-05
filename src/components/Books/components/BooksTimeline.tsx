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

        // Create simple black squares for books
        const squareSize = 20; // Size of the squares

        container.selectAll('.book-square')
            .data(sortedBooks)
            .enter()
            .append('rect')
            .attr('class', 'book-square')
            .attr('x', 20)
            .attr('y', d => yScale(d.publishYear) - squareSize/2)
            .attr('width', squareSize)
            .attr('height', squareSize)
            .attr('fill', '#000000');

    }, [books]);

    return (
        <div className="books-timeline">
            <svg ref={timelineRef}></svg>
        </div>
    );
};

export default BooksTimeline; 