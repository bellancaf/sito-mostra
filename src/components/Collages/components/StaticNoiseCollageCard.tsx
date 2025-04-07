import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './StaticNoiseCollageCard.css';

// Define color combinations
const colorCombos = [
    { r: 0, g: 0, b: 0 },        // Black
    { r: 255, g: 0, b: 0 },      // Red
    { r: 0, g: 255, b: 0 },      // Green
    { r: 0, g: 0, b: 255 }       // Blue
];

const animateStaticNoise = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    lastDrawTime: { current: number },
    animationFrameRef: { current: number | undefined },
    selectedColor: { r: number, g: number, b: number }
) => {
    animationFrameRef.current = requestAnimationFrame(() => 
        animateStaticNoise(ctx, width, height, lastDrawTime, animationFrameRef, selectedColor)
    );

    const now = performance.now();
    const frameInterval = 100;

    if (now - lastDrawTime.current < frameInterval) {
        return;
    }

    lastDrawTime.current = now;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const pixelSize = 4;

    const whiteColor = { r: 255, g: 255, b: 255 };

    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            const useWhite = Math.random() > 0.5;
            const color = useWhite ? whiteColor : selectedColor;
            
            for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
                for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
                    const i = ((y + dy) * width + (x + dx)) * 4;
                    data[i] = color.r;     // R
                    data[i + 1] = color.g; // G
                    data[i + 2] = color.b; // B
                    data[i + 3] = 255;     // A
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

interface StaticNoiseCollageCardProps {
    id: string;
    title: string;
    date: string;
    image: string;
    simplified?: boolean;
}

const StaticNoiseCollageCard: React.FC<StaticNoiseCollageCardProps> = ({
    id,
    title,
    date,
    image,
    simplified = false
}) => {
    // Move all hooks to the top level - they will always be called
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const lastDrawTime = useRef<number>(0);

    useEffect(() => {
        // Only run the animation if not simplified
        if (simplified || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const selectedColor = colorCombos[Math.floor(Math.random() * colorCombos.length)];

        animateStaticNoise(
            ctx, 
            canvas.width, 
            canvas.height, 
            lastDrawTime, 
            animationFrameRef, 
            selectedColor
        );

        // Cleanup function
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [simplified]); // Add simplified to dependencies

    const handleMouseEnter = () => {
        if (simplified) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const selectedColor = colorCombos[Math.floor(Math.random() * colorCombos.length)];

        animateStaticNoise(
            ctx, 
            canvas.width, 
            canvas.height, 
            lastDrawTime, 
            animationFrameRef, 
            selectedColor
        );
    };

    const handleMouseLeave = () => {
        if (simplified) return;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Render simplified version
    if (simplified) {
        return (
            <Link to={`/collages/${id}`} className="collage-card simplified">
                <img
                    src={image}
                    alt={title}
                    className="collage-thumbnail"
                />
                <div className="collage-info">
                    <h3>{title}</h3>
                    <p>{date}</p>
                </div>
            </Link>
        );
    }

    // Render full version
    return (
        <Link 
            to={`/collages/${id}`} 
            className="static-noise-collage-card"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="card-image-container">
                <img 
                    src={image} 
                    alt={title}
                    className="card-image"
                />
                <canvas
                    ref={canvasRef}
                    className="card-canvas"
                    width={300}
                    height={300}
                />
            </div>
            <div className="card-info">
                <div className="card-main-info">
                    <h2>{title}</h2>
                </div>
                <div className="card-date">{date}</div>
            </div>
        </Link>
    );
};

export default StaticNoiseCollageCard; 