import React, { useEffect, useRef } from 'react';

// Define color combinations outside
const colorCombos = [
    { r: 0, g: 0, b: 0 },        // Black (for black & white)
    { r: 255, g: 0, b: 0 },      // Red (for red & white)
    { r: 0, g: 255, b: 0 },      // Green (for green & white)
    { r: 0, g: 0, b: 255 }       // Blue (for blue & white)
];

const animateStaticNoise = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    lastDrawTime: { current: number },
    animationFrameRef: { current: number | undefined },
    selectedColor: { r: number, g: number, b: number }
) => {
    // Always request next frame first to ensure continuous animation
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

    // Use white and the selected color for the entire animation
    const whiteColor = { r: 255, g: 255, b: 255 };

    // Generate new static noise each frame
    for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
            // Randomly choose between white and the selected color
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

interface StaticTransitionProps {
    isVisible: boolean;
    onTransitionComplete?: () => void;
    duration?: number;
}

const StaticTransition: React.FC<StaticTransitionProps> = ({ 
    isVisible, 
    onTransitionComplete,
    duration = 1000 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);
    const lastDrawTime = useRef<number>(0);
    const selectedColorRef = useRef(colorCombos[Math.floor(Math.random() * colorCombos.length)]);
    
    // Start animation immediately and keep it running
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Start the animation
        animateStaticNoise(ctx, canvas.width, canvas.height, lastDrawTime, animationFrameRef, selectedColorRef.current);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Handle transition end
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTransitionEnd = () => {
            if (!isVisible && onTransitionComplete) {
                onTransitionComplete();
            }
        };

        container.addEventListener('transitionend', handleTransitionEnd);
        return () => container.removeEventListener('transitionend', handleTransitionEnd);
    }, [isVisible, onTransitionComplete]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'all' : 'none',
                transition: `opacity ${duration}ms ease-in-out`,
            }}
        >
            <canvas 
                ref={canvasRef} 
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default StaticTransition; 