import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StaticNoiseBookCard.css';

export const drawStaticNoise = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
    isAnimated: boolean,
    lastDrawTime: { current: number },
    isHoveringRef: { current: boolean },
    animationFrameRef: { current: number | undefined }
) => {
    const now = performance.now();
    if (isAnimated && now - lastDrawTime.current < 100) {
        animationFrameRef.current = requestAnimationFrame(() => 
            drawStaticNoise(ctx, img, width, height, isAnimated, lastDrawTime, isHoveringRef, animationFrameRef)
        );
        return;
    }
    lastDrawTime.current = now;

    // Draw the image first
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Draw semi-transparent noise with much lower opacity
    for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i + 3] = value * 0.90; // Reduced from 0.3 to 0.15 for more transparency
    }

    // Add colored dots with reduced opacity
    const primaryColors = [
        [255, 0, 0],    // Red
        [0, 255, 0],    // Green
        [0, 0, 255]     // Blue
    ];

    const numDots = 20; // Reduced number of dots
    for (let i = 0; i < numDots; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
        const pixelIndex = (y * width + x) * 4;

        for (let dy = 0; dy < 2; dy++) {
            for (let dx = 0; dx < 2; dx++) {
                const index = pixelIndex + (dy * width + dx) * 4;
                if (index < data.length - 3) {
                    data[index] = color[0];
                    data[index + 1] = color[1];
                    data[index + 2] = color[2];
                    data[index + 3] = 180; // Reduced opacity for colored dots
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    if (isAnimated && isHoveringRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => 
            drawStaticNoise(ctx, img, width, height, isAnimated, lastDrawTime, isHoveringRef, animationFrameRef)
        );
    }
};

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
    const animationFrameRef = useRef<number>();
    const isHoveringRef = useRef(false);
    const imageRef = useRef<HTMLImageElement>();
    const lastDrawTime = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.src = coverImage;
        imageRef.current = img;
        
        img.onload = () => {
            // Initial draw with static noise
            drawStaticNoise(ctx, img, canvas.width, canvas.height, false, lastDrawTime, isHoveringRef, animationFrameRef);
        };

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [coverImage]);

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (imageRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            drawStaticNoise(ctx, imageRef.current, canvas.width, canvas.height, true, lastDrawTime, isHoveringRef, animationFrameRef);
        }
    };

    const handleMouseLeave = () => {
        isHoveringRef.current = false;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (imageRef.current) {
            drawStaticNoise(ctx, imageRef.current, canvas.width, canvas.height, false, lastDrawTime, isHoveringRef, animationFrameRef);
        }
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
                </div>
                <span className="card-year">{publishYear}</span>
            </div>
        </Link>
    );
};

export default StaticNoiseBookCard;