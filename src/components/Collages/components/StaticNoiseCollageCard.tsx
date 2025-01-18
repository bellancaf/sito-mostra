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
    forceHover?: boolean;
}

const StaticNoiseCollageCard: React.FC<StaticNoiseCollageCardProps> = ({
    id,
    title,
    date,
    image,
    forceHover = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const lastDrawTime = useRef<number>(0);

    useEffect(() => {
        if (forceHover) {
            handleMouseEnter();
        } else {
            handleMouseLeave();
        }
    }, [forceHover]);

    const handleMouseEnter = () => {
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
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <Link 
            to={`/collages/${id}`} 
            className={`static-noise-collage-card ${forceHover ? 'force-hover' : ''}`}
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