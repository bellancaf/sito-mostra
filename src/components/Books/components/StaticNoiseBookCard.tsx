import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StaticNoiseBookCard.css';
import { getImagePaths } from '../../../utils/imageUtils';

interface StaticNoiseBookCardProps {
    id: string;
    title: string;
    author: string;
    publishYear: number;
    coverImage?: string;
    location?: string;
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

    const { thumbnail } = getImagePaths(coverImage || '');

    const drawDefaultPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        // Fill with a light gray background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        
        // Add some simple geometric pattern
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        
        // Draw diagonal lines
        for (let i = 0; i < width + height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(0, i);
            ctx.stroke();
        }
    };

    const drawNoiseEffect = (
        ctx: CanvasRenderingContext2D,
        baseImage: HTMLImageElement | null,
        width: number,
        height: number
    ) => {
        // If we have a base image and it's loaded, draw it
        if (baseImage?.complete && baseImage.naturalWidth > 0) {
            try {
                ctx.drawImage(baseImage, 0, 0, width, height);
            } catch (e) {
                drawDefaultPattern(ctx, width, height);
            }
        } else {
            // Otherwise draw the default pattern
            drawDefaultPattern(ctx, width, height);
        }

        // Add noise effect
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Add semi-transparent noise
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i + 3] = value * 0.3;
        }

        // Add colored dots
        const primaryColors = [[255, 0, 0], [255, 255, 0], [0, 0, 255]];
        const numDots = 15;
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
                        data[index + 3] = 255;
                    }
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    };

    const handleMouseEnter = () => {
        isHoveringRef.current = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = coverImage ? new Image() : null;
        if (img && coverImage) {
            img.src = coverImage;
        }

        let lastDrawTime = performance.now();
        const animate = () => {
            if (!isHoveringRef.current) return;

            const now = performance.now();
            if (now - lastDrawTime >= 100) {
                lastDrawTime = now;
                drawNoiseEffect(ctx, img, canvas.width, canvas.height);
            }
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
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

        const img = coverImage ? new Image() : null;
        if (img && coverImage) {
            img.src = coverImage;
        }
        drawNoiseEffect(ctx, img, canvas.width, canvas.height);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = coverImage ? new Image() : null;
        if (img && coverImage) {
            img.src = coverImage;
            img.onload = () => {
                drawNoiseEffect(ctx, img, canvas.width, canvas.height);
            };
            img.onerror = () => {
                drawNoiseEffect(ctx, null, canvas.width, canvas.height);
            };
        } else {
            drawNoiseEffect(ctx, null, canvas.width, canvas.height);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [coverImage]);

    return (
        <Link to={`/books/${id}`} className="book-card">
            <canvas
                ref={canvasRef}
                width={300}
                height={400}
                style={{
                    backgroundImage: `url(${thumbnail})`,
                    backgroundSize: 'cover'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div className="book-info">
                <h3>{title}</h3>
                <p>{author}</p>
                <p>{publishYear}</p>
                {location && <p>{location}</p>}
            </div>
        </Link>
    );
};

export default StaticNoiseBookCard;