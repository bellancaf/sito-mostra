import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { drawStaticNoise } from '../../Books/components/StaticNoiseBookCard';
import './StaticNoiseCollageCard.css';

interface StaticNoiseCollageCardProps {
    id: string;
    title: string;
    date: string;
    image: string;
    onClick?: () => void;
}

const StaticNoiseCollageCard: React.FC<StaticNoiseCollageCardProps> = ({
    id,
    title,
    date,
    image,
    onClick
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
        img.src = image;
        imageRef.current = img;
        
        img.onload = () => {
            drawStaticNoise(ctx, img, canvas.width, canvas.height, false, lastDrawTime, isHoveringRef, animationFrameRef);
        };

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [image]);

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

    const content = (
        <>
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
                <span className="card-date">{date}</span>
            </div>
        </>
    );

    if (onClick) {
        return (
            <div onClick={onClick} className="static-noise-collage-card">
                {content}
            </div>
        );
    }

    return (
        <Link to={`/collages/${id}`} className="static-noise-collage-card">
            {content}
        </Link>
    );
};

export default StaticNoiseCollageCard; 