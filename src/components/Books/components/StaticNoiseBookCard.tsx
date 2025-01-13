import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StaticNoiseBookCard.css';

interface StaticNoiseBookCardProps {
    id: string;
    title: string;
    author: string;
    publishYear: number;
    coverImage: string;
    location?: {
        city: string;
    };
}

const StaticNoiseBookCard: React.FC<StaticNoiseBookCardProps> = ({
    id,
    title,
    author,
    publishYear,
    coverImage,
    location
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<NodeJS.Timeout>();
    const isHoveringRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = coverImage;
        
        img.onload = () => {
            // Initial draw with static noise
            drawStaticNoise(ctx, img, false);
        };

        return () => {
            if (animationFrameRef.current) {
                clearTimeout(animationFrameRef.current);
            }
        };
    }, [coverImage]);

    const drawStaticNoise = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        isAnimated: boolean
    ) => {
        // Draw the image first
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
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

        const numDots = 30; // Reduced number of dots
        for (let i = 0; i < numDots; i++) {
            const x = Math.floor(Math.random() * ctx.canvas.width);
            const y = Math.floor(Math.random() * ctx.canvas.height);
            const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
            const pixelIndex = (y * ctx.canvas.width + x) * 4;

            // Draw a 2x2 pixel dot
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const index = pixelIndex + (dy * ctx.canvas.width + dx) * 4;
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

        if (isAnimated && isHoveringRef.current) {
            // Slower animation - update every 12 frames instead of 6
            animationFrameRef.current = setTimeout(() => {
                requestAnimationFrame(() => drawStaticNoise(ctx, img, true));
            }, 100); // Increased delay for slower animation
        }
    };

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = coverImage;
        img.onload = () => {
            drawStaticNoise(ctx, img, true);
        };
    };

    const handleMouseLeave = () => {
        isHoveringRef.current = false;
        if (animationFrameRef.current) {
            clearTimeout(animationFrameRef.current);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = coverImage;
        img.onload = () => {
            // Draw one frame of static noise without animation
            drawStaticNoise(ctx, img, false);
        };
    };

    return (
        <Link to={`/books/${id}`} className="static-noise-book-card">
            <div 
                className="card-image-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="card-canvas"
                />
            </div>
            <div className="card-info">
                <div className="card-main-info">
                    <h2>{title}</h2>
                    <span className="card-year">{publishYear}</span>
                </div>
                <div className="card-meta">
                    <span className="card-author">{author}</span>
                    {location && (
                        <span className="card-location">{location.city}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default StaticNoiseBookCard; 