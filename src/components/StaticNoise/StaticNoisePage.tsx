import React, { useEffect, useRef } from 'react';
import './StaticNoisePage.css';

interface ColoredPixel {
    position: number;
    previousPosition: number;
    color: [number, number, number];
    nextMoveFrame: number;
    isMoving: boolean;
    moveProgress: number;
}

const StaticNoisePage: React.FC = () => {
    const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageCanvasRef = useRef<HTMLCanvasElement>(null);
    const blendedCanvasRef = useRef<HTMLCanvasElement>(null);
    const frameCountRef = useRef(0);
    const animationFrameRef = useRef<number>();
    const isHoveringRef = useRef<{ [key: string]: boolean }>({
        noise: false,
        blended: false
    });

    useEffect(() => {
        const noiseCanvas = noiseCanvasRef.current;
        const imageCanvas = imageCanvasRef.current;
        const blendedCanvas = blendedCanvasRef.current;
        if (!noiseCanvas || !imageCanvas || !blendedCanvas) return;

        const noiseCtx = noiseCanvas.getContext('2d');
        const imageCtx = imageCanvas.getContext('2d');
        const blendedCtx = blendedCanvas.getContext('2d');
        if (!noiseCtx || !imageCtx || !blendedCtx) return;

        // Define primary colors for dots
        const primaryColors = [
            [255, 0, 0],    // Red
            [255, 255, 0],  // Yellow
            [0, 0, 255]     // Blue
        ];

        // Load background image
        const img = new Image();
        img.src = '/images/books/revue_mondiale.jpg';
        img.onload = () => {
            // Draw the plain image on all canvases
            imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            noiseCtx.drawImage(img, 0, 0, noiseCanvas.width, noiseCanvas.height);
            blendedCtx.drawImage(img, 0, 0, blendedCanvas.width, blendedCanvas.height);
            
            // Draw initial static noise
            drawNoiseOverlay(noiseCtx);
            drawNoiseOverlay(blendedCtx);
        };

        const drawNoiseOverlay = (ctx: CanvasRenderingContext2D) => {
            const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            const data = imageData.data;
            const width = ctx.canvas.width;
            const height = ctx.canvas.height;

            // Draw semi-transparent noise
            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                // Only modify the alpha channel for overlay effect
                data[i + 3] = value * 0.3; // 30% opacity for noise
            }

            // Add colored dots
            const numDots = 50; // Number of colored dots
            for (let i = 0; i < numDots; i++) {
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];
                const pixelIndex = (y * width + x) * 4;

                // Draw a 2x2 pixel dot
                for (let dy = 0; dy < 2; dy++) {
                    for (let dx = 0; dx < 2; dx++) {
                        const index = pixelIndex + (dy * width + dx) * 4;
                        if (index < data.length - 3) {
                            data[index] = color[0];     // Red
                            data[index + 1] = color[1]; // Green
                            data[index + 2] = color[2]; // Blue
                            data[index + 3] = 255;      // Full opacity
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };

        const animate = () => {
            frameCountRef.current += 1;

            // Update noise every 6 frames for slower movement
            if (frameCountRef.current % 6 === 0) {
                if (isHoveringRef.current.noise) {
                    noiseCtx.drawImage(img, 0, 0, noiseCanvas.width, noiseCanvas.height);
                    drawNoiseOverlay(noiseCtx);
                }

                if (isHoveringRef.current.blended) {
                    blendedCtx.drawImage(img, 0, 0, blendedCanvas.width, blendedCanvas.height);
                    drawNoiseOverlay(blendedCtx);
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleMouseEnter = (canvas: 'noise' | 'blended') => {
        isHoveringRef.current[canvas] = true;
    };

    const handleMouseLeave = (canvas: 'noise' | 'blended') => {
        isHoveringRef.current[canvas] = false;
    };

    return (
        <div className="static-noise-page">
            <div className="squares-container">
                <div 
                    className="noise-container"
                    onMouseEnter={() => handleMouseEnter('noise')}
                    onMouseLeave={() => handleMouseLeave('noise')}
                >
                    <canvas 
                        ref={noiseCanvasRef} 
                        width={300} 
                        height={300}
                        className="noise-canvas"
                    />
                    <span className="square-label">Static Noise (Hover to Animate)</span>
                </div>
                <div className="noise-container">
                    <canvas 
                        ref={imageCanvasRef} 
                        width={300} 
                        height={300}
                        className="noise-canvas"
                    />
                    <span className="square-label">Original Image</span>
                </div>
                <div 
                    className="noise-container"
                    onMouseEnter={() => handleMouseEnter('blended')}
                    onMouseLeave={() => handleMouseLeave('blended')}
                >
                    <canvas 
                        ref={blendedCanvasRef} 
                        width={300} 
                        height={300}
                        className="noise-canvas"
                    />
                    <span className="square-label">Blended Effect (Hover to Animate)</span>
                </div>
            </div>
        </div>
    );
};

export default StaticNoisePage; 