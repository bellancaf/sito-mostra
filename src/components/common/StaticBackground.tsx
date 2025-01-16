import React, { useEffect, useRef } from 'react';

const generateStaticNoise = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    opacity: number
) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const pixelSize = 4;

    // Generate static noise background
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            const value = Math.random() * 255;
            
            for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
                for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
                    const i = ((y + dy) * width + (x + dx)) * 4;
                    data[i] = value;     // R
                    data[i + 1] = value; // G
                    data[i + 2] = value; // B
                    data[i + 3] = 255 * opacity;   // A with opacity
                }
            }
        }
    }

    return imageData;
};

const animateColoredPixels = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    staticNoise: ImageData,
    lastUpdateTime: { current: number },
    animationFrameRef: { current: number | undefined }
) => {
    const now = performance.now();
    const updateInterval = 1000; // Update every second

    if (now - lastUpdateTime.current < updateInterval) {
        // If not time to update, just request next frame
        animationFrameRef.current = requestAnimationFrame(() => 
            animateColoredPixels(ctx, width, height, staticNoise, lastUpdateTime, animationFrameRef)
        );
        return;
    }

    lastUpdateTime.current = now;

    // Restore the static noise background
    ctx.putImageData(staticNoise, 0, 0);

    const primaryColors = [
        [255, 0, 0],    // Red
        [0, 255, 0],    // Green
        [0, 0, 255]     // Blue
    ];

    const pixelSize = 4;
    const numPixels = 20; // Reduced number of pixels

    // Draw random colored pixels
    for (let i = 0; i < numPixels; i++) {
        const x = Math.floor(Math.random() * (width / pixelSize)) * pixelSize;
        const y = Math.floor(Math.random() * (height / pixelSize)) * pixelSize;
        
        const color = primaryColors[Math.floor(Math.random() * primaryColors.length)];

        // Draw colored pixel block with full opacity
        ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    // Loop the animation
    animationFrameRef.current = requestAnimationFrame(() => 
        animateColoredPixels(ctx, width, height, staticNoise, lastUpdateTime, animationFrameRef)
    );
};

const StatementBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const lastUpdateTime = useRef<number>(0);
    const staticNoiseRef = useRef<ImageData | null>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateCanvasSize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                // Generate static noise once with lower opacity (0.15 instead of 0.3)
                staticNoiseRef.current = generateStaticNoise(ctx, canvas.width, canvas.height, 0.05);
                
                // Start animation of colored pixels
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                if (staticNoiseRef.current) {
                    animateColoredPixels(ctx, canvas.width, canvas.height, staticNoiseRef.current, lastUpdateTime, animationFrameRef);
                }
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="noise-background" 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }}
        />
    );
};

export default StatementBackground; 